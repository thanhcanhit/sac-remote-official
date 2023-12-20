import React from "react";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Button, Text, View } from "react-native-ui-lib";
import { RootDrawerParamList } from "../../App";

type homeScreenProp = DrawerNavigationProp<RootDrawerParamList, "Home">;

const Home = () => {
	const navigation = useNavigation<homeScreenProp>();
	return (
		<View flex>
			<Text>Home</Text>
			<Button
				onPress={() => navigation.navigate("Device")}
				label="Go to device"
			/>
		</View>
	);
};

export default Home;
