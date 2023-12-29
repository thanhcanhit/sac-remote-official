import React from "react";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Button, View } from "react-native-ui-lib";
import { ICON_COLORS } from "../../utils/color";
import { RootDrawerParamList } from "../../../App";
import ConnectStatus from "../ConnectStatus";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";

const MenuIcon = () => (
	<SimpleLineIcon name="menu" size={25} color={ICON_COLORS.DEFAULT} />
);
type homeScreenProp = DrawerNavigationProp<RootDrawerParamList>;

const Header = () => {
	const navigation = useNavigation<homeScreenProp>();
	return (
		<View height={50} row center>
			<View flex left>
				<Button
					onPress={() => {
						navigation.dispatch(DrawerActions.openDrawer());
					}}
					backgroundColor="transparent"
					marginL-0
					paddingL-0
				>
					<MenuIcon />
				</Button>
			</View>
			<View flex right>
				<ConnectStatus />
			</View>
		</View>
	);
};

export default Header;
