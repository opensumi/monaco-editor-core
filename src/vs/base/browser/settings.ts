/* eslint-disable header/header */

class OverflowContentWidgetsSettings {
	private _topPadding = 22;
	private _bottomPadding = 22;

	private _hoverWidgetMaxHeight = 250;
	private _hoverWidgetMaxWidth = 500;

	set topPadding(num: number) {
		if (Number.isInteger(num)) {
			this._topPadding = num;
		}
	}
	get topPadding() {
		return this._topPadding;
	}

	set bottomPadding(num: number) {
		if (Number.isInteger(num)) {
			this._bottomPadding = num;
		}
	}
	get bottomPadding() {
		return this._bottomPadding;
	}

	get hoverWidgetMaxHeight() {
		return this._hoverWidgetMaxHeight;
	}

	get hoverWidgetMaxWidth() {
		return this._hoverWidgetMaxWidth;
	}

	set hoverWidgetMaxHeight(num: number) {
		if (Number.isInteger(num)) {
			this._hoverWidgetMaxHeight = num;
		}
	}

	set hoverWidgetMaxWidth(num: number) {
		if (Number.isInteger(num)) {
			this._hoverWidgetMaxWidth = num;
		}
	}
}

export const overflowWidgetsSettings = new OverflowContentWidgetsSettings();
