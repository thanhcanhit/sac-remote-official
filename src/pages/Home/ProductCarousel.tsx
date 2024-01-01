import React from "react";
import { Carousel, Image, Text, View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";

const imgSources = [
	require("../../assets/imgs/logo/saco.jpg"),
	require("../../assets/imgs/product/product1.jpg"),
	require("../../assets/imgs/product/product2.jpg"),
	require("../../assets/imgs/product/product3.jpg"),
];

const ProductCarousel = () => {
	return (
		<View marginV-8>
			<Text text70 marginB-8>
				Some images of the product:{" "}
				<Text color={COLORS.PRIMARY}>Air conditioner belt</Text>
			</Text>
			<Carousel
				autoplay
				autoplayInterval={5000}
				loop
				pageHeight={300}
				containerStyle={{ borderRadius: 8, overflow: "hidden" }}
			>
				{imgSources.map((source) => (
					<View key={source} width="100%" height={300}>
						<Image source={source} height={300} style={{ width: "100%" }} />
					</View>
				))}
			</Carousel>
		</View>
	);
};

export default ProductCarousel;
