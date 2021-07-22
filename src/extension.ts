import * as vscode from "vscode";
import { makeServer } from "./liveEditor";

export function activate(context: vscode.ExtensionContext) {
  const { startServer, stopServer } = makeServer();

  const statusButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    1
  );

  const START_COMMAND = "NeosLiveEditor.start";
  const STOP_COMMAND = "NeosLiveEditor.stop";

  const startCommand = vscode.commands.registerCommand(
    START_COMMAND,
    async (): Promise<void> => {
      try {
        await startServer();
        vscode.window.showInformationMessage("[NeosLiveEditor] Start Live");
        statusButton.text = "NLE:STOP";
        statusButton.command = STOP_COMMAND;
        statusButton.show();
      } catch (e) {
        vscode.window.showErrorMessage("[NeosLiveEditor] Error");
        throw e;
      }
    }
  );

  const stopCommand = vscode.commands.registerCommand(
    STOP_COMMAND,
    async (): Promise<void> => {
      try {
        await stopServer();
        vscode.window.showInformationMessage("[NeosLiveEditor] Stop Live");
        statusButton.text = "NLE:START";
        statusButton.command = START_COMMAND;
        statusButton.show();
      } catch (e) {
        vscode.window.showErrorMessage("[NeosLiveEditor] Error");
        throw e;
      }
    }
  );
  context.subscriptions.push(statusButton);
  context.subscriptions.push(startCommand);
  context.subscriptions.push(stopCommand);
}

export function deactivate() {}
