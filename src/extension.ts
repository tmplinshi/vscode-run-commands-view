import merge from 'lodash/merge';
import vscode, { commands, ConfigurationChangeEvent, ExtensionContext, Uri, window, workspace } from 'vscode';

import { RunCommand, RunCommandsProvider } from './provider';
import { IConfig, IToggleSetting } from './types';
import { delay, isObject } from './utils';

export const EXTENSION_NAME = 'run-commands-view';

export function activate(extensionContext: ExtensionContext): void {
	const config = JSON.parse(JSON.stringify(workspace.getConfiguration(EXTENSION_NAME))) as IConfig;
	const registeredCommandsList: vscode.Disposable[] = [];

	registerCommands(config.commands);

	// ──────────────────────────────────────────────────────────────────────
	// ──── Register vscode Commands ────────────────────────────────────────
	// ──────────────────────────────────────────────────────────────────────
	const settingMerge = commands.registerCommand('setting.merge', (arg: any) => {
		if (!isObject(arg)) {
			window.showWarningMessage('Argument must be an object');
			return;
		}
		const settings = workspace.getConfiguration(undefined, null);// tslint:disable-line
		const settingName = arg.setting;
		if (typeof settingName !== 'string') {
			window.showWarningMessage('Must provide `setting`');
			return;
		}
		const objectToMerge = arg.value;
		if (!isObject(objectToMerge)) {
			window.showWarningMessage('`value` must be an Object');
			return;
		}
		const oldValue = settings.get(settingName);
		const newValue = merge(oldValue, objectToMerge);
		settings.update(settingName, newValue, true);
	});
	const toggleGlobalSetting = commands.registerCommand(`${EXTENSION_NAME}.toggleSetting`, (arg: IToggleSetting | string) => {
		const settings = workspace.getConfiguration(undefined, null);// tslint:disable-line

		if (typeof arg === 'string') {
			// Passed only string, assume that's a boolean settings' name and try to toggle it
			const currentSettingValue = settings.get<any>(arg);
			if (typeof currentSettingValue !== 'boolean') {
				window.showWarningMessage('Passing a string only works with type Boolean');
				return;
			}
			settings.update(arg, !currentSettingValue, true);
		} else if (isObject(arg)) {
			const settingName = arg.setting;
			const currentSettingValue = settings.get(settingName);
			const settingValues = arg.value;

			if (Array.isArray(settingValues)) {
				const next = getNextOrFirstElement(settingValues, currentSettingValue);
				settings.update(settingName, next, true);
			} else if (typeof settingValues === 'string') { // tslint:disable-line
				// Handle comma separated string here (assume it's an array of strings)
				if (settingValues.indexOf(',')) {
					const allValues = settingValues.split(',');
					if (allValues.length === 1) {
						settings.update(settingName, allValues[0], true);
					} else {
						const next = getNextOrFirstElement(allValues, currentSettingValue);
						settings.update(settingName, next, true);
					}
				}
			}
		}
	});
	const incrementGlobalSetting = commands.registerCommand(`${EXTENSION_NAME}.incrementSetting`, (arg: string | IToggleSetting) => {
		let setting;
		let value;
		if (typeof arg === 'string') {
			setting = arg;
		} else if (isObject(arg)) {
			setting = arg.setting;
			value = arg.value;
		}
		if (typeof value === 'undefined') {
			value = 1;
		}
		incrementSetting(setting, value);
	});
	const decrementGlobalSetting = commands.registerCommand(`${EXTENSION_NAME}.decrementSetting`, (arg: string | IToggleSetting) => {
		let setting;
		let value;
		if (typeof arg === 'string') {
			setting = arg;
		} else if (isObject(arg)) {
			setting = arg.setting;
			value = arg.value;
		}
		if (typeof value === 'undefined') {
			value = 1;
		}
		incrementSetting(setting, -value);
	});
	const runCommand = commands.registerCommand(`${EXTENSION_NAME}.runCommand`, async (commandsToRun: any[]) => {
		for (const command of commandsToRun) {
			if (typeof command === 'string') {
				await commands.executeCommand(command);
			} else {
				if (isObject(command)) {
					if (typeof command.delayBefore === 'number') {
						await delay(command.delayBefore);
					}
					let args = command.args;

					if (command.command === 'vscode.openFolder') {
						args = Uri.file(command.args);// tslint:disable-line
					}

					await commands.executeCommand(command.command, args);// tslint:disable-line
				}
			}
		}
	});
	const openFolder = commands.registerCommand('openFolder', async (path: string) => {
		await commands.executeCommand('vscode.openFolder', Uri.file(path));
	});
	const revealCommand = vscode.commands.registerCommand(`${EXTENSION_NAME}.revealCommand`, async (com: RunCommand) => {
		const symbolName = com.label;
		const activeTextEditor = vscode.window.activeTextEditor;
		if (activeTextEditor && activeTextEditor.document.fileName.endsWith('settings.json') && activeTextEditor.document.languageId === 'jsonc') {
			revealInSettings(symbolName);
			return;
		}
		await revealInSettings(symbolName, true);
	});
	// ──────────────────────────────────────────────────────────────────────
	function registerCommands(configCommands: IConfig['commands']): void {
		for (const key in configCommands) {
			const command = configCommands[key];
			if (typeof command === 'string' || Array.isArray(command)) {
				continue;
			}
			if (command && command.registerId) {
				registeredCommandsList.push(vscode.commands.registerCommand(command.registerId, () => {
					const sequence = [];
					for (const item of command.sequence) {
						if (typeof item === 'string') {
							sequence.push({
								command: item,
							});
						} else {
							sequence.push(item);
						}
					}
					vscode.commands.executeCommand(`${EXTENSION_NAME}.runCommand`, sequence);
				}));
			}
			if (command && command.items) {
				registerCommands(command.items);
			}
		}
	}
	function unregisterCommands(): void {
		registeredCommandsList.forEach(command => {
			command.dispose();
		});
		registeredCommandsList.length = 0;
	}

	function incrementSetting(settingName: any, n: any): void {
		if (typeof settingName !== 'string') {
			window.showWarningMessage('Setting name must be a string');
			return;
		}
		if (typeof n !== 'number' || isNaN(n)) {
			window.showWarningMessage('Only numbers allowed');
			return;
		}
		const settings = workspace.getConfiguration(undefined, null);// tslint:disable-line
		const currentSettingValue = settings.get<any>(settingName);
		if (typeof currentSettingValue !== 'number') {
			window.showWarningMessage('Only works for settings of type `number`');
			return;
		}
		settings.update(settingName, currentSettingValue + n, true);
	}

	function getNextOrFirstElement<T>(arr: T[], target: any): T {
		const idx = arr.findIndex(el => el === target);
		return idx === arr.length - 1 ? arr[0] : arr[idx + 1];
	}

	const runCommandsProvider = new RunCommandsProvider(config);
	const runCommandsView = vscode.window.createTreeView(`${EXTENSION_NAME}.tree`, {
		treeDataProvider: runCommandsProvider,
		showCollapseAll: true,
	});

	async function revealInSettings(symbolName: string, shouldOpenSettings = false): Promise<void> {
		const delayBeforeQuickOpen = shouldOpenSettings ? 1300 : 0;
		if (shouldOpenSettings) {
			await vscode.commands.executeCommand('workbench.action.openSettingsJson');
		}
		setTimeout(async () => {
			await vscode.commands.executeCommand('workbench.action.quickOpen', `@${symbolName}`);
		}, delayBeforeQuickOpen);
	}

	function updateConfig(e: ConfigurationChangeEvent): void {
		if (!e.affectsConfiguration(EXTENSION_NAME)) return;

		const newConfig = JSON.parse(JSON.stringify(workspace.getConfiguration(EXTENSION_NAME))) as IConfig;
		if (e.affectsConfiguration(`${EXTENSION_NAME}.commands`)) {
			config.commands = newConfig.commands;
			runCommandsProvider.refresh();
			unregisterCommands();
			registerCommands(config.commands);
		}
	}
	// ──────────────────────────────────────────────────────────────────────
	// ──── Subscriptions ───────────────────────────────────────────────────
	// ──────────────────────────────────────────────────────────────────────
	extensionContext.subscriptions.push(runCommandsView, runCommand, openFolder, toggleGlobalSetting, revealCommand, incrementGlobalSetting, decrementGlobalSetting, settingMerge);
	extensionContext.subscriptions.push(workspace.onDidChangeConfiguration(updateConfig, EXTENSION_NAME));
}

export function deactivate(): void { }
