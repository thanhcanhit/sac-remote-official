import React from "react";
import { View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";

type BatteryBarType = {
	value: number;
};

const BatteryBar = ({ value }: BatteryBarType) => {
	// Validate value
	if (value < 0) value = 0;
	if (value > 100) value = 100;

	// Get color matching with value of battery
	const bgColor = (() => {
		if (value <= 25) return COLORS.RED;
		else if (value <= 65) return COLORS.YELLOW;
		else return COLORS.GREEN;
	})();

	return (
		<View
			height={25}
			width={50}
			padding-4
			br50
			backgroundColor={COLORS.WHITE}
			style={{ overflow: "hidden" }}
		>
			<View
				backgroundColor={bgColor}
				height="100%"
				width={`${value}%`}
				br100
				style={{ minWidth: 8 }}
			></View>
		</View>
	);
};
export default BatteryBar;
