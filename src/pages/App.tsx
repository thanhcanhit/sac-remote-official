import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	TabController,
	Text,
	TouchableOpacity,
	View,
} from "react-native-ui-lib";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import Example from "./../../Example";
import useBLE from "./../bluetooth/useBLE";
import useBluetoothState from "./../bluetooth/useBluetoothState";
import DeviceModal from "../../DeviceModal";

export default function App() {
	// Trạng thái bluetooth và gửi yêu cầu tới người dùng
	const { requestToEnable } = useBluetoothState();
	// Yêu cầu cấp quyền và đọc các thông tin thiết bị
	const {
		requestPermissions,
		scanForPeripherals,
		allDevices,
		connectToDevice,
		connectedDevice,
		// heartRate,
		// disconnectFromDevice,
	} = useBLE();

	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [temp, setTemp] = useState<any>();

	const scanForDevices = async () => {
		const isPermissionsEnabled = await requestPermissions();
		if (isPermissionsEnabled) {
			scanForPeripherals();
		}
	};

	const hideModal = () => {
		setIsModalVisible(false);
	};

	const openModal = async () => {
		scanForDevices();
		setIsModalVisible(true);
	};

	const discoverCharacteristics = async () => {
		if (connectedDevice != null) {
			try {
				const services = await connectedDevice.services();
				const promises = services.map(async (item, index) => {
					const characs = await item.characteristics();
					return (
						<View
							key={index}
							style={{
								borderBottomWidth: 2,
								paddingLeft: 4,
								borderColor: "#4CAF50",
							}}
						>
							<Text>⭐Service Number {index + 1}</Text>
							<Text>ID: {item.id}</Text>
							<Text>UUID: {item.uuid}</Text>
							{characs.map((subItem, index2) => (
								<View
									key={index2}
									style={{ marginLeft: 20, borderLeftWidth: 1, paddingLeft: 8 }}
								>
									<Text>🎯Characteristics number {index2 + 1}</Text>
									<Text>UUID: {subItem.uuid}</Text>
								</View>
							))}
						</View>
					);
				});

				const p = await Promise.all(promises);
				setTemp(p);
			} catch (e) {
				console.log(e);
			}
		}
	};

	// Kiểm tra trạng thái bluetooth và yêu cầu bật
	useEffect(() => {
		async function requestTurnOnBluetooth() {
			let isTurnOn: Boolean = false;
			while (!isTurnOn) {
				try {
					isTurnOn = await requestToEnable();
				} catch {}
			}
		}

		// if (state !== "PoweredOn") {
		// 	requestTurnOnBluetooth();
		// }
	}, []);

	useEffect(() => {
		discoverCharacteristics();
	}, [connectedDevice]);

	useEffect(() => {
		return () => {
			connectedDevice?.cancelConnection();
		};
	}, []);
	return (
		<View useSafeArea style={styles.container}>
			<GestureHandlerRootView>
				<View style={styles.heartRateTitleWrapper}>
					{connectedDevice ? (
						<>
							{/* <PulseIndicator /> */}
							<Text style={styles.heartRateTitleText}>
								{connectedDevice.name || connectedDevice.id}
							</Text>
							{/* <Text style={styles.heartRateText}>{heartRate} bpm</Text> */}

							<TouchableOpacity
								onPress={() => {
									discoverCharacteristics();
								}}
							>
								<Text>Tìm kiếm services & charactericstic</Text>
							</TouchableOpacity>
							<ScrollView>{temp}</ScrollView>
						</>
					) : (
						<Text style={styles.heartRateTitleText}>
							Hãy kết nối đến thiết bị bluetooth
						</Text>
					)}
				</View>
				<TouchableOpacity onPress={openModal} style={styles.ctaButton}>
					<Text style={styles.ctaButtonText}>{"Connect"}</Text>
				</TouchableOpacity>
				<DeviceModal
					closeModal={hideModal}
					visible={isModalVisible}
					connectToPeripheral={connectToDevice}
					devices={allDevices}
				/>
			</GestureHandlerRootView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 16,
	},
	heartRateTitleWrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	heartRateTitleText: {
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
		marginHorizontal: 20,
		color: "black",
	},
	heartRateText: {
		fontSize: 25,
		marginTop: 15,
	},
	ctaButton: {
		backgroundColor: "#FF6060",
		justifyContent: "center",
		alignItems: "center",
		height: 50,
		marginHorizontal: 20,
		marginBottom: 5,
		borderRadius: 8,
	},
	ctaButtonText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
	},
});
