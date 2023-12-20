import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import Home from "./src/pages/Home";
import Device from "./src/pages/Device";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainLayout from "./src/Layout/MainLayout";
import { Fragment } from "react";

export type RootDrawerParamList = {
	Home: undefined;
	Device: undefined;
};

const HomePage = () => (
	<MainLayout>
		<Home />
	</MainLayout>
);

const DevicePage = () => (
	<MainLayout>
		<Device />
	</MainLayout>
);

const Drawer = createDrawerNavigator<RootDrawerParamList>();
export default function App() {
	return (
		<NavigationContainer>
			<Drawer.Navigator
				initialRouteName="Home"
				screenOptions={{ header: () => <Fragment /> }}
			>
				<Drawer.Screen name="Home" component={HomePage} />
				<Drawer.Screen name="Device" component={DevicePage} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}
