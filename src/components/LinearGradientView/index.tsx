import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewProps } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";

const LinearGradientView = (props: ViewProps) => {
	return (
		<View {...props}>
			<LinearGradient
				colors={[COLORS.PRIMARY, COLORS.LIGHT_PRIMARY]}
				locations={[0.0244, 0.9869]}
				start={{ x: 0.03, y: 0 }}
				end={{ x: 0.97, y: 0 }}
				style={{
					width: "100%",
					height: "100%",
					padding: 8,
					display: "flex",
					flexDirection: "row",
				}}
			>
				{props.children}
			</LinearGradient>
		</View>
	);
};

export default LinearGradientView;
