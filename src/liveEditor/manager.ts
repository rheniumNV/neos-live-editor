import * as vscode from "vscode";

const pipe = (text: any) => (func: Function) => {
  const result = func(text);
  return {
    text: result,
    pipe: pipe(result),
  };
};

const replace =
  (active: boolean, character: number | undefined = 0, str: string): Function =>
  (text: string): string =>
    active
      ? text.substring(0, character) + str + text.substring(character)
      : text;

export function getNeoText(editor: vscode.TextEditor) {
  const text = editor.document.getText();
  const selection = editor.selection;
  const anchor = selection.anchor;
  const start = selection.start;
  const end = selection?.end;
  const isSelected = !(
    start?.line === end?.line && start?.character === end?.character
  );
  const isOneLineSelect = start?.line === end?.line;
  const neoText = text
    ?.split("\n")
    .map(
      (str, index) =>
        `${
          !isOneLineSelect &&
          index > Number(start?.line) &&
          index <= Number(end?.line)
            ? "</color>"
            : ""
        }${("    " + (index + 1)).slice(-4)}${
          !isOneLineSelect &&
          index > Number(start?.line) &&
          index <= Number(end?.line)
            ? "<color=green>"
            : ""
        }    ${
          pipe(str)(
            replace(index === anchor?.line, anchor?.character, "<$cursor />")
          )
            .pipe(
              replace(
                isSelected && index === start?.line,
                Number(start?.character) +
                  (anchor?.line === start?.line &&
                  Number(anchor?.character) < Number(start?.character)
                    ? 11
                    : 0),
                "<color=green>"
              )
            )
            .pipe(
              replace(
                isSelected && index === end?.line,
                Number(end?.character) +
                  (isOneLineSelect ? 13 : 0) +
                  (anchor?.line === end?.line &&
                  Number(anchor?.character) < Number(end?.character)
                    ? 11
                    : 0),
                "</color>"
              )
            ).text
        }`
    )
    .join("\n");
  return neoText;
}
