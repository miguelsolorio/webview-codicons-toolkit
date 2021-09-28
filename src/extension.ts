import * as vscode from 'vscode';
import { HelloWorldPanel } from './panels/HelloWorldPanel';

export function activate(context: vscode.ExtensionContext) {
	// Create the helloworld command
	const helloCommand = vscode.commands.registerCommand("helloworld.helloWorld", () => {
		HelloWorldPanel.render(context.extensionUri);
	});

	// Add command to the extension context
	context.subscriptions.push(helloCommand);
}

export function deactivate() {}
