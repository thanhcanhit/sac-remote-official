import { useEffect } from "react";
import BluetoothStateManager, {
	BluetoothState,
} from "react-native-bluetooth-state-manager";

export interface useBluetoothStateAPI {
	getBluetoothState: () => Promise<BluetoothState>;
	requestToEnable: () => Promise<Boolean>;
	turnOffBluetooth: () => void;
	turnOnBluetooth: () => void;
}

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

	useEffect(() => {
		// Add listener
		BluetoothStateManager.onStateChange(async (state) => {
			let isTurnOff: Boolean | boolean = state === "PoweredOff";
			if (isTurnOff) {
				while (isTurnOff) {
					isTurnOff = await requestToEnable();
				}
			}
		}, true);

		const checkBluetoothState = async () => {
			if ((await getBluetoothState()) !== "PoweredOn") {
				await requestToEnable();
			}
		};
		checkBluetoothState();
	}, []);

	return {
		getBluetoothState,
		requestToEnable,
		turnOffBluetooth,
		turnOnBluetooth,
	};
};

export default useBluetoothState;
