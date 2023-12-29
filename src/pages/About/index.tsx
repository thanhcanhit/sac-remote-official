import React, { useEffect, useRef, useState } from "react";
import { Carousel, Image, Text, View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";
import Separator from "../../components/Separator";
import { BOX_SHADOW } from "../../utils/styles";
import { Animated, Dimensions, StyleSheet } from "react-native";

const theSharksSource = require("../../assets/imgs/logo/thesharks.jpg");
const sacoSource = require("../../assets/imgs/logo/saco.jpg");
const iuhSource = require("../../assets/imgs/logo/iuh.jpg");

const imgSources = [
	require("../../assets/imgs/team/thu.jpg"),
	require("../../assets/imgs/team/thien.jpg"),
	require("../../assets/imgs/team/doan.jpg"),
	require("../../assets/imgs/team/canh.jpg"),
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
		major: "Ngôn ngữ Anh",
		interest:
			"các sản phẩm công nghệ thông minh phục vụ cộng đồng và có tiềm năng phục vụ thị trường",
		reasons:
			"muốn thử sức với một cuộc thi lớn và góp phần tạo ra sản phẩm giá trị cho xã hội",
	},
	{
		name: "Lê Chí Thiện",
		major: "IOT và trí tuệ nhân tạo ứng dụng",
		interest:
			"các sản phẩm công nghệ thông minh phục vụ cộng đồng và có tiềm năng phục vụ thị trường",
		reasons:
			"muốn xây dựng sản phẩm phục vụ lợi ích cộng đồng tạo ra giá trị cho xã hội",
	},
	{
		name: "Trần Xuân Đoan",
		major: "Kinh doanh quốc tế",
		interest:
			"các sản phẩm công nghệ thông minh với mong muốn phục vụ cộng đồng và phát triển xã hội",
		reasons:
			"muốn học hỏi những kiến thức thực tế, muốn nghiên cứu về lĩnh vực kinh doanh để phát triển doanh nghiệp trong tương lai",
	},
	{
		name: "Nguyễn Thanh Cảnh",
		major: "Kỹ Thuật Phần Mềm",
		interest: "xây dựng các sản phẩm phần mềm, website phục vụ cộng đồng",
		reasons:
			"giúp các bạn hiện thực ý tưởng trở thành sản phẩm đồng thời học hỏi nâng cao trình độ bản thân",
	},
	{
		name: "Nguyễn Minh Huyền",
		major: "Thương mại điện tử",
		interest:
			"các sản phẩm, thiết bị thông minh giải quyết các nhu cầu trong đời sống con người và duy trì thiên nhiên bền vững",
		reasons:
			"muốn học hỏi và rèn luyện kiến thức thực tế về phát triển sản phẩm trong kinh doanh, có sản phẩm giúp bảo vệ sức khỏe người dân trong khi làm việc dưới trời nắng",
	},
	{
		name: "Lê Thị Bình Nguyên",
		major: "Marketing",
		interest: "các sản phẩm phục vụ đời sống và sức khoẻ của con người",
		reasons:
			"muốn học hỏi kinh nghiệm nghiên cứu và sáng tạo sản phẩm phục vụ cộng đồng, được cọ sát bản thân với thực tế để tích lũy kinh nghiệm cho bản thân",
	},
	{
		name: "Lê Thị Thu Thảo",
		major: "Thương mại điện tử",
		interest:
			"sản phẩm công nghệ phục vụ các nhu cầu đời sống và sức khỏe con người",
		reasons:
			"muốn trải nghiệm qua những dự án để được cọ sát với thực tế và tích lũy thêm nhiều kiến thức và kinh nghiệm cho bản thân sau này",
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

	return (
		<View flex>
			<View flex-1>
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
								}}
							/>
						</View>
					))}
				</Carousel>
			</View>
			{index + 1 < informations.length && (
				<View
					center
					width={"100%"}
					br100
					style={{ overflow: "hidden" }}
					marginT-32
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
			)}
			{/* Information */}
			<View flex-1>
				<Text text70 center color={COLORS.SECONDARY}>
					{index + 1}/{imgSources.length}
				</Text>

				<Text text60 center marginT-8>
					{currentMember.name}
				</Text>

				<Separator />

				<View paddingH-24 gap-8>
					<Text text80 color={COLORS.SECONDARY}>
						Chuyên ngành: <Text>{currentMember.major}</Text>
					</Text>
					<Text text80 color={COLORS.SECONDARY}>
						Lĩnh vực quan tâm: <Text>{currentMember.interest.normalize()}</Text>
					</Text>
					<Text text80 color={COLORS.SECONDARY}>
						Lý do tham gia: <Text>{currentMember.reasons.normalize()}</Text>
					</Text>
				</View>
			</View>

			<View center row gap-8>
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
		width: 75,
		height: 50,
	},
});
