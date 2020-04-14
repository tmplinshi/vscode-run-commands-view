export interface IConfig {
	/**
	 * A bit complicated...
	 */
	commands: {
		[title: string]: string | ICommandArray | IRegister & IFolder & ICommandObject;
	};
	collapseFoldersByDefault: boolean;
}
/**
 * And array of either strings or ICommandsObject or a mix of them
 */
export type ICommandArray = (string | ICommandObject)[];
/**
 * Just an object. Very similar to keybindings.json object type.
 */
export interface ICommandObject {
	command: string;
	delayBefore: number;
	args: any;
}
/**
 * And object to register a sequence of commands under 1 id
 */
export interface IRegister {
	registerId: 'string';
	sequence: ICommandArray;
	excludeFromView: boolean;
}
/**
 * Nested/folders/hierarchy
 */
export interface IFolder {
	items: IConfig['commands'];
}
// ──────────────────────────────────────────────────────────────────────
export interface IToggleSetting {
	setting: 'string';
	value: string | any[];
}
