export interface IConfig {
	commands: {
		[key: string]: string | string[] | IRegister & IFolder;
	};
	collapseFoldersByDefault: boolean;
}

export interface IRegister {
	registerId: 'string';
	sequence: any[];
	excludeFromView: boolean;
}
export interface IFolder {
	isFolder: boolean;
	items: IConfig['commands'];
}

export interface IToggleSetting {
	setting: 'string';
	value: string | any[];
}
