import * as vscode from 'vscode';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 时间转换的结果类型
 */
interface TimeTransformResult {
	success: boolean;
	result?: string;
	error?: string;
}

/**
 * 检测字符串是否为有效的时间戳
 * @param text 输入文本
 * @returns 时间戳信息或null
 */
function detectTimestamp(text: string): { value: number; isSeconds: boolean } | null {
	const trimmed = text.trim();
	
	// 检查是否为纯数字
	if (!/^\d+$/.test(trimmed)) {
		return null;
	}
	
	const num = parseInt(trimmed, 10);
	
	// 检查数字范围是否合理
	if (num <= 0) {
		return null;
	}
	
	// 10位数字：秒级时间戳 (1970-2038年)
	if (trimmed.length === 10 && num >= 946684800 && num <= 2147483647) {
		return { value: num, isSeconds: true };
	}
	
	// 13位数字：毫秒级时间戳 (1970-2038年)
	if (trimmed.length === 13 && num >= 946684800000 && num <= 2147483647000) {
		return { value: num, isSeconds: false };
	}
	
	return null;
}

/**
 * 将时间戳转换为格式化时间字符串
 * @param timestamp 时间戳信息
 * @returns 转换结果
 */
function timestampToString(timestamp: { value: number; isSeconds: boolean }): TimeTransformResult {
	try {
		const dayObj = timestamp.isSeconds 
			? dayjs.unix(timestamp.value)
			: dayjs(timestamp.value);
		
		if (!dayObj.isValid()) {
			return { success: false, error: '无效的时间戳' };
		}
		
		const formatted = dayObj.format('YYYY-MM-DD HH:mm:ss');
		return { success: true, result: formatted };
	} catch (error) {
		return { success: false, error: '时间戳转换失败' };
	}
}

/**
 * 将时间字符串转换为时间戳
 * @param timeString 时间字符串
 * @returns 转换结果
 */
function stringToTimestamp(timeString: string): TimeTransformResult {
	try {
		const trimmed = timeString.trim();
		
		if (!trimmed) {
			return { success: false, error: '时间字符串不能为空' };
		}
		
		const dayObj = dayjs(trimmed);
		
		if (!dayObj.isValid()) {
			return { success: false, error: '无效的时间格式' };
		}
		
		// 检查年份是否在合理范围内
		const year = dayObj.year();
		if (year < 1970 || year > 2038) {
			return { success: false, error: '时间超出支持范围 (1970-2038)' };
		}
		
		const timestamp = dayObj.valueOf();
		return { success: true, result: timestamp.toString() };
	} catch (error) {
		return { success: false, error: '时间字符串转换失败' };
	}
}

/**
 * 执行时间转换
 * @param selectedText 选中的文本
 * @returns 转换结果
 */
function transformTime(selectedText: string): TimeTransformResult {
	if (!selectedText || !selectedText.trim()) {
		return { success: false, error: '请选择要转换的文本' };
	}
	
	// 首先尝试检测时间戳
	const timestampInfo = detectTimestamp(selectedText);
	if (timestampInfo) {
		return timestampToString(timestampInfo);
	}
	
	// 如果不是时间戳，尝试作为时间字符串处理
	return stringToTimestamp(selectedText);
}

export function activate(context: vscode.ExtensionContext) {
	const timeTransformCommand = vscode.commands.registerCommand('timeTransform', async () => {
		const editor = vscode.window.activeTextEditor;
		
		if (!editor) {
			vscode.window.showErrorMessage('没有打开的编辑器');
			return;
		}
		
		const selection = editor.selection;
		
		// 检查是否有选中文本
		if (selection.isEmpty) {
			vscode.window.showErrorMessage('请先选择要转换的文本');
			return;
		}
		
		const selectedText = editor.document.getText(selection);
		const result = transformTime(selectedText);
		
		if (result.success && result.result) {
			try {
				await editor.edit((editBuilder) => {
					editBuilder.replace(selection, result.result!);
				});
				vscode.window.showInformationMessage(`转换成功: ${result.result}`);
			} catch (error) {
				vscode.window.showErrorMessage('文本替换失败');
			}
		} else {
			vscode.window.showErrorMessage(result.error || '转换失败');
		}
	});
	
	context.subscriptions.push(timeTransformCommand);
}

export function deactivate() { }
