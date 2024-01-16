import React, { useContext, useEffect, useState } from "react";
import { Button, Incubator, Switch, Text, View } from "react-native-ui-lib";
import { BluetoothContext } from "../../contexts/BluetoothContextProvider";
import FanSwitch from "../../components/FanSwitch";
import StatusPane from "./StatusPane";
import Setting from "./Setting";
import { COLORS } from "../../utils/color";

export type InfoCharacterisctic =
	| "temperature"
	| "humidity"
	| "battery"
	| "fanSpeed";
const Remote = () => {
	const {
		battery,
		humidity,
		power,
		auto,
		temperature,
		setNewPower,
		setNewAuto,
		connectedDevice,
	} = useContext(BluetoothContext).useBLE;
	const [currentActive, setCurrentActive] =
		useState<InfoCharacterisctic>("temperature");
	const [showToast, setShowToast] = useState<boolean>(false);
	const [showAutoIsOn, setShowAutoIsOn] = useState<boolean>(false);

	const togglePower = () => {
		if (auto) {
			setShowAutoIsOn(true);
			return;
		}
		setNewPower(!power);
	};

	const toggleAuto = () => {
		setNewAuto(!auto);
	};

	useEffect(() => {
		const to = setTimeout(() => {
			if (!connectedDevice) {
				setShowToast(true);
			}
		}, 500);

		return () => {
			clearTimeout(to);
		};
	}, []);

	return (
		<View flex>
			<View flex-1>
				<View row centerV>
					<View flex-3 left>
						<Text text70 style={{ fontWeight: "bold" }}>
							Status
						</Text>

						{!connectedDevice && (
							<Text text90 center my-4 color={COLORS.RED}>
								(There is currently no connection to any device)
							</Text>
						)}

						<View row gap-8>
							<Text color={COLORS.PRIMARY} style={{ fontWeight: "bold" }}>
								Automatic mode
							</Text>
							<Switch
								value={auto}
								onColor={COLORS.PRIMARY}
								onValueChange={toggleAuto}
							/>
						</View>
					</View>
					<View flex-1 right>
						<FanSwitch state={power} onPress={togglePower} />
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
			<View flex-1 marginT-8 paddingT-8 paddingB-16>
				<View>
					<View row py-2 style={{ justifyContent: "space-between" }}>
						<Text left text70 style={{ fontWeight: "bold" }} marginB-8>
							Setting
						</Text>
					</View>
					<Setting />
				</View>
			</View>

			<Incubator.Toast
				message={"There are currently no connections to any SAC devices"}
				visible={showToast}
				preset={"offline"}
				iconColor={COLORS.GRAY}
				centerMessage
				swipeable
				position={"bottom"}
				backgroundColor={COLORS.WHITE}
				autoDismiss={2000}
				onDismiss={() => setShowToast(false)}
			/>

			<Incubator.Toast
				message={
					"The device is in Automatic mode! turn off automatic to control."
				}
				visible={showAutoIsOn}
				preset={"general"}
				iconColor={COLORS.PRIMARY}
				centerMessage
				swipeable
				position={"bottom"}
				backgroundColor={COLORS.WHITE}
				autoDismiss={2000}
				onDismiss={() => setShowAutoIsOn(false)}
			/>
		</View>
	);
};

export default Remote;
