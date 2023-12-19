import React, { Component } from "react";
import { Alert } from "react-native";
import {
	View,
	TextField,
	Text,
	Button,
	TouchableOpacity,
	PageControl,
	TabController,
} from "react-native-ui-lib";

export default class Example extends Component {
	render() {
		return (
			<View flex paddingH-25 paddingT-120>
				<TouchableOpacity
					onPress={() => {
						Alert.alert("Welcome", "Chào mừng bạn đã đến");
					}}
				>
					<Text h1 text20 blue50>
						Welcome
					</Text>
				</TouchableOpacity>
				<TextField text50 placeholder="username" grey10 b />
				<TextField text50 placeholder="password" secureTextEntry grey10 />
				<View marginT-100 bottom>
					<Button text70 white background-orange30 label="Login" />
					<Button link text70 orange30 label="Sign Up" marginT-20 />
				</View>
				<PageControl currentPage={0} numOfPages={5} />
				
			</View>
		);
	}
}
