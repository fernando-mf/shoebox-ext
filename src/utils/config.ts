import * as vscode from 'vscode';

import * as logger from '../utils/logger';

export function getWorkspaceConfig(): vscode.WorkspaceConfiguration | null {
	const activeTextEditor = vscode.window.activeTextEditor;

	if (!activeTextEditor) {
		logger.error('No active text editor found.');
		return null;
	}

	// Pick the PathPrefix from the workspace settings
	const config = vscode.workspace.getConfiguration(
		'shoebox',
		activeTextEditor.document.uri
	);

	return config;
}

export function getConfigParam<T = any>(configParam: string): T | null {
	const config = getWorkspaceConfig();

	if (!config) {
		return null;
	}

	return config.get(configParam) as T;
}
