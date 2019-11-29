import { relative } from 'path';

import constants from './constants';
import { getLastArrayIndexAndItem } from './arrray';
import { pathArrayToRelative } from './path';

interface IAliasMap {
	[key: string]: string;
}

const generateProjectAliasMap = (projectPrefix: string): IAliasMap => ({
	packages: projectPrefix
});

const removeBlacklistedExtensions = (str: string) => {
	// Split file parts in tokens, last token is the extension
	const fileParts = str.split('.');
	const [lastToken]: string[] = getLastArrayIndexAndItem(fileParts);

	if (constants.FILE_EXT_BLACKLIST.includes(`.${lastToken}`)) {
		fileParts.pop();
	}

	return fileParts.join('.');
};

const getFileName = (filePath: string, projectPrefix?: string) => {
	const aliasMap = generateProjectAliasMap(
		projectPrefix || constants.PROJECT_PATH_PREFIX
	);

	const relativePathTokens = relative(process.cwd(), filePath).split('/');
	const [lastPathToken, lastIndex] = getLastArrayIndexAndItem(
		relativePathTokens
	);

	const blackListedIndexes = constants.FILE_EXT_BLACKLIST.map(
		ext => `index${ext}`
	);

	// Trim the blacklisted `index` parts
	if (blackListedIndexes.includes(lastPathToken)) {
		relativePathTokens.pop();
	} else {
		// Remove blacklisted extensions
		relativePathTokens[lastIndex] = removeBlacklistedExtensions(lastPathToken);
	}

	const relativeTokensWithoutUselessStuff = pathArrayToRelative(
		relativePathTokens
	);

	// Apply aliases
	const finalPathTokens = relativeTokensWithoutUselessStuff.map(
		token => aliasMap[token] || token
	);

	return finalPathTokens.join('/');
};

export default getFileName;
