import express = require("express");
import { Server } from "http";
import * as vscode from "vscode";
import { getNeoText } from "./manager";

export function makeServer(host = "0.0.0.0", port = 5550) {
  const server: express.Express = express();

  server.get(
    "/v1/live/neos",
    (_req: express.Request, res: express.Response) => {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (activeTextEditor) {
        res.send(getNeoText(activeTextEditor));
      } else {
        res.send("");
      }
    }
  );

  // server.get(
  //   "/v2/live/neos",
  //   (_req: Express.Request, res: Express.Response) => {
  //     const activeTextEditor = vscode.window.activeTextEditor;
  //     const text = activeTextEditor?.document.getText();
  //     const result = {
  //       text,
  //       selection: activeTextEditor?.selection,
  //     };
  //     res.send(json2emap(result));
  //   }
  // );

  let serverInstance: Server | null = null;

  const startServer = async () => {
    try {
      serverInstance?.close();
      serverInstance?.removeAllListeners();
    } finally {
      serverInstance = server.listen(port, host);
    }
  };

  const stopServer = () => {
    if (serverInstance) {
      serverInstance?.close();
      serverInstance?.removeAllListeners();
    }
  };

  return { startServer, stopServer };
}
