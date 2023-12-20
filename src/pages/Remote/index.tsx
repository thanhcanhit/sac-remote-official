import React, { useState } from "react";
import { Switch, Text, View } from "react-native-ui-lib";
import FanSwitch from "../../components/FanSwitch";
import StatusPane from "./StatusPane";

const Remote = () => {
	const [power, setPower] = useState(() => true);
	return (
		<View flex>
			<View row centerV>
				<View flex-3 left>
					<Text text50>Đai lưng điều hòa</Text>
				</View>
				<View flex-1 right>
					<FanSwitch state={power} onPress={() => setPower(!power)} />
				</View>
			</View>
			<View>
				<StatusPane />
			</View>
		</View>
	);
};

export default Remote;
