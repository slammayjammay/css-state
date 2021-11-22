const { parseCSS } = require('./utils.js');

// expected format of JSON:
// {
//   "state-name": {
//     ".my-selector": {
//       "color": {
//         "default": "rgba(0, 0, 0, 0.3)",
//         "invert": "red"
//       }
//     }
//   }
// }
module.exports = class CSSState {
	constructor(json, el) {
		this.map = json;
		this.el = el || document.createElement('style');
		!el && this.el.setAttribute('id', 'css-state-style');
	}

	writeCSS(state, map = this.map) {
		this.el.innerHTML = this.getCSS(state, map);
	}

	getCSS(state, map = this.map) {
		const selectors = {};

		Object.keys(state).forEach(stateKey => {
			const currentState = state[stateKey];

			if (!map[stateKey]) {
				return;
			}

			Object.entries(map[stateKey]).forEach(([selector, cssKeys]) => {
				selectors[selector] = selectors[selector] || [];

				const styles = Object.entries(cssKeys).map(([cssKey, stateOptions]) => {
					const value = stateOptions[currentState];
					return value && `${cssKey}:${value};`;
				}).filter(val => !!val);

				selectors[selector].push(...styles);
			});
		});

		return Object.entries(selectors).map(([selector, styles]) => {
			return `${selector} {\n\t${styles.join('\n\t')}\n}`;
		}).join('\n\n');
	}

	// TODO
	// changeCSS(selector, css, map = this.map) {
	// 	const match = /^--([_-])(.*)/.exec(key);
	// 	if (!match) {
	// 		throw new Error(`CSS key must be prefixed with "---" or "--_".`);
	// 	}

	// 	const { cssKey, spec } = parseCSS(css);
	// 	Object.values(map).forEach(obj => obj[selector][cssKey] = spec);
	// }
};
