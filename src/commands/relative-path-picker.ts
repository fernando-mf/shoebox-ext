import * as vscode from 'vscode';
import * as R from 'ramda';

import * as logger from '../utils/logger';
import { COMMAND_UID } from './commands';
import cleanFileName from '../utils/clean-file-name';
import { getConfigParam } from '../utils/config';
import {
	absolutePathToRelative,
	absolutePathToRelativeMatch
} from '../utils/path';
import CONSTANTS from '../utils/constants';

/**
 * Converts a file path to a QuickPickItem, the label is built using the
 * last `tokenCount` items
 * @param filePath
 * @param tokens
 */
function pathToQuickPickItemFile(
	filePath: string,
	singleFile: boolean,
	folder?: string
): vscode.QuickPickItem {
	const label = singleFile
		? R.last(filePath.split('/'))
		: absolutePathToRelativeMatch(filePath, folder!);

	return {
		label: label || '',
		description: absolutePathToRelative(filePath)
	};
}

class GlobalFileQuickPick {
	// Single instance
	private static _instance: GlobalFileQuickPick | undefined;

	quickPick: vscode.QuickPick<vscode.QuickPickItem>;
	glob: string | undefined;

	// Cached promise result
	private data: string[] | undefined;

	private constructor() {
		this.quickPick = vscode.window.createQuickPick();
	}

	private static getInstance() {
		if (!this._instance) {
			this._instance = new GlobalFileQuickPick();
		}

		return this._instance;
	}

	private async configureQuickPickData(glob: string) {
		this.glob = glob;
		// Create a new glob with the updated regex and run it
		const filePromise = vscode.workspace
			.findFiles(this.glob)
			.then(files => files.map(file => file.path));

		this.data = await filePromise;
	}

	private configQuickPick = async (
		glob: string,
		callback: (e: string | undefined) => any
	) => {
		if (this.glob !== glob) {
			await this.configureQuickPickData(glob);

			this.quickPick.placeholder = `Pick a file, I'll give you the relative path 😛`;

			this.quickPick.onDidChangeSelection(items => {
				const filePath = this.data!.find(data =>
					data.includes(items[0].description!)
				);
				callback(filePath);
				this.quickPick.hide();
			});

			this.quickPick.onDidChangeValue(value => {
				// If we look for file, we change the labels to this format
				// `folder/file`
				if (R.contains('/', value)) {
					this.quickPick.items = this.data!.map(filePath =>
						pathToQuickPickItemFile(filePath, false, value)
					);
					// Otherwise keep only file names
				} else {
					this.quickPick.items = this.data!.map(filePath =>
						pathToQuickPickItemFile(filePath, true)
					);
				}
			});
		}
	};

	static show = async (
		glob: string,
		callback: (e: string | undefined) => any
	) => {
		const instance = GlobalFileQuickPick.getInstance();

		// Config the quick pick if necessary
		await instance.configQuickPick(glob, callback);

		// We need to reset the items before every `show`. They get cleared
		// after the selection changes
		instance.quickPick.items = instance.data!.map(filePath =>
			pathToQuickPickItemFile(filePath, true)
		);

		instance.quickPick.show();
	};
}

const shoeboxRelativePathPicker = vscode.commands.registerCommand(
	COMMAND_UID.RELATIVE_PATH_PICKER,
	async () => {
		const workspaceGlobconfig =
			getConfigParam<string>('filePickerGlob') || CONSTANTS.FILES_GLOB;

		GlobalFileQuickPick.show(workspaceGlobconfig, item => {
			const projectPathPrefix = getConfigParam<string>('projectPrefix')!;
			const rootFolder = getConfigParam<string>('rootFolder')!;

			if (item && projectPathPrefix) {
				const relativeFilename = cleanFileName(
					item,
					rootFolder,
					projectPathPrefix
				);
				vscode.env.clipboard.writeText(relativeFilename);
				logger.log('Copied fileName to clipboard', relativeFilename);
			}
		});

		return;
	}
);

export default shoeboxRelativePathPicker;
