import vscode, { Command, Event, EventEmitter, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode';

import { EXTENSION_NAME } from './extension';
import { IConfig } from './types';
import { isObject } from './utils';

export class RunCommand extends TreeItem {
	collapsibleState: TreeItemCollapsibleState;
	contextValue = 'command';

	constructor(
		readonly label: string,
		readonly command: Command | undefined,
		readonly collapseFoldersByDefault: boolean,
		readonly items?: object
	) {
		super(label);

		if (this.items) {
			this.collapsibleState = collapseFoldersByDefault ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.Expanded;
			this.command = undefined;
			this.iconPath = vscode.ThemeIcon.Folder;
		} else {
			this.collapsibleState = TreeItemCollapsibleState.None;
		}
	}
}

export class RunCommandsProvider implements TreeDataProvider<RunCommand> {
	private readonly _onDidChangeTreeData: EventEmitter<RunCommand | undefined> = new EventEmitter<RunCommand | undefined>();
	readonly onDidChangeTreeData: Event<RunCommand | undefined> = this._onDidChangeTreeData.event;

	constructor(
		private config: IConfig
	) { }

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	updateConfig(newConfig: IConfig): void {
		this.config = newConfig;
	}

	getTreeItem(element: RunCommand): TreeItem {
		return element;
	}

	getChildren(element?: RunCommand): RunCommand[] {
		if (element && element.items) {
			return this.parseCommands(element.items);
		} else {
			const allCommands = this.config.commands;
			return this.parseCommands(allCommands);
		}
	}

	private parseCommands(commands: object): RunCommand[] {
		const result = [];
		for (const key in commands) {
			const command = commands[key];
			if (typeof command !== 'string' && !isObject(command) && !Array.isArray(command)) {
				continue;
			}
			const sequence: any[] = [];
			let items: object | undefined;
			// @ts-ignore
			if (command && command.excludeFromView) {
				continue;
			}

			if (typeof command === 'string') {
				sequence.push({
					command,
				});
			} else if (Array.isArray(command)) {
				command.forEach(com => {
					if (typeof com === 'string') {
						sequence.push({
							command: com,
						});
					} else {
						sequence.push(com);
					}
				});
				sequence.push(command);
			} else if (typeof command === 'object' && command !== null) { // tslint:disable-line
				if (command.items) {
					items = command.items;// tslint:disable-line
				} else if (command.sequence) {
					command.sequence.forEach((com: any) => { // tslint:disable-line
						if (typeof com === 'string') {
							sequence.push({
								command: com,
							});
						} else {
							sequence.push(com);
						}
					});
				} else {
					sequence.push(command);
				}
			}

			result.push(new RunCommand(
				key,
				{
					command: `${EXTENSION_NAME}.runCommand`,
					title: 'Run Command',
					arguments: [sequence],
				},
				this.config.collapseFoldersByDefault,
				items
			));
		}
		return result;
	}
}
