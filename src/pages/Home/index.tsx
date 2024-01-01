import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { RootDrawerParamList } from "../../../App";
import LinearGradientView from "../../components/LinearGradientView";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "./../../utils/color";
import { BOX_SHADOW } from "../../utils/styles";
import storage, { USER_INFO_KEY } from "../../storage/storage";
import ProductCarousel from "./ProductCarousel";

const RemoteIcon = (
	<MaterialCommunityIcon name="remote" size={40} color={COLORS.WHITE} />
);

type homeScreenProp = DrawerNavigationProp<RootDrawerParamList, "Home">;

const Home = () => {
	const navigation = useNavigation<homeScreenProp>();
	const [userName, setUserName] = useState<string>("Người dùng");

	const moveToRemotePage = () => {
		navigation.navigate("Remote");
	};

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const name = await storage.load({ key: USER_INFO_KEY });
				if (name) {
					setUserName(name);
				}
			} catch (e) {
				navigation.navigate("Welcome");
			}
		};

		getUserInfo();
	}, []);

	return (
		<View flex marginT-16>
			<View marginB-24>
				<Text text50>Welcome back, {userName}</Text>
				<Text text70T color={COLORS.SECONDARY}>
					SAC Hope your journey is no longer hot ❤️
				</Text>
			</View>
			<TouchableOpacity
				marginB-8
				br40
				style={[{ height: 150, overflow: "hidden" }, BOX_SHADOW.NORMAL]}
				onPress={moveToRemotePage}
			>
				<LinearGradientView height={150} row>
					<View flex-1 center>
						{RemoteIcon}
					</View>
					<View width={1} marginV-16 backgroundColor={COLORS.WHITE}></View>
					<View flex-2 center>
						<Text text60T color={COLORS.WHITE}>
							Remote Panel
						</Text>
						<Text text40B color={COLORS.WHITE}>
							SAC Device
						</Text>
					</View>
				</LinearGradientView>
			</TouchableOpacity>
			<ProductCarousel />
			<View>
				<Text text80 color={COLORS.SECONDARY}>
				More features in development...
				</Text>
			</View>
		</View>
	);
};

export default Home;
