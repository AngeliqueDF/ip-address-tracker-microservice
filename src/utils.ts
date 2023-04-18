export function formatOffset(offset: number): string {
	let offsetString: string = "";

	if (offset < 0) {
		offsetString += "-";
		if (offset >= -9) offsetString += "0";
		offsetString += offset * -1;
	} else {
		if (offset <= 9) {
			offsetString += "+0";
		}
		offsetString += offset;
	}
	offsetString += ":00";

	return offsetString;
}
