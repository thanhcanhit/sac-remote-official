import React, { useContext, useEffect, useState } from "react";
import { Button, Incubator, Switch, Text, View } from "react-native-ui-lib";
import { BluetoothContext } from "../../contexts/BluetoothContextProvider";
import FanSwitch from "../../components/FanSwitch";
import StatusPane from "./StatusPane";
import Setting from "./Setting";
import { COLORS } from "../../utils/color";
import { ScrollView } from "react-native";

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
		<ScrollView style={{ height: "100%" }}>
			<View>
				<View row centerV style={{ justifyContent: "space-between" }}>
					<View left>
						<Text text70 style={{ fontWeight: "bold" }}>
							Status
						</Text>
						<>
							{!connectedDevice && (
								<Text text90 center my-4 color={COLORS.RED}>
									(No connection)
								</Text>
							)}
						</>

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
					<View right>
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
			<View marginT-8 paddingT-8 paddingB-16 marginB-20>
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
		</ScrollView>
	);
};

export default Remote;
