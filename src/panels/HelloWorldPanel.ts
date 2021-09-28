import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";

export class HelloWorldPanel {
    public static currentPanel: HelloWorldPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(this.dispose, null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: vscode.Uri) {
        if (HelloWorldPanel.currentPanel) {
            // If the webview panel already exists reveal it
            HelloWorldPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = vscode.window.createWebviewPanel(
                "helloworld",
                "Hello World",
                vscode.ViewColumn.One,
                {
                    // Enable JavaScript in the webview
                    enableScripts: true,
                }
            );

            HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
        }
    }


    /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
    public dispose() {
        HelloWorldPanel.currentPanel = undefined;

        // Dispose of the current webview panel
        this._panel.dispose();

        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;
                const text = message.text;

                switch (command) {
                    case "hello":
                        // Code that should run in response to the hello message command
                        vscode.window.showErrorMessage(text);
                        return;
                    // Add more switch case statements here as more webview message commands
                    // are created within the webview context (i.e. inside media/main.js)
                }
            },
            undefined,
            this._disposables
        );
    }

    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {

        const mainUri = getUri(webview, extensionUri, ["media", "main.js"]);

        const toolkitUri = getUri(webview, extensionUri, [
            "node_modules",
            "@microsoft",
            "vscode-webview-ui-toolkit",
            "dist",
            "toolkit.js",
        ]);

        const codiconStylesUri = getUri(webview, extensionUri, [
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.css",
        ]);

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="${codiconStylesUri}">
            <script type="module" src="${toolkitUri}"></script>
            <script type="module" src="${mainUri}"></script>
            <title>Hello World!</title>
            </head>
            <body>
            <h1>Hello World!</h1>

            <vscode-button>
                Button Text
                <span slot="start" class="codicon codicon-add"></span>
            </vscode-button>
            
            </body>
        </html>
        `;
    }
}
