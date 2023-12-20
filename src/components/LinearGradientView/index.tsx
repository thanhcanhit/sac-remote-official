import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewProps } from "react-native-ui-lib";

const LinearGradientView = (props: ViewProps) => {
	return (
		<View {...props}>
			<LinearGradient
				colors={["#1D8DFD", "#56A9F4"]}
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
