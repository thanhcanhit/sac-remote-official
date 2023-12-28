import React, { createContext, useEffect } from "react";
import useBLE, { BluetoothLowEnergyApi } from "../bluetooth/useBLE";
import useBluetoothState, {
	useBluetoothStateAPI,
} from "../bluetooth/useBluetoothState";

type BluetoothContextProps = {
	useBLE: BluetoothLowEnergyApi;
	useBluetoothState: useBluetoothStateAPI;
};

export const BluetoothContext = createContext<BluetoothContextProps>(
	{} as BluetoothContextProps
);

const BluetoothContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const contextValue = {
		useBLE: useBLE(),
		useBluetoothState: useBluetoothState(),
	};

	useEffect(() => {
		const requestTurnOnBluetooth = async () => {
			if (
				(await contextValue.useBluetoothState.getBluetoothState()) !==
				"PoweredOn"
			) {
				await contextValue.useBluetoothState.requestToEnable();
			}
		};

		const getPermission = async () => {
			const isGrandted: boolean =
				await contextValue.useBLE.requestPermissions();
			if (isGrandted) {
				requestTurnOnBluetooth();
			}
		};

		getPermission();
	}, []);
	return (
		<BluetoothContext.Provider value={contextValue}>
			{children}
		</BluetoothContext.Provider>
	);
};

export default BluetoothContextProvider;
