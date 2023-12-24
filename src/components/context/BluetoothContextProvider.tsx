import React, { createContext } from "react";
import useBLE, { BluetoothLowEnergyApi } from "../../bluetooth/useBLE";
import useBluetoothState, {
	useBluetoothStateAPI,
} from "../../bluetooth/useBluetoothState";

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
	return (
		<BluetoothContext.Provider value={contextValue}>
			{children}
		</BluetoothContext.Provider>
	);
};

export default BluetoothContextProvider;
