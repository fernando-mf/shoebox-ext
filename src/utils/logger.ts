const SHOEBOX_PREFIX = '[SHOEBOX]';

type ILogger = (msg: string, ...optionalParams: string[]) => void;

const warn: ILogger = (msg, ...optionalParams) => {
	console.warn(SHOEBOX_PREFIX, msg, ...optionalParams);
};

const log: ILogger = (msg, ...optionalParams) => {
	console.log(SHOEBOX_PREFIX, msg, ...optionalParams);
};

const error: ILogger = (msg, ...optionalParams) => {
	console.error(SHOEBOX_PREFIX, msg, ...optionalParams);
};

export { log, error, warn };
