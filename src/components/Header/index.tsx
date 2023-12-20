import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, TouchableOpacity, View } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GRAY } from "../../utils/color";

const Header = () => {
	const navigation = useNavigation();
	return (
		<View
			width={60}
		>
			<Button
				onPress={() => {
					navigation.dispatch(DrawerActions.openDrawer());
				}}
				backgroundColor="transparent"
				round
				marginT-2
				marginL-4
			>
				<Icon name="dots-hexagon" size={30} color={GRAY} />
			</Button>
		</View>
	);
};

export default Header;
