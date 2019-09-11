const VERSION = '0.2.0';

import * as vscode from 'vscode';

import shoeboxRelativePath from './commands/relative-path';
import shoeboxGreet from './commands/greet';

import * as logger from './utils/logger';

export function activate(context: vscode.ExtensionContext) {
	// This line of code will only be executed once when the extension is activated
	logger.log('Extension is active!');
	logger.log(`Running version: ${VERSION}`);

	// Commands have to be defined in the package.json file
	// To create a new command, duplicate `greet.ts` (use it as an starting point) in the commands folder,
	// rename it and build the extension.
	// The commandId must match the command field in package.json

	// Subscribe commands
	context.subscriptions.push(shoeboxRelativePath, shoeboxGreet);
}

// this method is called when your extension is deactivated
export function deactivate() {}
