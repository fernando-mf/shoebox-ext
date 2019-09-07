import * as vscode from 'vscode';
import { userInfo } from 'os';

import * as logger from '../utils/logger';
import { COMMAND_UID } from './commands';

const shoeboxGreet = vscode.commands.registerCommand(COMMAND_UID.GREET, () => {
	const userName = userInfo().username;
	const greet = `Hello @${userName}`;
	vscode.window.showInformationMessage(greet);
	logger.log(greet);
});

export default shoeboxGreet;
