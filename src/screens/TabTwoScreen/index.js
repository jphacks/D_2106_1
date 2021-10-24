import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Card, Text } from "@ui-kitten/components";
import Image from "src/components/atoms/Image";
import Space from "src/components/layouts/Space";
import { Padding } from "src/components/layouts/Margin";
import useCameraRoll from "src/hooks/useCameraRoll";
import moment from "moment";

export default function TabTwoScreen({ navigation }) {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const title = "This is Title";
  const place = ["Nagoya", "Gihu"];
  const assets = useCameraRoll();
  const time = moment(assets.first?.().creationTime).format("MMM Do YY");

  const header = (
    <Image
      source={require("./SamplePhoto.jpg")}
      style={styles.image}
      resizeMode="cover"
      width={360}
      height={210}
    />
  );

  return (
    <Padding size={30}>
      <Card header={header}>
        <View style={styles.reverse}>
          <Text appearance="hint">{time}</Text>
        </View>
        <Space align="end">
          <Text category="h6">{title}</Text>
          <Text status="info" category="label">
            {place.join(",")}
          </Text>
        </Space>
      </Card>
    </Padding>
  );
}

const styles = StyleSheet.create({
  reverse: {
    flexDirection: "row-reverse",
  },
  title: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
