# Run Commands View

![demo](https://raw.githubusercontent.com/usernamehw/vscode-run-commands-view/master/img/demo.gif)

It's also possible to run commands from Quick Open with `run-commands-view.openAsQuickPick` command:

![demo quick pick](https://raw.githubusercontent.com/usernamehw/vscode-run-commands-view/master/img/quick_pick_demo.png)

```js
"run-commands-view.commands": {
	// Place commands here
},
```

## The simplest example (string):

```js
"💤 Toggle Status Bar": "workbench.action.toggleStatusbarVisibility",
```

## Use vscode product icons [Icons List](https://code.visualstudio.com/api/references/icons-in-labels)

```js
"$(zap|zapcolor) Zap": "workbench.action.toggleStatusbarVisibility",
"$(flame|errorForeground) Flame": "workbench.action.toggleStatusbarVisibility",
```

Optionally, define colors (in `settings.json`)
```js
"workbench.colorCustomizations": {
	"zapcolor": "#fff000",
},
```

![icons demo](https://raw.githubusercontent.com/usernamehw/vscode-run-commands-view/master/img/icon_demo.png)

## Specifying arguments (object):

```js
"🔶 Insert text": {
	"command": "editor.action.insertSnippet",
	"args": { "snippet": "text" }
},
```

## Running multiple commands in sequence (array of strings)

```js
"📒 Toggle Minimap & Status Bar": [
	"editor.action.toggleMinimap",
	"workbench.action.toggleStatusbarVisibility"
],
```

## Specifying the delay

```js
"⏳ Delay": [
	"workbench.action.toggleSidebarVisibility",
	{
		"command": "workbench.action.toggleSidebarVisibility",
		"delayBefore": 1000,// <=====
	}
],
```

## Using folders/hierarchy (nested commands)

```js
"Toggle Settings ====================": {
	"items": {
		"🔋 Toggle Status Bar": "workbench.action.toggleStatusbarVisibility",
		"🗺 Toggle minimap": "editor.action.toggleMinimap"
	}
},
```

## Register command to invoke it with a keybinding

```js
"📜 Toggle sidebar and minimap": {
	"registerId": "toggleSidebarMinimap",// <=====
	"sequence": [
		"workbench.action.toggleSidebarVisibility",
		"editor.action.toggleMinimap"
	]
},
```

## Register command without showing it in the View

```js
"📜 Toggle sidebar and minimap": {
	"registerId": "toggleSidebarMinimap",
	"excludeFromView": true,// <=====
	"sequence": [
		"workbench.action.toggleSidebarVisibility",
		"editor.action.toggleMinimap"
	]
},
```

# Additional commands

## Open Folder

```js
"📁 Open Folder": {
	"command": "openFolder",
	"args": "C:\\Users"
},
```

## Open File

```js
"📝 Open File": {
	"command": "openFolder",
	"args": "C:\\inbox.md"
},
```

## Use Terminal

```js
"1️⃣ run in teminal": {
	"command": "workbench.action.terminal.sendSequence",
	"args": {
		"text": "npm run test\r"
	}
},
"2️⃣ create new teminal": {
	"sequence": [
		{
			"command": "workbench.action.terminal.new"
		},
		{
			"command": "workbench.action.terminal.sendSequence",
			"args": {
				"text": "npm run test\r"
			}
		}
	]
},
```

## Toggle Settings

```js
"🔢 Toggle Line Numbers": {
	"command": "run-commands-view.toggleSetting",
	"args": {
		"setting": "editor.lineNumbers",
		"value": "on,off"
	}
},
```

## Increment/decrement Settings

```js
"fontSize ➕": {
	"command": "run-commands-view.incrementSetting",
	"args": {
		"setting": "editor.fontSize",
		"value": 0.5
	}
},
"fontSize ➖": {
	"command": "run-commands-view.decrementSetting",
	"args": {
		"setting": "editor.fontSize",
		"value": 0.5
	}
},
```

## Add property to Settings object (nesting supported)

```js
"✨ add item to object": {
	"command": "setting.merge",
	"args": {
		"setting": "[markdown]",
		"value": {
			"editor.lineHeight": 40
		}
	}
},
```
Results in:
```diff
"[markdown]": {
	"editor.wordWrap": "on",
	"editor.quickSuggestions": false,
+	"editor.lineHeight": 40
},
```

## How to build

Before running this extension in debugger you must first execute
```
yarn watch
```
or
```
npm run watch
```
