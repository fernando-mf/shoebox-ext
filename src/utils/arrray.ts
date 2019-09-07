export const getLastArrayIndexAndItem = (arr: any[]) => {
	const lastIndex = arr.length - 1;
	return [arr[lastIndex], lastIndex];
};
