import * as vscode from 'vscode';
const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);

export function activate(context: vscode.ExtensionContext) {
	const createIndexCommand = vscode.commands.registerCommand('timeTransform', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);
			const isValidate = dayjs(selectedText).isValid();
			const isNumber = !isNaN(Number(selectedText));
			if (isValidate) {
				if (isNumber) {
					const len = selectedText.length;
					const isTimestamp = len === 10 || selectedText.length === 13;
					if (!isTimestamp) {
						vscode.window.showErrorMessage('请选择一个有效的时间戳');
						return;
					}
					const dayObj = len === 10 ? dayjs.unix(Number(selectedText)) : dayjs(Number(selectedText));
					const format = dayObj.format('YYYY-MM-DD HH:mm:ss');
					const start = selection.start;
					const end = selection.end;
					editor.edit((editBuilder) => {
						editBuilder.replace(new vscode.Range(start, end), `${format}`);
					});
				} else {
					const dayObj = dayjs(selectedText);
					const timestamp = dayObj.valueOf();
					const start = selection.start;
					const end = selection.end;
					editor.edit((editBuilder) => {
						editBuilder.replace(new vscode.Range(start, end), `${timestamp}`);
					});
				}
			} else {
				vscode.window.showErrorMessage('请选择一个有效的时间戳或时间字符串');
			}
		}
	});
	context.subscriptions.push(createIndexCommand);
}

export function deactivate() { }
