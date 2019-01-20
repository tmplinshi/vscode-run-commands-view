import { Command, Event, EventEmitter, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode';
import * as vscode from 'vscode';
import { EXTENSION_NAME } from './extension';
import { IConfig } from './types';

export class RunCommandsProvider implements TreeDataProvider<RunCommand> {

	private _onDidChangeTreeData: EventEmitter<RunCommand | undefined> = new EventEmitter<RunCommand | undefined>();
	readonly onDidChangeTreeData: Event<RunCommand | undefined> = this._onDidChangeTreeData.event;

	constructor(
		private config: IConfig,
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

	getChildren(element?: RunCommand) {
		if (element && element.items) {
			return this.parseCommands(element.items);
		} else {
			const allCommands = this.config.commands;
			return this.parseCommands(allCommands);
		}
	}

	private parseCommands(commands: any) {
		const result = [];
		for (const key in commands) {
			const command = commands[key];
			let sequence: any[] = [];
			let items;
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
			} else if (typeof command === 'object' && command !== null) {
				if (command.items) {
					items = command.items;
				} else if (command.sequence) {
					command.sequence.forEach((com: any) => {
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
				items,
			));
		}
		return result;
	}
}
export class RunCommand extends TreeItem {
	readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None;

	constructor(
		readonly label: string,
		readonly command: Command | undefined,
		readonly items?: any,

	) {
		super(label);

		if (this.items) {
			this.collapsibleState = TreeItemCollapsibleState.Expanded;
			this.command = undefined;
			this.iconPath = vscode.ThemeIcon.Folder;
		}
	}

	contextValue = 'command';
}
