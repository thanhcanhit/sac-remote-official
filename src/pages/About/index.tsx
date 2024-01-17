import React, { useEffect, useRef, useState } from "react";
import { Carousel, Image, Text, View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";
import Separator from "../../components/Separator";
import { Animated, Dimensions, ScrollView, StyleSheet } from "react-native";

const theSharksSource = require("../../assets/imgs/logo/thesharks.jpg");
const sacoSource = require("../../assets/imgs/logo/saco.jpg");
const iuhSource = require("../../assets/imgs/logo/iuh.jpg");

const imgSources = [
	require("../../assets/imgs/team/thu.jpg"),
	require("../../assets/imgs/team/thien.jpg"),
	require("../../assets/imgs/team/doan.jpg"),
	require("../../assets/imgs/team/canh.png"),
	require("../../assets/imgs/team/huyen.jpg"),
	require("../../assets/imgs/team/nguyen.jpg"),
	require("../../assets/imgs/team/thao.jpg"),
];

type MemberInformation = {
	name: string;
	major: string;
	interest: string;
	reasons: string;
};
const informations: MemberInformation[] = [
	{
		name: "Trần Thị Minh Thư",
		major: "English Language",
		interest:
			"Smart technology products serving the community and having the potential to serve the market",
		reasons:
			"Want to challenge oneself with a major competition and contribute to creating valuable products for society",
	},
	{
		name: "Lê Chí Thiện",
		major: "IoT and Applied Artificial Intelligence",
		interest:
			"Smart technology products serving the community and having the potential to serve the market",
		reasons:
			"Want to build products for the community's benefit, creating value for society",
	},
	{
		name: "Trần Xuân Đoan",
		major: "International Business",
		interest:
			"Smart technology products with the desire to serve the community and contribute to societal development",
		reasons:
			"Want to learn practical knowledge, research business fields to develop future enterprises",
	},
	{
		name: "Nguyễn Thanh Cảnh",
		major: "Software Engineering",
		interest: "Building software products, websites serving the community",
		reasons:
			"Help friends turn their ideas into products while learning and improving personal skills",
	},
	{
		name: "Nguyễn Minh Huyền",
		major: "E-commerce",
		interest:
			"Smart products, devices addressing human life needs and maintaining sustainable nature",
		reasons:
			"Want to learn and practice practical knowledge about product development in business, create products that protect people's health while working outdoors",
	},
	{
		name: "Lê Thị Bình Nguyên",
		major: "Marketing",
		interest: "Products serving human life and health",
		reasons:
			"Want to learn research and innovation experience to create community-serving products, gain hands-on experience to accumulate personal knowledge and experience",
	},
	{
		name: "Lê Thị Thu Thảo",
		major: "E-commerce",
		interest: "Technology products serving human life and health",
		reasons:
			"Want to experience projects to closely engage with reality and accumulate more knowledge and experience for the future",
	},
];

const windowWidth = Dimensions.get("window").width;

const autoPlayTime = 9000;

const About = () => {
	const [index, setIndex] = useState<number>(0);
	const countAnim = useRef(new Animated.Value(0)).current;

	const currentMember: MemberInformation = informations[index];

	const countDown = () => {
		countAnim.setValue(0);
		Animated.timing(countAnim, {
			toValue: 100,
			duration: autoPlayTime + 1000,
			useNativeDriver: true,
		}).start();
	};

	useEffect(() => {
		countDown();

		return () => {
			countAnim.resetAnimation();
		};
	}, [index]);

	const transValue = countAnim.interpolate({
		inputRange: [0, 100],
		outputRange: [0, -windowWidth],
	});

	function capitalize(input: string): string {
		return input.charAt(0).toUpperCase() + input.slice(1).toLocaleLowerCase();
	}

	return (
		<View>
			<View>
				<Text text50 center marginB-16 color={COLORS.PRIMARY}>
					The Sharks Team
				</Text>

				<Carousel
					autoplay
					autoplayInterval={autoPlayTime}
					onChangePage={(newIndex) => setIndex(newIndex)}
					centerContent
					containerStyle={{
						borderRadius: 8,
						overflow: "hidden",
					}}
				>
					{imgSources.map((source) => (
						<View key={source} width="100%" height={300} center>
							<Image
								source={source}
								height={300}
								style={{
									width: "60%",
									borderRadius: 8,
									maxHeight: 250,
									zIndex: 99,
								}}
							/>
						</View>
					))}
				</Carousel>
			</View>

			{/* Information */}
			<View>
				<View>
					<Text text70 center color={COLORS.SECONDARY}>
						{index + 1}/{imgSources.length}
					</Text>

					<Text text60 center marginT-8>
						{currentMember.name}
					</Text>

					<Separator />

					<ScrollView style={{ paddingHorizontal: 24, height:200 }}>
						<Text text80 color={COLORS.SECONDARY}>
							Specialized: <Text>{capitalize(currentMember.major)}</Text>
						</Text>
						<Text text80 color={COLORS.SECONDARY}>
							Areas of concern:{" "}
							<Text>{capitalize(currentMember.interest)}</Text>
						</Text>
						<Text text80 color={COLORS.SECONDARY}>
							Reasons to participate:{" "}
							<Text>{capitalize(currentMember.reasons)}</Text>
						</Text>
					</ScrollView>
				</View>
			</View>

			<View>
				<View
					center
					width={"100%"}
					br100
					style={{ overflow: "hidden" }}
				>
					<View
						animated
						height={4}
						width="100%"
						br100
						backgroundColor={COLORS.GRAY}
						style={{
							transform: [{ translateX: transValue }],
						}}
					></View>
				</View>
				<View bottom center row gap-8 marginT-8>
					<View padding style={styles.logo}>
						<Image source={theSharksSource} style={styles.imageLogo} />
					</View>
					<View padding style={styles.logo}>
						<Image source={sacoSource} style={styles.imageLogo} />
					</View>
					<View padding style={styles.logo}>
						<Image source={iuhSource} style={styles.imageLogo} />
					</View>
				</View>
			</View>
		</View>
	);
};

export default About;

const styles = StyleSheet.create({
	logo: {
		padding: 4,
		backgroundColor: COLORS.WHITE,
		borderRadius: 4,
	},
	imageLogo: {
		objectFit: "contain",
		width: 50,
		height: 25,
	},
});
