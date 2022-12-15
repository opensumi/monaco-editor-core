/* eslint-disable header/header */

class OverflowContentWidgetsSettings {
	private _TOP_PADDING = 22;
	private _BOTTOM_PADDING = 22;

	set topPadding(num: number) {
		if (Number.isInteger(num)) {
			this._TOP_PADDING = num;
		}
	}
	get topPadding() {
		return this._TOP_PADDING;
	}

	set bottomPadding(num: number) {
		if (Number.isInteger(num)) {
			this._BOTTOM_PADDING = num;
		}
	}
	get bottomPadding() {
		return this._BOTTOM_PADDING;
	}
}

const overflowWidgetsSettings = new OverflowContentWidgetsSettings();

export { overflowWidgetsSettings };
