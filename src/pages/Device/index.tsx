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
import { BluetoothContext } from "../../components/context/BluetoothContextProvider";

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

	const [isTurnOnBluetooth, setIsTurnOnBluetooth] = useState<boolean>(false);
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
			await connectToDevice(id);
			showToast("Đã kết nối với " + id.name, "success");
		} catch (e) {
			showToast("Không thể kết nối: " + e, "failure");
		}
	};

	const handleDisconnect = () => {
		disconnectFromCurrentDevice();
		showToast("Đã ngắt kết nối thiết bị", "general");
	};

	const showToast = (message: string, variant?: ToastVariant) => {
		setToast({ message, show: true, variant: variant ? variant : "general" });
	};

	// Initial
	useEffect(() => {
		const initial = async () => {
			let isTurnOn: Boolean = (await getBluetoothState()) == "PoweredOn";
			while (!isTurnOn) {
				try {
					isTurnOn = await requestToEnable();
					setIsTurnOnBluetooth(isTurnOn.valueOf());
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
				<View flex-1>
					<View>
						<Text text60 marginB-8>
							Thiết bị đã kết nối trước đó
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
									bạn nhé
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
