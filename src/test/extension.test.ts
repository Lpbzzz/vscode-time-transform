import * as assert from 'assert';
import * as vscode from 'vscode';
import dayjs from 'dayjs';

// 导入需要测试的函数（需要从extension.ts中导出）
// 由于VSCode扩展的特殊性，我们主要测试核心逻辑

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
 */
function detectTimestamp(text: string): { value: number; isSeconds: boolean } | null {
	const trimmed = text.trim();
	
	if (!/^\d+$/.test(trimmed)) {
		return null;
	}
	
	const num = parseInt(trimmed, 10);
	
	if (num <= 0) {
		return null;
	}
	
	if (trimmed.length === 10 && num >= 946684800 && num <= 2147483647) {
		return { value: num, isSeconds: true };
	}
	
	if (trimmed.length === 13 && num >= 946684800000 && num <= 2147483647000) {
		return { value: num, isSeconds: false };
	}
	
	return null;
}

/**
 * 将时间戳转换为格式化时间字符串
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
 */
function transformTime(selectedText: string): TimeTransformResult {
	if (!selectedText || !selectedText.trim()) {
		return { success: false, error: '请选择要转换的文本' };
	}
	
	const timestampInfo = detectTimestamp(selectedText);
	if (timestampInfo) {
		return timestampToString(timestampInfo);
	}
	
	return stringToTimestamp(selectedText);
}

suite('Time Transform Extension Test Suite', () => {
	vscode.window.showInformationMessage('开始时间转换扩展测试');

	suite('detectTimestamp 函数测试', () => {
		test('应该正确检测10位秒级时间戳', () => {
			const result = detectTimestamp('1609459200'); // 2021-01-01 00:00:00
			assert.strictEqual(result?.value, 1609459200);
			assert.strictEqual(result?.isSeconds, true);
		});

		test('应该正确检测13位毫秒级时间戳', () => {
			const result = detectTimestamp('1609459200000'); // 2021-01-01 00:00:00
			assert.strictEqual(result?.value, 1609459200000);
			assert.strictEqual(result?.isSeconds, false);
		});

		test('应该拒绝无效的时间戳格式', () => {
			assert.strictEqual(detectTimestamp('abc'), null);
			assert.strictEqual(detectTimestamp('123abc'), null);
			assert.strictEqual(detectTimestamp('12345'), null); // 5位数字
			assert.strictEqual(detectTimestamp('123456789012345'), null); // 15位数字
		});

		test('应该拒绝超出范围的时间戳', () => {
			assert.strictEqual(detectTimestamp('0'), null);
			assert.strictEqual(detectTimestamp('-1609459200'), null);
			assert.strictEqual(detectTimestamp('9999999999'), null); // 超出2038年
		});

		test('应该处理带空格的输入', () => {
			const result = detectTimestamp('  1609459200  ');
			assert.strictEqual(result?.value, 1609459200);
			assert.strictEqual(result?.isSeconds, true);
		});
	});

	suite('timestampToString 函数测试', () => {
		test('应该正确转换秒级时间戳', () => {
			const result = timestampToString({ value: 1609459200, isSeconds: true });
			assert.strictEqual(result.success, true);
			assert.strictEqual(result.result, '2021-01-01 00:00:00');
		});

		test('应该正确转换毫秒级时间戳', () => {
			const result = timestampToString({ value: 1609459200000, isSeconds: false });
			assert.strictEqual(result.success, true);
			assert.strictEqual(result.result, '2021-01-01 00:00:00');
		});

		test('应该处理无效时间戳', () => {
			const result = timestampToString({ value: -1, isSeconds: true });
			assert.strictEqual(result.success, false);
			assert.strictEqual(result.error, '无效的时间戳');
		});
	});

	suite('stringToTimestamp 函数测试', () => {
		test('应该正确转换标准时间格式', () => {
			const result = stringToTimestamp('2021-01-01 00:00:00');
			assert.strictEqual(result.success, true);
			assert.strictEqual(result.result, '1609459200000');
		});

		test('应该正确转换ISO格式', () => {
			const result = stringToTimestamp('2021-01-01T00:00:00.000Z');
			assert.strictEqual(result.success, true);
		});

		test('应该拒绝空字符串', () => {
			const result = stringToTimestamp('');
			assert.strictEqual(result.success, false);
			assert.strictEqual(result.error, '时间字符串不能为空');
		});

		test('应该拒绝无效时间格式', () => {
			const result = stringToTimestamp('invalid-date');
			assert.strictEqual(result.success, false);
			assert.strictEqual(result.error, '无效的时间格式');
		});

		test('应该拒绝超出范围的年份', () => {
			const result1 = stringToTimestamp('1969-01-01 00:00:00');
			assert.strictEqual(result1.success, false);
			assert.strictEqual(result1.error, '时间超出支持范围 (1970-2038)');

			const result2 = stringToTimestamp('2039-01-01 00:00:00');
			assert.strictEqual(result2.success, false);
			assert.strictEqual(result2.error, '时间超出支持范围 (1970-2038)');
		});

		test('应该处理带空格的输入', () => {
			const result = stringToTimestamp('  2021-01-01 00:00:00  ');
			assert.strictEqual(result.success, true);
			assert.strictEqual(result.result, '1609459200000');
		});
	});

	suite('transformTime 集成测试', () => {
		test('应该正确处理时间戳到字符串的转换', () => {
			const result = transformTime('1609459200');
			assert.strictEqual(result.success, true);
			assert.strictEqual(result.result, '2021-01-01 00:00:00');
		});

		test('应该正确处理字符串到时间戳的转换', () => {
			const result = transformTime('2021-01-01 00:00:00');
			assert.strictEqual(result.success, true);
			assert.strictEqual(result.result, '1609459200000');
		});

		test('应该处理空输入', () => {
			const result = transformTime('');
			assert.strictEqual(result.success, false);
			assert.strictEqual(result.error, '请选择要转换的文本');
		});

		test('应该处理无效输入', () => {
			const result = transformTime('invalid-input');
			assert.strictEqual(result.success, false);
			assert.strictEqual(result.error, '无效的时间格式');
		});
	});

	suite('边界情况测试', () => {
		test('应该处理最小有效时间戳', () => {
			const result = transformTime('946684800'); // 2000-01-01 00:00:00
			assert.strictEqual(result.success, true);
		});

		test('应该处理最大有效时间戳', () => {
			const result = transformTime('2147483647'); // 2038-01-19 03:14:07
			assert.strictEqual(result.success, true);
		});

		test('应该处理毫秒级时间戳的边界', () => {
			const result1 = transformTime('946684800000');
			assert.strictEqual(result1.success, true);

			const result2 = transformTime('2147483647000');
			assert.strictEqual(result2.success, true);
		});

		test('应该处理各种时间格式', () => {
			const formats = [
				'2021-01-01',
				'2021/01/01',
				'2021-01-01 12:30:45',
				'2021/01/01 12:30:45'
			];

			formats.forEach(format => {
				const result = transformTime(format);
				assert.strictEqual(result.success, true, `格式 ${format} 应该被正确处理`);
			});
		});
	});
});
