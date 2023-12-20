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
				<View style={styles.contentContainer}>{children}</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, marginTop: 32, position: "relative" },
	contentContainer: {
		flex: 1,
		padding: 16,
	},
});

export default MainLayout;
