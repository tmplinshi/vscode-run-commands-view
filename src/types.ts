
export interface IConfig {
	commands: {
		[key: string]: string | string[] | IRegister & IFolder;
	};
}

export interface IRegister {
	registerId: 'string';
	sequence: any[];
}
export interface IFolder {
	isFolder: boolean;
	items: IConfig['commands'];
}

export interface IToggleSetting {
	setting: 'string';
	value: string | any[];
}
