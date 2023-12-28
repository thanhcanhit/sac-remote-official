/* eslint-disable no-bitwise */
import { useMemo, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import localStorage, { LAST_ITEM_KEY } from "../storage/storage";
import * as ExpoDevice from "expo-device";
import { useEffect } from "react";
import base64 from "react-native-base64";

// UUID
const SAC_BLE_SERVICES_UUID = {
	infoService: {
		uuid: "e349da5e-d7a6-4211-a84d-9d7fa5142bae",
		characteristics: {
			power: "f389240b-df74-437f-9caa-9adc0b31af78",
			temperature: "bb52c8e8-99bb-44dc-ac5a-1c9e84a350ea",
			humidity: "2b9cd114-b8c1-473f-a483-470125415fb6",
			battery: "85d1a355-7936-468c-99e8-0bb9a2893e89",
		},
	},
	settingService: {
		uuid: "d5d3af8d-bfd6-4d95-ba9f-890dd4f426fc",
		characteristics: {
			settingTemperature: "780c3b1e-38a4-47a1-9c2b-9763aa7509c3",
			settingHumidity: "ca4391b1-a5b1-4b6d-8dcd-055d078fd5fd",
			control: "7c34e5a7-99b8-4a11-80ea-68f74a7fefc9",
		},
	},
};

export interface BluetoothLowEnergyApi {
	allDevices: Device[];
	requestPermissions(): Promise<boolean>;
	scanForPeripherals(): void;
	disconnectFromCurrentDevice: () => void;
	connectToDevice: (deviceId: Device) => Promise<boolean>;
	lastDevice: Device | null;
	connectedDevice: Device | null;
	power: boolean;
	temperature: number;
	humidity: number;
	battery: number;
	settingHumi: number[];
	settingTemp: number[];
	setNewSettingHumi: (value: number[]) => void;
	setNewSettingTemp: (value: number[]) => void;
	setControl: (newValue: boolean) => void;
}

function useBLE(): BluetoothLowEnergyApi {
	const bleManager = useMemo(() => new BleManager(), []);

	// State
	const lastDevice = useRef<Device | null>(null);
	const [allDevices, setAllDevices] = useState<Device[]>([]);
	const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

	// Characteristics
	const [power, setPower] = useState<boolean>(false);
	const [temperature, setTemperature] = useState<number>(20);
	const [humidity, setHumidity] = useState<number>(50);
	const [battery, setBattery] = useState<number>(100);
	const [settingTemp, setSettingTemp] = useState<number[]>([0, 100]);
	const [settingHumi, setsettingHumi] = useState<number[]>([0, 100]);

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

	const connectToDevice = async (device: Device): Promise<boolean> => {
		const deviceConnection = await bleManager.connectToDevice(device.id);
		if (deviceConnection) {
			// Check is sac device
			const deviceServices = await deviceConnection.services();
			const hasInfoService =
				deviceServices.findIndex(
					(service) => service.uuid == SAC_BLE_SERVICES_UUID.infoService.uuid
				) != -1;
			const hasSettingService =
				deviceServices.findIndex(
					(service) => service.uuid == SAC_BLE_SERVICES_UUID.settingService.uuid
				) != -1;
			if (!hasInfoService || !hasSettingService) return false;

			setConnectedDevice(deviceConnection);
			lastDevice.current = deviceConnection;

			await deviceConnection.discoverAllServicesAndCharacteristics();
			bleManager.stopDeviceScan();

			// Save device to local storage
			localStorage.save({
				key: LAST_ITEM_KEY,
				data: device,
			});
			return true;
		}
		return false;
	};

	const disconnectFromCurrentDevice = async () => {
		if (connectedDevice) {
			await bleManager.cancelDeviceConnection(connectedDevice?.id);
			setConnectedDevice(null);
		}
	};

	const isConnected: () => boolean = () => {
		return connectedDevice !== null;
	};

	// *** Service & characteristic using ***
	const updatePower = async () => {
		if (isConnected()) {
			const characteristic =
				await connectedDevice?.readCharacteristicForService(
					SAC_BLE_SERVICES_UUID.infoService.uuid,
					SAC_BLE_SERVICES_UUID.infoService.characteristics.power
				);
			const value = Boolean(base64.decode(characteristic?.value || ""));
			setPower(value);
		}
	};

	const updateTemperature = async () => {
		if (isConnected()) {
			const characteristic =
				await connectedDevice?.readCharacteristicForService(
					SAC_BLE_SERVICES_UUID.infoService.uuid,
					SAC_BLE_SERVICES_UUID.infoService.characteristics.temperature
				);
			const value = Number(base64.decode(characteristic?.value || ""));
			setTemperature(value);
		}
	};

	const updateHumidity = async () => {
		if (isConnected()) {
			const characteristic =
				await connectedDevice?.readCharacteristicForService(
					SAC_BLE_SERVICES_UUID.infoService.uuid,
					SAC_BLE_SERVICES_UUID.infoService.characteristics.humidity
				);
			const value = Number(base64.decode(characteristic?.value || ""));
			setHumidity(value);
		}
	};

	const updateBattery = async () => {
		if (isConnected()) {
			const characteristic =
				await connectedDevice?.readCharacteristicForService(
					SAC_BLE_SERVICES_UUID.infoService.uuid,
					SAC_BLE_SERVICES_UUID.infoService.characteristics.battery
				);
			const value = Number(base64.decode(characteristic?.value || ""));
			setBattery(value);
		}
	};

	const updateSettingTemp = async () => {
		if (isConnected()) {
			const characteristic =
				await connectedDevice?.readCharacteristicForService(
					SAC_BLE_SERVICES_UUID.settingService.uuid,
					SAC_BLE_SERVICES_UUID.settingService.characteristics
						.settingTemperature
				);
			const value: any = Number(base64.decode(characteristic?.value || ""));
			setSettingTemp(value);
		}
	};

	const updateSettingHumi = async () => {
		if (isConnected()) {
			const characteristic =
				await connectedDevice?.readCharacteristicForService(
					SAC_BLE_SERVICES_UUID.settingService.uuid,
					SAC_BLE_SERVICES_UUID.settingService.characteristics.settingHumidity
				);
			const value: any = base64.decode(characteristic?.value || "");
			setsettingHumi(value);
		}
	};

	const setNewSettingTemp: (newValue: number[]) => void = async (newValue) => {
		if (isConnected()) {
			await connectedDevice?.writeCharacteristicWithoutResponseForService(
				SAC_BLE_SERVICES_UUID.settingService.uuid,
				SAC_BLE_SERVICES_UUID.settingService.characteristics.settingTemperature,
				base64.encode(JSON.stringify(newValue))
			);
			setSettingTemp(newValue);
		}
		return;
	};

	const setNewSettingHumi: (newValue: number[]) => void = async (newValue) => {
		if (isConnected()) {
			await connectedDevice?.writeCharacteristicWithoutResponseForService(
				SAC_BLE_SERVICES_UUID.settingService.uuid,
				SAC_BLE_SERVICES_UUID.settingService.characteristics.settingHumidity,
				base64.encode(JSON.stringify(newValue))
			);
			setsettingHumi(newValue);
		}
		return;
	};

	const setControl: (newValue: boolean) => void = async (newValue) => {
		if (isConnected()) {
			await connectedDevice?.writeCharacteristicWithoutResponseForService(
				SAC_BLE_SERVICES_UUID.settingService.uuid,
				SAC_BLE_SERVICES_UUID.settingService.characteristics.control,
				base64.encode(JSON.stringify(newValue))
			);

			setPower(newValue);
		}
		return;
	};

	// initial
	useEffect(() => {
		const request = async () => {
			await requestPermissions();
		};

		request();

		// handle state change
		bleManager.onDeviceDisconnected(connectedDevice?.id || "", () => {
			setConnectedDevice(null);
		});

		// get last device in local storage
		async function tryGetLastDevice() {
			try {
				const localData = await localStorage.load({ key: LAST_ITEM_KEY });

				if (localData) {
					const savedDevice: Device = localData;
					lastDevice.current = savedDevice;
					await connectToDevice(savedDevice);
				}
			} catch (e) {}
		}

		if (!connectedDevice) tryGetLastDevice();
	}, []);

	// Get first data & Set auto fetch characterictis data
	useEffect(() => {
		if (!connectedDevice) return;

		// Get data
		updateSettingHumi();
		updateSettingTemp();

		// Mỗi giây check 1 lần
		const time = 1000;
		const iv = setInterval(() => {
			updateHumidity();
			updateTemperature();
			updatePower();
		}, time);

		// Mỗi phút check 1 lần
		const timeBattery = 1000 * 60;
		const ivBattery = setInterval(() => {
			updateBattery();
		}, timeBattery);

		return () => {
			clearInterval(iv);
			clearInterval(ivBattery);
		};
	}, [connectedDevice]);

	return {
		scanForPeripherals,
		requestPermissions,
		disconnectFromCurrentDevice,
		allDevices,
		connectToDevice,
		connectedDevice,
		lastDevice: lastDevice?.current,
		power,
		temperature,
		humidity,
		battery,
		settingHumi,
		settingTemp,
		setNewSettingHumi,
		setNewSettingTemp,
		setControl,
	};
}

export default useBLE;
