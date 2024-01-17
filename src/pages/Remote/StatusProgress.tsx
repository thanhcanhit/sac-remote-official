import React from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";
import { LinearGradient } from "expo-linear-gradient";

type StatusProgressProps = {
	state: number;
};

const StatusProgress = ({ state }: StatusProgressProps) => {
	return (
		<View center style={{ zIndex: -10 }}>
			<AnimatedCircularProgress
				size={200}
				width={15}
				backgroundWidth={24}
				fill={state}
				arcSweepAngle={240}
				lineCap="round"
				tintColor={COLORS.PRIMARY}
				backgroundColor={COLORS.WHITE}
				rotation={-120}
			>
				{(fill) => (
					<LinearGradient
						colors={[COLORS.PRIMARY, COLORS.LIGHT_PRIMARY]}
						locations={[0.0244, 0.9869]}
						start={{ x: 0.03, y: 0 }}
						end={{ x: 0.97, y: 0 }}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							width: 130,
							height: 130,
							borderRadius: 999,
						}}
					>
						<Text text30 color={COLORS.WHITE} style={{ fontWeight: "bold" }}>
							{Math.round(fill)}
						</Text>
					</LinearGradient>
				)}
			</AnimatedCircularProgress>
		</View>
	);
};

export default StatusProgress;
