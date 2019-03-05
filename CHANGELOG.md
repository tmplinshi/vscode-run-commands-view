## 0.3.8 `05 Mar 2019`

- ✨ More additional commands: increment/decrement a setting `run-commands-view.incrementSetting` / `run-commands-view.decrementSetting` (works only for numbers)
- ✨ Autocomplete/validation for nested `commands` `items` (2nd level) in `settings.json`
- 🐛 Register nested commands should work

## 0.3.7 `24 Feb 2019`

- ✨ Initial work on autocomplete/validation (only the first level of `commands` in `settings.json`).
- 🔨 Smaller sized `.gif`

## 0.3.6 `22 Feb 2019`

- ✨ Context Menu entry to quickly reveal item in `settings.json`

## 0.3.5 `19 Feb 2019`

- 🔨 Minor npe guard fixes

## 0.3.4 `07 Feb 2019`

- ✨ Add button `collapse All`
- ✨ Add setting `collapseFoldersByDefault`

## 0.3.3 `28 Jan 2019`

- 📚 Add demo `.gif`

## 0.3.2 `27 Jan 2019`

- 🐛 Fix excluding `.vs` folder

## 0.3.1 `27 Jan 2019`

- ✨ Hot-reloading of registered commands
- ✨ Register command without showing it in the view

## 0.3.0 `21 Jan 2019`

- ✨ Add ability to create nested commands

## 0.2.0 `19 Jan 2019`

- ✨ Add command to toggle simple global settings (string, boolean, number)

## 0.1.0 `17 Jan 2019`

- ✨ Add `registerId` to be able to invoke multiple commands with one keybinding

## 0.0.3 `16 Jan 2019`

- 🔨 Add icon
- 📝 Add more info in README

## 0.0.2 `16 Jan 2019`

- ✨ Add ability to bookmark folders/files by hand:
```javascript
"📁 Open Folder": {
	"command": "vscode.openFolder",
	"args": "C:\\Users"
},
"📝 Open File": {
	"command": "vscode.openFolder",
	"args": "C:\\inbox.md"
}
```

## 0.0.1 `15 Jan 2019`

- Initial release
