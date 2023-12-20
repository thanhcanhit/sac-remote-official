import React from "react";
import { Button, View } from "react-native-ui-lib";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import Header from "../components/Header";

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<>
			<StatusBar />
			<View useSafeArea style={styles.container}>
				<Header />
				{children}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, marginTop: 32, position: "relative" },
});

export default MainLayout;
