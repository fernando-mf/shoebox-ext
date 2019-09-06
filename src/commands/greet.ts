import * as vscode from 'vscode';

import * as logger from '../utils/logger';

const shoeboxGreet = vscode.commands.registerCommand('extension.shoeboxGreet', () => {
	const greet = 'Hello @aldodev';
	vscode.window.showInformationMessage(greet);
	logger.log(greet)
});

export default shoeboxGreet;
