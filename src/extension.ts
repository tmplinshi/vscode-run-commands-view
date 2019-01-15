'use strict';
import { commands, ConfigurationChangeEvent, ExtensionContext, Uri, window, workspace } from 'vscode';
import * as vscode from 'vscode';

import { RunCommandsProvider } from './provider';
import { IConfig, IToggleSetting } from './types';
import { delay } from './utils';

export const EXTENSION_NAME = 'run-commands-view';

export function activate(extensionContext: ExtensionContext) {
	const config = { ...workspace.getConfiguration(EXTENSION_NAME) } as any as IConfig;

	// const openFileFromPath = commands.registerCommand(`${EXTENSION_NAME}.open`, async path => {
	// 	vscode.commands.executeCommand('vscode.open', Uri.file(path));
	// });
	// const toggleGlobalSetting = commands.registerCommand(`${EXTENSION_NAME}.toggleGlobalSetting`, (arg: IToggleSetting | string) => {
	// 	const settings = workspace.getConfiguration(undefined, null);// tslint:disable-line

	// 	if (typeof arg === 'string') {
	// 		// Passed only string, assume that's a boolean settings' name and try to toggle it
	// 		const currentSettingValue = settings.get(arg);
	// 		if (typeof currentSettingValue !== 'boolean') {
	// 			window.showWarningMessage('Passing a string only works with type Boolean');
	// 			return;
	// 		}
	// 		settings.update(arg, !currentSettingValue, true);
	// 	} else if (typeof arg === 'object') {
	// 		const settingName = arg.setting;
	// 		const currentSettingValue = settings.get(settingName);
	// 		const settingValues = arg.value;

	// 		if (Array.isArray(settingValues)) {
	// 			const next = getNextOrFirstElement(settingValues, currentSettingValue);
	// 			settings.update(settingName, next, true);
	// 		} else if (typeof settingValues === 'string') {
	// 			// Handle comma here
	// 			if (settingValues.indexOf(',')) {
	// 				const allValues = settingValues.split(',');
	// 				if (allValues.length === 1) {
	// 					settings.update(settingName, allValues[0], true);
	// 				} else {
	// 					const next = getNextOrFirstElement(allValues, currentSettingValue);
	// 					settings.update(settingName, next, true);
	// 				}
	// 			}
	// 		}
	// 	}
	// });

	function getNextOrFirstElement(array: any[], target: any) {
		const index = array.findIndex(el => el === target);

		if (index === array.length - 1) {
			return array[0];
		} else {
			return array[index + 1];
		}
	}

	const runCommand = commands.registerCommand(`${EXTENSION_NAME}.runCommand`, async commandsToRun => {
		for (const command of commandsToRun) {
			// console.log(JSON.stringify(command, undefined, '	'));
			if (typeof command === 'string') {
				await commands.executeCommand(command);
			} else {
				if (typeof command.delayBefore === 'number') {
					await delay(command.delayBefore);
				}
				await commands.executeCommand(command.command, command.args);
			}
		}
	});

	const runCommandsProvider = new RunCommandsProvider(config);
	const runCommandsTree = window.registerTreeDataProvider(`${EXTENSION_NAME}.tree`, runCommandsProvider);

	function updateConfig(e: ConfigurationChangeEvent) {
		if (!e.affectsConfiguration(EXTENSION_NAME)) return;

		const newConfig = { ...workspace.getConfiguration(EXTENSION_NAME) } as any as IConfig;
		if (e.affectsConfiguration(`${EXTENSION_NAME}.commands`)) {
			config.commands = newConfig.commands;
			runCommandsProvider.refresh();
		}
	}

	extensionContext.subscriptions.push(runCommandsTree, runCommand);
	// extensionContext.subscriptions.push(openFileFromPath, toggleGlobalSetting);
	extensionContext.subscriptions.push(workspace.onDidChangeConfiguration(updateConfig, EXTENSION_NAME));
}

export function deactivate() { }
