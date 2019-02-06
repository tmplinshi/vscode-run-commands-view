export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const isObject = (item: any) => typeof item === 'object' && item !== null;
