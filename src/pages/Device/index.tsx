import React, { useEffect, useRef, useState } from "react";
import { Switch } from "react-native-gesture-handler";
import { ActionSheet, Button, Dialog, Text, View } from "react-native-ui-lib";
import useBluetoothState from "./../../bluetooth/useBluetoothState";
import useBLE from "./../../bluetooth/useBLE";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { COLORS } from "../../utils/color";
import { BOX_SHADOW } from "../../utils/styles";
import DeviceItem from "./DeviceItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Device as DeviceType } from "react-native-ble-plx";

const Device = () => {
	const {
		getBluetoothState,
		requestToEnable,
		turnOffBluetooth,
		turnOnBluetooth,
	} = useBluetoothState();
	const {
		requestPermissions,
		scanForPeripherals,
		allDevices,
		connectToDevice,
		connectedDevice,
		// heartRate,
		disconnectFromCurrentDevice,
	} = useBLE();

	const [isTurnOnBluetooth, setIsTurnOnBluetooth] = useState<boolean>(false);
	const [showNoNameDevice, setShowNoNameDevice] = useState<boolean>(false);
	const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
	const selectedDevice = useRef<DeviceType | null>(null);

	const handleRefreshScan = async () => {
		const isPermissionsEnabled = await requestPermissions();
		if (isPermissionsEnabled) {
			scanForPeripherals();
		}
	};

	const handleConnect = (id: DeviceType) => {
		connectToDevice(id);
	};

	const handleDisconnect = () => {
		disconnectFromCurrentDevice();
	};

	useEffect(() => {
		const requestTurnOnBluetooth = async () => {
			const result = await requestToEnable();
			console.log(result);
		};

		requestTurnOnBluetooth();
	}, []);

	// Initial
	useEffect(() => {
		const init = async () => {
			let isTurnOn: Boolean = (await getBluetoothState()) == "PoweredOn";
			while (!isTurnOn) {
				try {
					isTurnOn = await requestToEnable();
					setIsTurnOnBluetooth(isTurnOn.valueOf());
				} catch {}
			}
			scanForPeripherals();
		};

		setTimeout(init, 500);
	}, []);

	const listShowDevice = showNoNameDevice
		? allDevices
		: allDevices.filter((device) => device.name);

	return (
		<View flex>
			{connectedDevice && (
				<View flex-1>
					<View>
						<Text text60 marginB-8>
							Thiết bị đang kết nối hiện tại
						</Text>
						<DeviceItem
							device={connectedDevice}
							isConnected
							onPress={handleDisconnect}
						/>
					</View>
				</View>
			)}

			<View flex-5>
				<Text text60>
					Các thiết bị xung quanh bạn: (
					{showNoNameDevice
						? allDevices.length
						: allDevices.filter((item) => item.name).length}
					)
				</Text>
				<View
					row
					marginB-8
					style={{ justifyContent: "space-between", alignItems: "center" }}
				>
					<Text text70>Hiển thị các thiết bị không tên: </Text>
					<Switch
						thumbColor={COLORS.PRIMARY}
						trackColor={{ true: COLORS.LIGHT_PRIMARY }}
						value={showNoNameDevice}
						onChange={() => {
							setShowNoNameDevice(!showNoNameDevice);
						}}
					/>
				</View>

				<Button
					marginB-8
					br20
					onPress={handleRefreshScan}
					label="Làm mới"
					backgroundColor={COLORS.PRIMARY}
				/>

				<ScrollView>
					<View gap-8 padding-4>
						{listShowDevice.map((device) => (
							<DeviceItem
								key={device.id}
								device={device}
								onPress={() => {
									selectedDevice.current = device;
									setShowDetailModal(true);
								}}
							/>
						))}

						{listShowDevice.length === 0 && (
							<View center>
								<ActivityIndicator size={40} color={COLORS.PRIMARY} />
								<Text
									text90T
									color={COLORS.SECONDARY}
									style={{ maxWidth: 200, textAlign: "center" }}
								>
									Hãy thử quét thiết bị lại nếu đợi quá lâu mà không có phản hồi
									bạn nhé ❤️
								</Text>
							</View>
						)}
					</View>
				</ScrollView>
			</View>

			<ActionSheet
				title={"Chọn thao tác"}
				cancelButtonIndex={2}
				destructiveButtonIndex={0}
				onDismiss={() => {
					setShowDetailModal(false);
				}}
				renderTitle={() => {
					return (
						<View
							padding-16
							margin-8
							br50
							backgroundColor={COLORS.LIGHT_PRIMARY}
						>
							<Text text60 color={COLORS.WHITE}>
								Thông tin thiết bị
							</Text>
							<View paddingL-8>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Name:</Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.name || "NO"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Local name: </Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.localName || "NO"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Id:</Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.id || "NO"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Maximum Transmission Unit: </Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.mtu || "NO"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>
										Rec eived Signal Strength Indication:{" "}
									</Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.rssi || "NO"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Transmission power: </Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.txPowerLevel || "NO"}
									</Text>
								</View>
							</View>
						</View>
					);
				}}
				options={[
					{
						label: "Kết nối",
						onPress: () => {
							if (selectedDevice.current) handleConnect(selectedDevice.current);
						},
					},
					{
						label: "Hủy bỏ",
						onPress: () => {
							setShowDetailModal(false);
						},
					},
				]}
				visible={showDetailModal}
			></ActionSheet>
		</View>
	);
};

const styles = StyleSheet.create({
	infoLine: {
		justifyContent: "space-between",
	},
});

export default Device;
