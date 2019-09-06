import { relative } from 'path';

import constants from './constants';

interface IAliasMap {
	[key: string]: string;
}

const aliasMap: IAliasMap = {
	'packages': constants.PROJECT_PATH_PREFIX,
};

const getFileName = (filePath: string) => {
	const relativePathTokens = relative(process.cwd(), filePath).split('/');
	const lastIndex = relativePathTokens.length - 1;
	const lastPathToken = relativePathTokens[lastIndex];

	// We only trim the path for JS files, we need the index for scss files
	if (lastPathToken === 'index.js') {
		relativePathTokens.pop();
	} else {
		// Remove extension
		relativePathTokens[lastIndex] = lastPathToken.replace('.js', '');
	}

	// Apply aliases
	const finalPathTokens = relativePathTokens.map(token => aliasMap[token] || token);
	return finalPathTokens.join('/');
}

export default getFileName;
