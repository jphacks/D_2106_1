import { Card, Text } from "@ui-kitten/components";
import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import Image from "src/components/atoms/Image";
import Space from "src/components/layouts/Space";

export type Props = {
  title?: string;
  imageUrl?: string;
  locations?: string[];
  timestamp?: number;
  onPress?: () => void;
  width: number;
  height: number;
};

const PostCard: React.FC<Props> = ({
  title,
  imageUrl,
  locations,
  timestamp,
  width,
  height,
  onPress,
}) => {
  return (
    <Card
      header={
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          width={width}
          height={width * (9 / 16)} // 16:9
        />
      }
      style={{ width, height }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.reverse}>
        <Text appearance="hint">{moment(timestamp).format("MMM Do YY")}</Text>
      </View>
      <Space align="end">
        <Text category="h6">{title}</Text>
        <Text status="info" category="label">
          {locations?.join(",")}
        </Text>
      </Space>
    </Card>
  );
};
export default PostCard;

const styles = StyleSheet.create({
  reverse: {
    flexDirection: "row-reverse",
  },
  title: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
