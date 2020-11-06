import vscode, { Command, Event, EventEmitter, ThemeColor, ThemeIcon, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { EXTENSION_NAME } from './extension';
import { IConfig, Items } from './types';
import { isObject } from './utils';

export class RunCommand extends TreeItem {
	static iconMatchRegexp = /\$\(([\w-]+)(\|(\w+))?\)/;
	collapsibleState = TreeItemCollapsibleState.None;
	contextValue = 'command';

	constructor(
		label: string,
		readonly command: Command | undefined,
		readonly collapseFoldersByDefault: boolean,
		readonly items?: Items,
	) {
		super(label);

		if (items) {
			this.collapsibleState = collapseFoldersByDefault ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.Expanded;
			this.command = undefined;
			this.iconPath = vscode.ThemeIcon.Folder;
		}
		const hasIconMatch = RunCommand.iconMatchRegexp.exec(label);
		if (hasIconMatch) {
			const entireMatch = hasIconMatch[0];
			const iconName = hasIconMatch[1];
			const iconColor = hasIconMatch[3];
			this.iconPath = new ThemeIcon(iconName, iconColor ? new ThemeColor(iconColor) : undefined);
			this.label = label.replace(entireMatch, '');
		}
	}
}

export class RunCommandsProvider implements TreeDataProvider<RunCommand> {
	private readonly _onDidChangeTreeData: EventEmitter<RunCommand | undefined> = new EventEmitter<RunCommand | undefined>();
	readonly onDidChangeTreeData: Event<RunCommand | undefined> = this._onDidChangeTreeData.event;

	constructor(
		private config: IConfig,
	) { }

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	updateConfig(newConfig: IConfig): void {
		this.config = newConfig;
	}

	getTreeItem(element: RunCommand): TreeItem {
		return element;
	}

	getChildren(element?: RunCommand): RunCommand[] {
		if (element && element.items) {
			return this.commandsToTreeItems(element.items);
		} else {
			const allCommands = this.config.commands;
			return this.commandsToTreeItems(allCommands);
		}
	}

	private commandsToTreeItems(commands: Items): RunCommand[] {
		const result = [];
		for (const key in commands) {
			const command = commands[key];
			// Skip unsupported items (Maybe log an error?)
			if (typeof command !== 'string' && !isObject(command) && !Array.isArray(command)) {
				continue;
			}
			// @ts-ignore
			if (command && command.excludeFromView) {
				continue;
			}

			result.push(new RunCommand(
				key,
				{
					command: `${EXTENSION_NAME}.runCommand`,
					title: 'Run Command',
					arguments: [command],
				},
				this.config.collapseFoldersByDefault,
				// @ts-ignore
				command.items,
			));
		}
		return result;
	}
}
