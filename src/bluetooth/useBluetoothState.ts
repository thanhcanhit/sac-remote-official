import { useEffect, useState } from "react";
import BluetoothStateManager, {
	BluetoothState,
} from "react-native-bluetooth-state-manager";

type useBluetoothStateAPI = {
	state: BluetoothState;
	requestToEnable: () => Promise<Boolean>;
	turnOffBluetooth: () => void;
	turnOnBluetooth: () => void;
};

const useBluetoothState = (): useBluetoothStateAPI => {
	const [state, setState] = useState<BluetoothState>("Unknown");

	useEffect(() => {
		async function getDeviceBluetoothState() {
			const state = await BluetoothStateManager.getState();
			setState(state);
		}

		getDeviceBluetoothState();
	}, []);

	const requestToEnable = async (): Promise<Boolean> => {
		return BluetoothStateManager.requestToEnable();
	};

	const turnOnBluetooth = async () => {
		BluetoothStateManager.enable();
	};

	const turnOffBluetooth = async () => {
		BluetoothStateManager.disable();
	};

	return { state, requestToEnable, turnOffBluetooth, turnOnBluetooth };
};

export default useBluetoothState;
