import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, TouchableOpacity, View } from "react-native-ui-lib";
import { COLORS, ICON_COLORS } from "../../utils/color";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const MenuIcon = () => (
	<SimpleLineIcon name="menu" size={25} color={ICON_COLORS.DEFAULT} />
);
const BluetoothConnectedIcon = () => (
	<MaterialIcon name="bluetooth-connected" size={20} color={COLORS.WHITE} />
);
const BluetoothDisconnectIcon = () => (
	<MaterialIcon name="bluetooth-disabled" size={20} color={COLORS.WHITE} />
);

const Header = () => {
	const navigation = useNavigation();
	return (
		<View height={50} row>
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
			<View flex right marginT-4>
				<Button
					backgroundColor={COLORS.PRIMARY}
					marginR-16
					size="small"
					round
					color={COLORS.WHITE}
				>
					<BluetoothConnectedIcon />
				</Button>
				{/* <Button
					backgroundColor={COLORS.GRAY}
					round
					marginR-16
					size="small"
					color={COLORS.WHITE}
				>
					<BluetoothDisconnectIcon />
				</Button> */}
			</View>
		</View>
	);
};

export default Header;
