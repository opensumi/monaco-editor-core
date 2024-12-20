/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* ---------------------------------------------------------------------------------------------
 * 本文件用于为 esm 版本的 monaco-editor 提供 nls 多语言支持
 * 不适用于其他版本 (dev/min)
 *---------------------------------------------------------------------------------------------*/
// eslint-disable-next-line local/code-import-patterns
import { getNLSLanguage } from './nls.messages.js';
// eslint-disable-next-line local/code-import-patterns
export { getNLSLanguage, getNLSMessages } from './nls.messages.js';

// @ts-ignore
const zhCnBundle = require('../nls.messages.zh-cn.json');

let defaultLocale: string | undefined;
let CURRENT_LOCALE_DATA: { [prop: string]: string[] } | null = null;
let initialized = false;
const KAITIAN_LANGUAGE_KEY = 'general.language';
// 标准语种代码，目前仅支持中、英文
export type LocaleType = 'zh-CN' | 'en-US';
export enum PreferenceScope {
	Default,
	User,
}
export const setLocale = (locale: LocaleType): void => {
	defaultLocale = locale;
}
/**
 * 提供手动设置语言的方法 #setLocale
 * 如果在第一次调用 localize 前没有设置过 locale，则会走这里 fallback 的逻辑
 */
function initialLocaleBundle() {
	// @ts-ignore
	if (!global.localStorage || !self.localStorage) {
		return;
	}
	if (!defaultLocale) {
		if (localStorage[`${PreferenceScope.User}:${KAITIAN_LANGUAGE_KEY}`]) {
			setLocale(localStorage[`${PreferenceScope.User}:${KAITIAN_LANGUAGE_KEY}`])
		} else if (localStorage[`${PreferenceScope.Default}:${KAITIAN_LANGUAGE_KEY}`]) {
			setLocale(localStorage[`${PreferenceScope.Default}:${KAITIAN_LANGUAGE_KEY}`]);
		} else {
			setLocale('zh-CN')
		}
	}
	// 由于目前仅支持中/英文，所以如果locale 为 'zh-cn'，则表示已经设置了中文，否则仅使用默认值，无需加载语言包
	if (defaultLocale?.toLowerCase() === 'zh-cn') {
		CURRENT_LOCALE_DATA = zhCnBundle;
	}
	initialized = true;
}

const isPseudo = getNLSLanguage() === 'pseudo' || (typeof document !== 'undefined' && document.location && typeof document.location.hash === 'string' && document.location.hash.indexOf('pseudo=true') >= 0);

export interface ILocalizeInfo {
	key: string;
	comment: string[];
}

export interface ILocalizedString {
	original: string;
	value: string;
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

	if (isPseudo) {
		// FF3B and FF3D is the Unicode zenkaku representation for [ and ]
		result = '\uFF3B' + result.replace(/[aouei]/g, '$&$&') + '\uFF3D';
	}

	return result;
}

export function loadLocaleBundle(bundle: { [prop: string]: string[] }) {
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


export function localize2(data: string | ILocalizeInfo, message: string, ...args: any[]): ILocalizedString;
export function localize2(path: string | ILocalizeInfo, index: number | string, ...args: any[]): ILocalizedString {
	const res = localize(path, index as string, ...args);
	return {
		original: res,
		value: res
	};
}

export interface INLSLanguagePackConfiguration {

	/**
	 * The path to the translations config file that contains pointers to
	 * all message bundles for `main` and extensions.
	 */
	readonly translationsConfigFile: string;

	/**
	 * The path to the file containing the translations for this language
	 * pack as flat string array.
	 */
	readonly messagesFile: string;

	/**
	 * The path to the file that can be used to signal a corrupt language
	 * pack, for example when reading the `messagesFile` fails. This will
	 * instruct the application to re-create the cache on next startup.
	 */
	readonly corruptMarkerFile: string;
}

export interface INLSConfiguration {

	/**
	 * Locale as defined in `argv.json` or `app.getLocale()`.
	 */
	readonly userLocale: string;

	/**
	 * Locale as defined by the OS (e.g. `app.getPreferredSystemLanguages()`).
	 */
	readonly osLocale: string;

	/**
	 * The actual language of the UI that ends up being used considering `userLocale`
	 * and `osLocale`.
	 */
	readonly resolvedLanguage: string;

	/**
	 * Defined if a language pack is used that is not the
	 * default english language pack. This requires a language
	 * pack to be installed as extension.
	 */
	readonly languagePack?: INLSLanguagePackConfiguration;

	/**
	 * The path to the file containing the default english messages
	 * as flat string array. The file is only present in built
	 * versions of the application.
	 */
	readonly defaultMessagesFile: string;

	/**
	 * Below properties are deprecated and only there to continue support
	 * for `vscode-nls` module that depends on them.
	 * Refs https://github.com/microsoft/vscode-nls/blob/main/src/node/main.ts#L36-L46
	 */
	/** @deprecated */
	readonly locale: string;
	/** @deprecated */
	readonly availableLanguages: Record<string, string>;
	/** @deprecated */
	readonly _languagePackSupport?: boolean;
	/** @deprecated */
	readonly _languagePackId?: string;
	/** @deprecated */
	readonly _translationsConfigFile?: string;
	/** @deprecated */
	readonly _cacheRoot?: string;
	/** @deprecated */
	readonly _resolvedLanguagePackCoreLocation?: string;
	/** @deprecated */
	readonly _corruptedFile?: string;
}

export interface ILanguagePack {
	readonly hash: string;
	readonly label: string | undefined;
	readonly extensions: {
		readonly extensionIdentifier: { readonly id: string; readonly uuid?: string };
		readonly version: string;
	}[];
	readonly translations: Record<string, string | undefined>;
}

export type ILanguagePacks = Record<string, ILanguagePack | undefined>;
