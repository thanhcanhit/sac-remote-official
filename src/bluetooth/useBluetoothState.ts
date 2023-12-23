import { useEffect, useState } from "react";
import BluetoothStateManager, {
	BluetoothState,
} from "react-native-bluetooth-state-manager";

type useBluetoothStateAPI = {
	getBluetoothState: () => Promise<BluetoothState>;
	requestToEnable: () => Promise<Boolean>;
	turnOffBluetooth: () => void;
	turnOnBluetooth: () => void;
};

const useBluetoothState = (): useBluetoothStateAPI => {
	const getBluetoothState: () => Promise<BluetoothState> = () => {
		return BluetoothStateManager.getState();
	};

	const requestToEnable = async (): Promise<Boolean> => {
		return BluetoothStateManager.requestToEnable();
	};

	const turnOnBluetooth = async () => {
		BluetoothStateManager.enable();
	};

	const turnOffBluetooth = async () => {
		BluetoothStateManager.disable();
	};

	return {
		getBluetoothState,
		requestToEnable,
		turnOffBluetooth,
		turnOnBluetooth,
	};
};

export default useBluetoothState;
