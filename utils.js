const cssReg = /--([-_])([^:\s]+):\s*([^\s]+)\s+([^;]*)\s*;/;
const specReg = /\s*([^']+):\s*([^']+)/g;

const parseCSS = (css) => {
	const parsed = {};
	const match = cssReg.exec(css);

	if (!match) {
		return null;
	}

	const [_, cssVarChar, keyName, stateKey, spec] = match;
	const cssKey = cssVarChar === '_' ? `--${keyName}` : keyName;

	return { cssKey, stateKey, spec: parseSpec(spec) };
};

const parseSpec = (spec) => {
	const specJSON = {};

	const reg = new RegExp(specReg);
	let match = reg.exec(spec);

	if (!match) {
		throw new Error(`Could not parse spec. Format should be "state-key 'state-value-1:css-value-1' 'state-value-2:css-value-2'" (received "${spec}").`);
	}

	do {
		const [_, stateValue, cssValue] = match;
		specJSON[stateValue] = cssValue;
	} while ((match = reg.exec(spec)));

	return specJSON;
};

module.exports = { cssReg, specReg, parseCSS, parseSpec };
