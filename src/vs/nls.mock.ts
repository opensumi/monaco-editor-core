/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* ---------------------------------------------------------------------------------------------
 * 本文件用于为 esm 版本的 monaco-editor 提供 nls 多语言支持
 * 不适用于其他版本 (dev/min)
 *---------------------------------------------------------------------------------------------*/
// @ts-ignore
const zhCnBundle = require('../../dev/vs/editor/editor.main.nls.zh-cn.json');

let defaultLocale: string | undefined;

let CURRENT_LOCALE_DATA: { [prop: string]: string[] } | null = null;

// 标准语种代码，目前仅支持中、英文
export type LocaleType = 'zh-CN' | 'en-US';

let initialized = false;

export function setLocale(locale: LocaleType): void {
	defaultLocale = locale;
}

export enum PreferenceScope {
	Default,
	User,
}

const KAITIAN_LANGUAGE_KEY = 'general.language';

/**
 * 提供手动设置语言的方法 #setLocale
 * 如果在第一次调用 localize 前没有设置过 locale，则会走这里 fallback 的逻辑
 */
function initialLocaleBundle() {
	if (!defaultLocale) {
		if (localStorage[`${PreferenceScope.User}:${KAITIAN_LANGUAGE_KEY}`]) {
			defaultLocale = localStorage[`${PreferenceScope.User}:${KAITIAN_LANGUAGE_KEY}`];
		} else if (localStorage[`${PreferenceScope.Default}:${KAITIAN_LANGUAGE_KEY}`]) {
			defaultLocale = localStorage[`${PreferenceScope.Default}:${KAITIAN_LANGUAGE_KEY}`];
		} else {
			defaultLocale = 'zh-CN';
		}
	}

	// 由于目前仅支持中/英文，所以如果locale 为 'zh-cn'，则表示已经设置了中文，否则仅使用默认值，无需加载语言包
	if (defaultLocale?.toLowerCase() === 'zh-cn') {
		CURRENT_LOCALE_DATA = zhCnBundle;
	}
	initialized = true;
}

export interface ILocalizeInfo {
	key: string;
	comment: string[];
}

function _format(message: string, args: (string | number | boolean | undefined | null)[]): string {
	let result: string;

	if (args.length === 0) {
		result = message;
	} else {
		result = message.replace(/\{(\d+)\}/g, (match, rest) => {
			let index = rest[0];
			let arg = args[index];
			let result = match;
			if (typeof arg === 'string') {
				result = arg;
			} else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
				result = String(arg);
			}
			return result;
		});
	}

	return result;
}

export function loadLocaleBundle(bundle: {[prop: string]: string[]}) {
	CURRENT_LOCALE_DATA = bundle;
}

/**
 * 这里的类型注释本质是为了让编译时类型校验能通过
 * @param data
 * @param message
 *
 * 在编译后，localize 调用方式为
 * localize('path/to/file', index, defaultMessage, ...args);
 */
export function localize(data: string | ILocalizeInfo, message: string, ...args: any[]): string;
export function localize(path: string | ILocalizeInfo, index: number | string, ...args: any[]): string {
	// 第一次调用 localize 时如果没有默认语言，或语言包尚未初始化，则走初始化逻辑
	if (!defaultLocale || !initialized) {
		initialLocaleBundle();
	}
	if (typeof path === 'string') {
		if (!CURRENT_LOCALE_DATA || !CURRENT_LOCALE_DATA[path]) {
			const [defaultMessage, ...otherArgs] = args;
			return _format(defaultMessage, otherArgs);
		}
		const dataBundle = CURRENT_LOCALE_DATA[path];

		const [defaultMessage, ...otherArgs] = args;
		return _format(dataBundle[index as unknown as number] || defaultMessage, otherArgs);
	}
	return _format(index as unknown as string, args);
}
