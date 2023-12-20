import React from "react";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import {
	Button,
	GridList,
	Text,
	TouchableOpacity,
	View,
} from "react-native-ui-lib";
import { RootDrawerParamList } from "../../../App";
import LinearGradientView from "../../components/LinearGradientView";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, ICON_COLORS } from "./../../utils/color";

const RemoteIcon = (
	<MaterialCommunityIcon name="remote" size={40} color={COLORS.WHITE} />
);

type homeScreenProp = DrawerNavigationProp<RootDrawerParamList, "Home">;

const Home = () => {
	const navigation = useNavigation<homeScreenProp>();

	const moveToRemotePage = () => {
		navigation.navigate("Remote");
	};

	return (
		<View flex marginT-16>
			<View marginB-24>
				<Text text40>Xin chào, Thanh Cảnh</Text>
				<Text text70T color={COLORS.SECONDARY}>
					SAC chúc bạn một ngày mới tốt lành ❤️
				</Text>
			</View>
			<TouchableOpacity onPress={moveToRemotePage}>
				<LinearGradientView
					marginB-24
					br40
					height={150}
					row
					style={{ overflow: "hidden" }}
				>
					<View flex-1 center>
						{RemoteIcon}
					</View>
					<View width={1} marginV-16 backgroundColor={COLORS.WHITE}></View>
					<View flex-2 center>
						<Text text60T color={COLORS.WHITE}>
							Bảng điều khiển
						</Text>
						<Text text40B color={COLORS.WHITE}>
							SAC Device
						</Text>
					</View>
				</LinearGradientView>
			</TouchableOpacity>
			<View>
				<Text text80 color={COLORS.SECONDARY}>
					Các tính năng khác đang phát triển...
				</Text>
			</View>
		</View>
	);
};

export default Home;
