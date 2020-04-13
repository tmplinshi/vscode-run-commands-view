export const delay = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const isObject = (item: any): item is AnyObj => typeof item === 'object' && item !== null;

interface AnyObj {
	[key: string]: any;
}
