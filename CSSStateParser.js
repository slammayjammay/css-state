const fs = require('fs');
const { cssReg, parseCSS } = require('./utils.js');

module.exports = class CSSStateParser {
	constructor() {
		this.reset();
	}

	reset() {
		this.map = {};
	}

	parseFiles(files = []) {
		return Promise.all(files.map(filePath => this.parseFile(filePath)));
	}

	async parseFile(filePath) {
		const [error, buffer] = await new Promise(r => fs.readFile(filePath, (...args) => r([...args])));
		if (error) {
			return [error];
		}

		this.parseCSS(buffer.toString());
	}

	parseCSS(css) {
		const reg = new RegExp(cssReg, 'g');
		let match;

		while ((match = reg.exec(css))) {
			const { cssKey, stateKey, spec } = parseCSS(match[0]);
			const sel = this.findSelector(css, match.index);

			this.map[stateKey] = this.map[stateKey] || {};
			this.map[stateKey][sel] = this.map[stateKey][sel] || {};
			this.map[stateKey][sel][cssKey] = spec;
		}
	}

	findSelector(css, index) {
		let endIdx = index;
		while (css[endIdx] !== '{') endIdx--;

		let startIdx = endIdx;
		while (startIdx >= 0 && css[startIdx] !== '}') startIdx--;

		return css.slice(startIdx + 1, endIdx).trim();
	}

	toJSON() {
		return this.map;
	}
}
