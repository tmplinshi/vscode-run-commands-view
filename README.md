# Run Commands View

## The easiest example (string):

```javascript
"💤 Toggle Status Bar": "workbench.action.toggleStatusbarVisibility",
```

## Specifying arguments (object):

```javascript
"🔶 Insert text": {
	"command": "editor.action.insertSnippet",
	"args": { "snippet": "text" }
},
```

## Running multiple commands in sequence (array of strings)

```javascript
"📒 Toggle Minimap & Status Bar": [
	"editor.action.toggleMinimap",
	"workbench.action.toggleStatusbarVisibility"
],
```

## Specifying the delay
```javascript
"🛩 Delay": [
	"workbench.action.toggleSidebarVisibility",
	{
		"command": "workbench.action.toggleSidebarVisibility",
		"delayBefore": 1000,
	}
]
```
