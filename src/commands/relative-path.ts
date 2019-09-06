import * as vscode from "vscode";

import * as logger from "../utils/logger";
import cleanFileName from "../utils/clean-file-name";

const shoeboxRelativePath = vscode.commands.registerCommand(
	"extension.shoeboxRelativePath",
	() => {
		const activeTextEditor = vscode.window.activeTextEditor;

		if (!activeTextEditor) {
			logger.error("No active text editor found.");
			return;
		}

		const currentFileName = cleanFileName(activeTextEditor.document.fileName);
		vscode.env.clipboard.writeText(currentFileName);

		logger.log("Copied fileName to clipboard", currentFileName);
	}
);

export default shoeboxRelativePath;
