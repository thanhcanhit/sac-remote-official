/* eslint-disable no-bitwise */
import { useMemo, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import localStorage, { STORAGE_KEY } from "../storage/localStorage";
import * as ExpoDevice from "expo-device";
import { useEffect } from "react";

export interface BluetoothLowEnergyApi {
	allDevices: Device[];
	requestPermissions(): Promise<boolean>;
	scanForPeripherals(): void;
	disconnectFromCurrentDevice: () => void;
	connectToDevice: (deviceId: Device) => Promise<void>;
	lastDevice: Device | null;
	connectedDevice: Device | null;
}

function useBLE(): BluetoothLowEnergyApi {
	const bleManager = useMemo(() => new BleManager(), []);
	const lastDevice = useRef<Device | null>(null);

	// Danh sách thiết bị đang quét
	const [allDevices, setAllDevices] = useState<Device[]>([]);
	// Thiết bị hiện đang kết nối
	const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

	// Yêu cầu quyền sử dụng bluetooth
	const requestAndroid31Permissions = async () => {
		const bluetoothScanPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
			{
				title: "Bluetooth Scan Permission",
				message: "Ứng dụng này cần quét các thiết bị bluetooth xung quanh bạn",
				buttonPositive: "Đồng ý",
				buttonNegative: "Từ chối",
			}
		);
		const bluetoothConnectPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
			{
				title: "Bluetooth Connect Permission",
				message: "Ứng dụng này cần kết nối đến thiết bị bluetooth của bạn",
				buttonPositive: "Đồng ý",
				buttonNegative: "Từ chối",
			}
		);
		const fineLocationPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: "Location Permission",
				message: "Ứng dụng cần quyền truy cập fine location",
				buttonPositive: "Đồng ý",
				buttonNegative: "Từ chối",
			}
		);

		return (
			bluetoothScanPermission === "granted" &&
			bluetoothConnectPermission === "granted" &&
			fineLocationPermission === "granted"
		);
	};

	const requestPermissions = async () => {
		if (Platform.OS === "android") {
			if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
				const permissionStatus = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: "Location Permission",
						message: "Ứng dụng cần quyền truy cập fine location",
						buttonPositive: "Đồng ý",
						buttonNegative: "Từ chối",
					}
				);

				return permissionStatus == "granted";
			} else {
				const isAndroid31PermissionGranted =
					await requestAndroid31Permissions();
				return isAndroid31PermissionGranted;
			}
		}

		return true;
	};

	// Kiểm tra xem thiết bị đã từng quét hay chưa tránh trùng
	const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
		devices.findIndex((device) => nextDevice.id === device.id) > -1;

	// Quét các thiết bị ngoại vi
	const scanForPeripherals = async () => {
		setAllDevices([]);
		bleManager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				console.log(error);
			}

			if (device) {
				setAllDevices((prevState) => {
					if (!isDuplicateDevice(prevState, device)) {
						return [...prevState, device];
					}

					return prevState;
				});
			}
		});
	};

	// Kết nối đến thiết bị
	const connectToDevice = async (device: Device) => {
		try {
			const deviceConnection = await bleManager.connectToDevice(device.id);
			if (deviceConnection) {
				setConnectedDevice(deviceConnection);

				await deviceConnection.discoverAllServicesAndCharacteristics();
				bleManager.stopDeviceScan();

				// Save device to local storage
				localStorage.save({
					key: STORAGE_KEY,
					data: device,
				});
			}
		} catch (e) {
			console.log("Lỗi khi kết nối đến thiết bị: ", e);
		}
	};

	const disconnectFromCurrentDevice = async () => {
		if (connectedDevice) {
			await bleManager.cancelDeviceConnection(connectedDevice?.id);
			setConnectedDevice(null);
		}
	};

	// Get last connected device
	useEffect(() => {
		async function tryGetLastDevice() {
			try {
				const localData = await localStorage.load({ key: STORAGE_KEY });

				if (localData) {
					const savedDevice: Device = localData;
					lastDevice.current = savedDevice;
					await bleManager.connectToDevice(savedDevice.id);
				}
			} catch (e) {
				console.log("Lỗi khi đọc dữ liệu cũ trước đó: " + e);
			}
		}

		if (!connectedDevice) tryGetLastDevice();
	}, []);

	// initial
	useEffect(() => {
		// handle state change
		bleManager.onDeviceDisconnected(connectedDevice?.id || "", () => {
			console.log("disconnect " + connectedDevice?.id);
			setConnectedDevice(null);
		});
	}, []);

	return {
		scanForPeripherals,
		requestPermissions,
		disconnectFromCurrentDevice,
		allDevices,
		connectToDevice,
		connectedDevice,
		lastDevice: lastDevice?.current,
	};
}

export default useBLE;
