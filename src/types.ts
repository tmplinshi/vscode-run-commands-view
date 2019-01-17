
export interface IConfig {
	commands: {
		[key: string]: string | string[] | IRegister;
	};
}

export interface IRegister {
	registerId: 'string';
	sequence: any[];
}

export interface IToggleSetting {
	setting: 'string';
	value: string | any[];
}
