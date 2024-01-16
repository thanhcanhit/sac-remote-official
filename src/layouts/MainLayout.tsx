import React from "react";
import { View } from "react-native-ui-lib";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import Header from "../components/Header";

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<View style={{ backgroundColor: "#e3ecf4", flex: 1 }}>
			<StatusBar />
			<View useSafeArea style={styles.container}>
				<Header />
				<View style={styles.contentContainer}>{children}</View>
			</View>
		</View>
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
