const ROOT = 'packages';

import * as vscode from 'vscode';

export function pathArrayToRelative(
	pathTokens: string[],
	folderRoot: string = ROOT
) {
	const rootIndex = pathTokens.indexOf(folderRoot);

	if (rootIndex < 0) {
		const path = pathTokens.join('/');
		vscode.window.showErrorMessage(
			`Can't build path for ${path}. Root: ${folderRoot}`
		);
		return [];
	}

	return pathTokens.slice(rootIndex);
}

export function absolutePathToRelative(
	filePath: string,
	folderRoot: string = ROOT
) {
	const pathTokens = filePath.split('/');
	const relativeTokens = pathArrayToRelative(pathTokens, folderRoot);
	return relativeTokens.join('/');
}

export function absolutePathToRelativeMatch(
	filePath: string,
	matchRoot: string = ROOT
) {
	let root = matchRoot;
	if (matchRoot.includes('/')) {
		root = matchRoot.substr(0, matchRoot.indexOf('/'));
	}

	const pathTokens = filePath.split('/');
	const relativeTokens = pathArrayToRelative(pathTokens, root);
	return relativeTokens.join('/');
}
