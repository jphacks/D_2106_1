import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Text } from "@ui-kitten/components";
import Image from "src/components/atoms/Image";
import Space from "src/components/layouts/Space";
import { Padding } from "src/components/layouts/Margin";
import moment from "moment";

export type Props = {
  title?: string;
  imageUrl?: string;
  createdAt?: string[];
  timestamp?: number;
};

const PostedCard = ({ title, imageUrl, createdAt, timestamp }) => {
  const header = (
    <Image
      source={{ uri: imageUrl }}
      resizeMode="cover"
      width={360}
      height={210}
    />
  );
  return (
    <Padding size={30}>
      <Card header={header}>
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
    </Padding>
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
