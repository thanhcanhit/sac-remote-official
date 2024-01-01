import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Fragment } from "react";
import { ThemeManager } from "react-native-ui-lib";
import { COLORS } from "./src/utils/color";
import MainLayout from "./src/layouts/MainLayout";
import Home from "./src/pages/Home";
import Device from "./src/pages/Device";
import Remote from "./src/pages/Remote";
import Welcome from "./src/pages/Welcome";
import BluetoothContextProvider from "./src/contexts/BluetoothContextProvider";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import About from "./src/pages/About";

ThemeManager.setComponentTheme("Text", {
	color: COLORS.TEXT_BLACK,
});

export type RootDrawerParamList = {
	Welcome: undefined;
	Home: undefined;
	Device: undefined;
	Remote: undefined;
	About: undefined;
};

const WelcomePage = () => <Welcome />;

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

const AboutPage = () => (
	<MainLayout>
		<About />
	</MainLayout>
);

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
	return (
		<NavigationContainer>
			<BluetoothContextProvider>
				<Drawer.Navigator
					initialRouteName={"Home"}
					backBehavior="none"
					defaultStatus="closed"
					screenOptions={{ header: () => <Fragment /> }}
				>
					<Drawer.Screen
						name="Welcome"
						component={WelcomePage}
						options={{
							title: undefined,
							drawerItemStyle: { height: 0 },
							unmountOnBlur: true,
						}}
					/>
					<Drawer.Screen
						name="Home"
						component={HomePage}
						options={{
							title: "Home Page",
							drawerIcon: ({ color, size }) => (
								<FeatherIcon size={size} color={color} name="home" />
							),
							unmountOnBlur: true,
						}}
					/>
					<Drawer.Screen
						name="Remote"
						component={RemotePage}
						options={{
							title: "Remote Panel",
							drawerIcon: ({ color, size }) => (
								<MaterialCommunityIcon
									size={size}
									color={color}
									name="remote"
								/>
							),
							unmountOnBlur: true,
						}}
					/>
					<Drawer.Screen
						name="Device"
						component={DevicePage}
						options={{
							title: "Device Management",
							drawerIcon: ({ color, size }) => (
								<FeatherIcon size={size} color={color} name="bluetooth" />
							),
							unmountOnBlur: true,
						}}
					/>
					<Drawer.Screen
						name="About"
						component={AboutPage}
						options={{
							title: "About us",
							drawerIcon: ({ color, size }) => (
								<MaterialCommunityIcon
									size={size}
									color={color}
									name="shark-fin"
								/>
							),
							freezeOnBlur: true,
						}}
					/>
				</Drawer.Navigator>
			</BluetoothContextProvider>
		</NavigationContainer>
	);
}
