import React from "react";
import { ScrollBar, View } from "react-native-ui-lib";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import StatusProgress from "./StatusProgress";
import ServiceButton from "./ServiceButton";
import { InfoCharacterisctic } from ".";

const serviceList: {
	id: InfoCharacterisctic;
	label: string;
	icon: React.ReactElement;
}[] = [
	{
		id: "temperature",
		label: "Thermal",
		icon: <MaterialCommunityIcon name="temperature-celsius" size={30} />,
	},
	{
		id: "humidity",
		label: "Humidity",
		icon: <MaterialCommunityIcon name="water-outline" size={30} />,
	},
	{
		id: "battery",
		label: "Battery",
		icon: <MaterialCommunityIcon name="battery-outline" size={30} />,
	},
];

type StatusPaneProps = {
	currentActive: InfoCharacterisctic;
	changeCurrentActive: (serviceId: InfoCharacterisctic) => void;
	temperature: number;
	humidity: number;
	battery: number;
};

const StatusPane = ({
	currentActive,
	changeCurrentActive,
	temperature,
	humidity,
	battery,
}: StatusPaneProps) => {
	const activeStatus = (() => {
		switch (currentActive) {
			case "temperature":
				return <StatusProgress state={temperature} />;
			case "humidity":
				return <StatusProgress state={humidity} />;
			case "battery":
				return <StatusProgress state={battery} />;
		}
	})();

	return (
		<View>
			<ScrollBar gradientMargins={8}>
				<View
					row
					padding-8
					gap-8
					style={{ marginLeft: -6, zIndex: 9 }}
				>
					{serviceList.map((service) => (
						<ServiceButton
							key={service.id}
							id={service.id}
							name={service.label}
							isActive={service.id === currentActive}
							icon={service.icon}
							value={service.id == "battery" ? battery : 0}
							onPress={() => {
								changeCurrentActive(service.id);
							}}
						/>
					))}
				</View>
			</ScrollBar>
			<View>{activeStatus}</View>
		</View>
	);
};
export default React.memo(StatusPane);
