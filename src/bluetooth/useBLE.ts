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

	// State
	const lastDevice = useRef<Device | null>(null);
	const [allDevices, setAllDevices] = useState<Device[]>([]);
	const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

	const requestAndroid31Permissions = async () => {
		const bluetoothScanPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
		);
		const bluetoothConnectPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
		);
		const fineLocationPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
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
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
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

	const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
		devices.findIndex((device) => nextDevice.id === device.id) > -1;

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

	const connectToDevice = async (device: Device) => {
		const deviceConnection = await bleManager.connectToDevice(device.id);
		if (deviceConnection) {
			setConnectedDevice(deviceConnection);
			lastDevice.current = deviceConnection;

			await deviceConnection.discoverAllServicesAndCharacteristics();
			bleManager.stopDeviceScan();

			// Save device to local storage
			localStorage.save({
				key: STORAGE_KEY,
				data: device,
			});
		}
	};

	const disconnectFromCurrentDevice = async () => {
		if (connectedDevice) {
			await bleManager.cancelDeviceConnection(connectedDevice?.id);
			setConnectedDevice(null);
		}
	};

	// initial
	useEffect(() => {

		// handle state change
		bleManager.onDeviceDisconnected(connectedDevice?.id || "", () => {
			console.log("disconnect " + connectedDevice?.id);
			setConnectedDevice(null);
		});

		// get last device in local storage
		async function tryGetLastDevice() {
			try {
				const localData = await localStorage.load({ key: STORAGE_KEY });

				if (localData) {
					const savedDevice: Device = localData;
					lastDevice.current = savedDevice;
					await connectToDevice(savedDevice);
				}
			} catch (e) {
				console.log("Lỗi khi sử dụng dữ liệu đã lưu: " + e);
			}
		}

		if (!connectedDevice) tryGetLastDevice();
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
