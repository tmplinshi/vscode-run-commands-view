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
		if (element) {

		} else {
			const allCommands = this.config.commands;

			const result = [];
			for (const key in allCommands) {
				const command = allCommands[key];
				let sequence: any[] = [];
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
					sequence.push(command);
				}

				result.push(new RunCommand(
					key,
					{
						command: `${EXTENSION_NAME}.runCommand`,
						title: 'Run Command',
						arguments: [sequence],
					},
				));
			}
			return result;
		}
	}
}
export class RunCommand extends TreeItem {
	readonly collapsibleState = TreeItemCollapsibleState.None;

	constructor(
		readonly label: string,
		readonly command: Command,
		readonly description?: string,
	) {
		super(label);
	}

	contextValue = 'command';
}
