import React, { Fragment } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";
import { BOX_SHADOW } from "../../utils/styles";
import { LinearGradient } from "expo-linear-gradient";

type StatusProgressProps = {
	state: number;
	// min?: string;
	// max?: string;
};

const StatusProgress = ({ state }: StatusProgressProps) => {
	return (
		<View center marginT-32>
			<AnimatedCircularProgress
				size={250}
				width={20}
				backgroundWidth={28}
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
							padding: 16,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							width: 160,
							height: 160,
							borderRadius: 999,
							position: "relative",
						}}
					>
						<Text text20 color={COLORS.WHITE} style={{ fontWeight: "bold" }}>
							{Math.round(fill)}
						</Text>
					</LinearGradient>
				)}
			</AnimatedCircularProgress>
			{/* <View
				style={{
					position: "absolute",
					left: 0,
					bottom: 0,
					zIndex: 999,
				}}
			>
				<Text text50 color={COLORS.PRIMARY}>
					0°C
				</Text>
			</View>
			<View
				style={{
					position: "absolute",
					right: 0,
					bottom: 0,
					zIndex: 999,
				}}
			>
				<Text text50 color={COLORS.PRIMARY}>
					100°C
				</Text>
			</View> */}
		</View>
	);
};

export default StatusProgress;
