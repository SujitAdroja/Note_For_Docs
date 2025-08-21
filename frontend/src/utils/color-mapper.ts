const lightBgColors = [
	"bg-red-50",
	"bg-pink-50",
	"bg-yellow-50",
	"bg-green-50",
	"bg-teal-50",
	"bg-cyan-50",
	"bg-blue-50",
	"bg-indigo-50",
	"bg-purple-50",
	"bg-violet-50",
];

const darkBgColors = [
	"text-red-900",
	"text-pink-900",
	"text-yellow-900",
	"text-green-900",
	"text-teal-900",
	"text-cyan-900",
	"text-blue-900",
	"text-indigo-900",
	"text-purple-900",
	"text-violet-900",
];

const darkBorderColors = [
	"border-red-200",
	"border-pink-200",
	"border-yellow-200",
	"border-green-200",
	"border-teal-200",
	"border-cyan-200",
	"border-blue-200",
	"border-indigo-200",
	"border-purple-200",
	"border-violet-200",
];

const coloredShadows = [
	"shadow-[8px_8px_0px_rgba(248,113,113,0.3)]",
	"shadow-[8px_8px_0px_rgba(244,114,182,0.3)]",
	"shadow-[8px_8px_0px_rgba(253,224,71,0.3)]",
	"shadow-[8px_8px_0px_rgba(134,239,172,0.3)]",
	"shadow-[8px_8px_0px_rgba(94,234,212,0.3)]",
	"shadow-[8px_8px_0px_rgba(79,215,227,0.3)]",
	"shadow-[8px_8px_0px_rgba(147,197,253,0.3)]",
	"shadow-[8px_8px_0px_rgba(165,180,252,0.3)]",
	"shadow-[8px_8px_0px_rgba(196,181,253,0.3)]",
	"shadow-[8px_8px_0px_rgba(215,184,255,0.3)]",
];

const colorCache = new Map<string, number>();

const hashStringToNumber = (str: string): number => {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 33) ^ str.charCodeAt(i);
	}
	return Math.abs(hash);
};

export const getLightBgAndShadowForPatient = (id: string) => {
	if (colorCache.has(id)) {
		const cachedIndex = colorCache.get(id)!;
		return {
			bgColorClass: lightBgColors[cachedIndex],
			shadowClass: coloredShadows[cachedIndex],
			darkBgClass: darkBgColors[cachedIndex],
			darkBorderClass: darkBorderColors[cachedIndex],
		};
	}

	const index = hashStringToNumber(id) % lightBgColors.length;
	colorCache.set(id, index);

	return {
		bgColorClass: lightBgColors[index],
		shadowClass: coloredShadows[index],
		darkBgClass: darkBgColors[index],
		darkBorderClass: darkBorderColors[index],
	};
};
