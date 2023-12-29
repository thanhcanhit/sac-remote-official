import React from "react";
import { View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";

const Separator = ({
	width = "90%",
	color = COLORS.GRAY,
	height = 1,
}: {
	width?: string | number;
	color?: string;
	height?: number;
}) => {
	return (
		<View center>
			<View
				width={width}
				height={height}
				backgroundColor={color}
				marginV-8
			></View>
		</View>
	);
};

export default Separator;
