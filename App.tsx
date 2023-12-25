import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainLayout from "./src/layouts/MainLayout";
import {
	Fragment,
	createContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { LoaderScreen, ThemeManager } from "react-native-ui-lib";
import { COLORS } from "./src/utils/color";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import Home from "./src/pages/Home";
import Device from "./src/pages/Device";
import Remote from "./src/pages/Remote";
import BluetoothContextProvider from "./src/contexts/BluetoothContextProvider";
import Welcome from "./src/pages/Welcome";
import storage, { USER_INFO_KEY } from "./src/storage/storage";

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
	const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<boolean | null>(
		null
	);

	useLayoutEffect(() => {
		const getUserInfo = async () => {
			try {
				const name = await storage.load({ key: USER_INFO_KEY });
				if (name) {
					setIsFirstTimeLogin(false);
				}
			} catch (e) {
				setIsFirstTimeLogin(true);
			}
		};

		getUserInfo();
	}, []);

	return (
		<BluetoothContextProvider>
			{isFirstTimeLogin === null ? (
				<LoaderScreen color={COLORS.PRIMARY} />
			) : isFirstTimeLogin ? (
				<Welcome onFinish={() => setIsFirstTimeLogin(false)} />
			) : (
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
			)}
		</BluetoothContextProvider>
	);
}
