import React, { useState } from "react";
import { Text, View } from "react-native-ui-lib";
import FanSwitch from "../../components/FanSwitch";
import StatusPane from "./StatusPane";
import Setting from "./Setting";

export type ServiceName = "temperature" | "humidity" | "battery";
const Remote = () => {
	const [power, setPower] = useState(() => true);

	const [currentActive, setCurrentActive] =
		useState<ServiceName>("temperature");
	const [temperature, setTemperature] = useState<number>(23);
	const [humidity, setHumidity] = useState<number>(65);
	const [battery, setBattery] = useState<number>(100);

	return (
		<View flex>
			<View flex-3>
				<View row centerV>
					<View flex-3 left>
						<Text text50>Trạng thái</Text>
					</View>
					<View flex-1 right>
						<FanSwitch state={power} onPress={setPower} />
					</View>
				</View>
				<View>
					<StatusPane
						currentActive={currentActive}
						changeCurrentActive={setCurrentActive}
						temperature={temperature}
						humidity={humidity}
						battery={battery}
					/>
				</View>
			</View>
			<View flex-2 marginT-32>
				<View flex-3 left>
					<Text text50 marginB-8>
						Thiết lập
					</Text>
					<Setting />
				</View>
			</View>
		</View>
	);
};

export default Remote;
