/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import localStorage, { LAST_DEVICE } from "./localStorage";
import * as ExpoDevice from "expo-device";
import { useEffect } from "react";

interface BluetoothLowEnergyApi {
	allDevices: Device[];
	requestPermissions(): Promise<boolean>;
	scanForPeripherals(): void;
	connectToDevice: (deviceId: Device) => Promise<void>;
	connectedDevice: Device | null;
}

function useBLE(): BluetoothLowEnergyApi {
	const bleManager = useMemo(() => new BleManager(), []);

	const [allDevices, setAllDevices] = useState<Device[]>([]);
	const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

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

	const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
		devices.findIndex((device) => nextDevice.id === device.id) > -1;

	const scanForPeripherals = async () => {
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
		try {
			const deviceConnection = await bleManager.connectToDevice(device.id);
			setConnectedDevice(deviceConnection);
			await deviceConnection.discoverAllServicesAndCharacteristics();
			bleManager.stopDeviceScan();

			// Save device to local storage
			localStorage.save({
				key: LAST_DEVICE,
				data: device.id,
			});
		} catch (e) {
			console.log("Lỗi khi kết nối đến thiết bị: ", e);
		}
	};

	// Get last connected device
	useEffect(() => {
		async function tryGetLastDevice() {
      try {
        const localData = await localStorage.load({ key: LAST_DEVICE });

        if (localData) {
          const id = localData;
          console.log("LOCALID: " + id);
          const deviceConnection = await bleManager.connectToDevice(id);
          setConnectedDevice(deviceConnection);
          await deviceConnection.discoverAllServicesAndCharacteristics();
        }
      } catch (e) {
        console.log(e);
      }

		}

		tryGetLastDevice();
	}, []);

	return {
		scanForPeripherals,
		requestPermissions,
		allDevices,
		connectToDevice,
		connectedDevice,
	};
}

export default useBLE;
