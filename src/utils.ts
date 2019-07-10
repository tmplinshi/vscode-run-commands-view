export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));// tslint:disable-line

export const isObject = (item: any): item is anyObj => typeof item === 'object' && item !== null;

type anyObj = {
	[key: string]: any;
};
