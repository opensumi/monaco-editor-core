/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-ignore
const zhCnBundle = require('../../dev/vs/editor/editor.main.nls.zh-cn.json');

export interface ILocalizeInfo {
	key: string;
	comment: string[];
}

export interface ILocalizedString {
	original: string;
	value: string;
}

function _format(message: string, args: any[]): string {
	let result: string;
	if (args.length === 0) {
		result = message;
	} else {
		result = message.replace(/\{(\d+)\}/g, function (match, rest) {
			const index = rest[0];
			return typeof args[index] !== 'undefined' ? args[index] : match;
		});
	}
	return result;
}

let defaultLocale: string | undefined;
let initialized = false;
let CURRENT_LOCALE_DATA: { [prop: string]: string[] } | null = null;
let localeFactory: () => string;

export type LocaleType = 'zh-CN' | 'en-US';

export function setLocale(locale: LocaleType): void {
	defaultLocale = locale;
}

export function loadLocaleBundle(bundle: { [prop: string]: string[] }) {
	CURRENT_LOCALE_DATA = bundle;
}

export function configureLocaleFactory(factory: () => string): void {
	localeFactory = factory;
}

export function localize(data: ILocalizeInfo | string, message: string, ...args: any[]): string {
	// allow-any-unicode-next-line
	// 第一次调用 localize 时如果没有默认语言，或语言包尚未初始化，则走初始化逻辑
	if (!defaultLocale || !initialized) {
		const factory = localeFactory || defaultInitialLocaleBundle;
		if (factory) {
			defaultLocale = factory();
			// allow-any-unicode-next-line
			// 由于目前仅支持中/英文，所以如果locale 为 'zh-cn'，则表示已经设置了中文，否则仅使用默认值，无需加载语言包
			if (defaultLocale?.toLowerCase() === 'zh-cn') {
				CURRENT_LOCALE_DATA = zhCnBundle;
			}
			initialized = true;
		}
	}

	if (typeof data === 'string') {
		let message: string | undefined;
		if (CURRENT_LOCALE_DATA && CURRENT_LOCALE_DATA[data]) {
			const dataBundle = CURRENT_LOCALE_DATA[data];
			message = dataBundle[message as unknown as number];
		}

		const [defaultMessage, ...otherArgs] = args;
		return _format(message || defaultMessage, otherArgs);
	}

	return _format(message, args);
}

export function localize2(data: ILocalizeInfo | string, message: string, ...args: any[]): ILocalizedString {
	// eslint-disable-next-line local/code-no-unexternalized-strings
	const res = localize(data, message, ...args);
	return {
		original: res,
		value: res
	};
}

export function getConfiguredDefaultLocale(_: string) {
	return undefined;
}

export enum PreferenceScope {
	Default,
	User,
}

const KAITIAN_LANGUAGE_KEY = 'general.language';


function defaultInitialLocaleBundle() {
	// @ts-ignore
	if (!global.localStorage || !self.localStorage) {
		return;

	}
	let _locale = defaultLocale;

	if (!_locale) {
		if (localStorage[`${PreferenceScope.User}:${KAITIAN_LANGUAGE_KEY}`]) {
			_locale = localStorage[`${PreferenceScope.User}:${KAITIAN_LANGUAGE_KEY}`];
		} else if (localStorage[`${PreferenceScope.Default}:${KAITIAN_LANGUAGE_KEY}`]) {
			_locale = localStorage[`${PreferenceScope.Default}:${KAITIAN_LANGUAGE_KEY}`];
		} else {
			_locale = 'zh-CN';
		}
	}

	return _locale;
}
