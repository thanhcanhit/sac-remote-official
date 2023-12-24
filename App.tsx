import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainLayout from "./src/layouts/MainLayout";
import { Fragment, createContext } from "react";
import { ThemeManager } from "react-native-ui-lib";
import { COLORS } from "./src/utils/color";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import Home from "./src/pages/Home";
import Device from "./src/pages/Device";
import Remote from "./src/pages/Remote";
import BluetoothContextProvider from "./src/contexts/BluetoothContextProvider";

ThemeManager.setComponentTheme("Text", {
	color: COLORS.TEXT_BLACK,
});

export type RootDrawerParamList = {
	Home: undefined;
	Device: undefined;
	Remote: undefined;
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

const RemotePage = () => (
	<MainLayout>
		<Remote />
	</MainLayout>
);
const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
	return (
		<BluetoothContextProvider>
			<NavigationContainer>
				<Drawer.Navigator
					initialRouteName="Home"
					screenOptions={{ header: () => <Fragment /> }}
				>
					<Drawer.Screen
						name="Home"
						component={HomePage}
						options={{
							title: "Trang chủ",
							drawerIcon: ({ color, size }) => (
								<FeatherIcon size={size} color={color} name="home" />
							),
						}}
					/>
					<Drawer.Screen
						name="Remote"
						component={RemotePage}
						options={{
							title: "Bảng điểu khiển",
							drawerIcon: ({ color, size }) => (
								<MaterialCommunityIcon
									size={size}
									color={color}
									name="remote"
								/>
							),
						}}
					/>
					<Drawer.Screen
						name="Device"
						component={DevicePage}
						options={{
							title: "Quản lí thiết bị",
							drawerIcon: ({ color, size }) => (
								<FeatherIcon size={size} color={color} name="bluetooth" />
							),
						}}
					/>
				</Drawer.Navigator>
			</NavigationContainer>
		</BluetoothContextProvider>
	);
}
