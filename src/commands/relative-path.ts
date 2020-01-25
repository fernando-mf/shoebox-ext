import * as vscode from 'vscode';

import * as logger from '../utils/logger';
import { COMMAND_UID } from './commands';
import cleanFileName from '../utils/clean-file-name';
import { getConfigParam } from '../utils/config';

const shoeboxRelativePath = vscode.commands.registerCommand(
	COMMAND_UID.RELATIVE_PATH,
	() => {
		const activeTextEditor = vscode.window.activeTextEditor;

		if (!activeTextEditor) {
			logger.error('No active text editor found.');
			return;
		}

		const rootFolder = getConfigParam<string>('rootFolder')!;
		const projectPathPrefix = getConfigParam<string>('projectPrefix')!;

		// If the prefix is undefined, `cleanFileName` defaults to `@aldogroup`
		const currentFileName = cleanFileName(
			activeTextEditor.document.fileName,
			rootFolder,
			projectPathPrefix
		);
		vscode.env.clipboard.writeText(currentFileName);

		logger.log('Copied fileName to clipboard', currentFileName);
	}
);

export default shoeboxRelativePath;
