import * as vscode from 'vscode';

import * as logger from '../utils/logger';
import { COMMAND_UID } from './commands';
import cleanFileName from '../utils/clean-file-name';

const shoeboxRelativePath = vscode.commands.registerCommand(
	COMMAND_UID.RELATIVE_PATH,
	() => {
		const activeTextEditor = vscode.window.activeTextEditor;

		if (!activeTextEditor) {
			logger.error('No active text editor found.');
			return;
		}

		// Pick the PathPrefix from the workspace settings
		const config = vscode.workspace.getConfiguration(
			'shoebox',
			activeTextEditor.document.uri
		);

		const projectPathPrefix = config.get('projectPrefix') as string;

		// If the prefix is undefined, `cleanFileName` defaults to `@aldogroup`
		const currentFileName = cleanFileName(
			activeTextEditor.document.fileName,
			projectPathPrefix
		);
		vscode.env.clipboard.writeText(currentFileName);

		logger.log('Copied fileName to clipboard', currentFileName);
	}
);

export default shoeboxRelativePath;
