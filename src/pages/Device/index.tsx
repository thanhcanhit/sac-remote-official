import React, { useContext, useEffect, useRef, useState } from "react";
import { Switch } from "react-native-gesture-handler";
import {
	ActionSheet,
	Button,
	Incubator,
	Text,
	View,
} from "react-native-ui-lib";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { COLORS } from "../../utils/color";
import DeviceItem from "./DeviceItem";
import { Device as DeviceType } from "react-native-ble-plx";
import { BluetoothContext } from "../../contexts/BluetoothContextProvider";

type ToastVariant = "success" | "failure" | "general";
const Device = () => {
	const { getBluetoothState, requestToEnable } =
		useContext(BluetoothContext)?.useBluetoothState;
	const {
		lastDevice,
		requestPermissions,
		scanForPeripherals,
		allDevices,
		connectToDevice,
		connectedDevice,
		disconnectFromCurrentDevice,
	} = useContext(BluetoothContext)?.useBLE;

	const [showNoNameDevice, setShowNoNameDevice] = useState<boolean>(false);
	const [toast, setToast] = useState<{
		show: boolean;
		message: string;
		variant: ToastVariant;
	}>({
		show: false,
		message: "",
		variant: "general",
	});
	const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
	const selectedDevice = useRef<DeviceType | null>(null);

	const handleRefreshScan = async () => {
		const isPermissionsEnabled = await requestPermissions();
		if (isPermissionsEnabled) {
			scanForPeripherals();
		}
	};

	const handleConnect = async (id: DeviceType) => {
		try {
			const isConnected = await connectToDevice(id);
			if (isConnected) showToast("Connected to " + id.name, "success");
		} catch (e) {
			showToast(
				"Unable to connect to the device, ensure it is an SAC device",
				"failure"
			);
		}
	};

	const handleDisconnect = () => {
		disconnectFromCurrentDevice();
		showToast("Device disconnected", "general");
	};

	const showToast = (message: string, variant?: ToastVariant) => {
		setToast({ message, show: true, variant: variant ? variant : "general" });
	};

	// Initial
	useEffect(() => {
		const initial = async () => {
			let isTurnOn: Boolean = (await getBluetoothState()) == "PoweredOn";
			if (!isTurnOn) {
				try {
					isTurnOn = await requestToEnable();
				} catch {}
			}
			scanForPeripherals();
		};

		initial();
	}, []);

	const listShowDevice = showNoNameDevice
		? allDevices
		: allDevices.filter((device) => device.name);

	return (
		<View flex>
			{(lastDevice || connectedDevice) && (
				<View flex-2>
					<View>
						<Text text80 marginB-8>
							Most recently connected device (press to fast connect/disconnect)
						</Text>
						{connectedDevice ? (
							<DeviceItem
								device={connectedDevice}
								isConnected
								onPress={handleDisconnect}
							/>
						) : (
							lastDevice && (
								<DeviceItem
									device={lastDevice}
									onPress={() => handleConnect(lastDevice)}
								/>
							)
						)}
					</View>
				</View>
			)}

			<View flex-4>
				<Text text70 style={{ fontWeight: "bold" }}>
					Devices around you:{" "}
					<Text text80>
						(
						{showNoNameDevice
							? allDevices.length
							: allDevices.filter((item) => item.name).length}
						)
					</Text>
				</Text>
				<View
					row
					marginB-8
					style={{ justifyContent: "space-between", alignItems: "center" }}
				>
					<Text text70>Show unnamed devices: </Text>
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
					label="Refresh"
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
									style={{ maxWidth: 250, textAlign: "center" }}
								>
									Please try scanning the device again if you wait too long
									without a response
								</Text>
							</View>
						)}
					</View>
				</ScrollView>
			</View>

			<ActionSheet
				title={"Select operation"}
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
							<Text text60 color={COLORS.WHITE} center>
								Device Information
							</Text>
							<View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Name:</Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.name || "- - -"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Local name: </Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.localName || "- - -"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Id:</Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.id || "- - -"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Maximum Transmission Unit: </Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.mtu || "- - -"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>
										Received Signal Strength Indication:{" "}
									</Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.rssi || "- - -"}
									</Text>
								</View>
								<View row style={styles.infoLine}>
									<Text color={COLORS.WHITE}>Transmission power: </Text>
									<Text color={COLORS.WHITE}>
										{selectedDevice.current?.txPowerLevel || "- - -"}
									</Text>
								</View>
							</View>
						</View>
					);
				}}
				options={[
					{
						label: "Kết nối",
						backgroundColor: COLORS.PRIMARY,
						onPress: () => {
							if (selectedDevice.current) handleConnect(selectedDevice.current);
						},
					},
					{
						label: "Hủy bỏ",
						backgroundColor: COLORS.GRAY,
						onPress: () => {
							setShowDetailModal(false);
						},
					},
				]}
				renderAction={(option) => (
					<Button
						label={option.label}
						key={option.label}
						style={{ marginVertical: 2, marginHorizontal: 8 }}
						backgroundColor={option.backgroundColor}
						onPress={option.onPress}
					></Button>
				)}
				visible={showDetailModal}
			></ActionSheet>

			<Incubator.Toast
				message={toast.message}
				visible={toast.show}
				preset={toast.variant}
				centerMessage
				swipeable
				position={"bottom"}
				backgroundColor={COLORS.WHITE}
				autoDismiss={2000}
				onDismiss={() =>
					setToast({ message: "", show: false, variant: "general" })
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	infoLine: {
		justifyContent: "space-between",
	},
});

export default Device;
