import { Card, Text } from "@ui-kitten/components";
import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import Image from "src/components/atoms/Image";
import Space from "src/components/layouts/Space";

export type Props = {
  title?: string;
  imageUrl?: string;
  createdAt?: string[];
  timestamp?: number;
};

const PostedCard = ({
  title,
  imageUrl,
  createdAt,
  timestamp,
  width,
  height,
  onPress = () => {},
}) => {
  const header = (
    <Image
      source={{ uri: imageUrl }}
      resizeMode="cover"
      width={width}
      height={height}
    />
  );
  return (
    <Card
      header={header}
      style={{ width: width, height: height * 1.5 }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.reverse}>
        <Text appearance="hint">{moment(timestamp).format("MMM Do YY")}</Text>
      </View>
      <Space align="end">
        <Text category="h6">{title}</Text>
        <Text status="info" category="label">
          {createdAt.join(",")}
        </Text>
      </Space>
    </Card>
  );
};
export default PostedCard;

const styles = StyleSheet.create({
  reverse: {
    flexDirection: "row-reverse",
  },
  title: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
