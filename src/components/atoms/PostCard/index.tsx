import { Card } from "@ui-kitten/components";
import moment from "moment";
import React from "react";
import { StyleSheet } from "react-native";
import Image from "src/components/atoms/Image";
import Space from "src/components/layouts/Space";
import { H3, SmallP } from "../Text";

export type Props = {
  title?: string;
  imageUrl?: string;
  locations?: string[] | string;
  timestamp?: number;
  onPress?: () => void;
  width: number;
  height: number;
  small?: boolean;
};

const PostCard: React.FC<Props> = ({
  title,
  imageUrl,
  locations,
  timestamp,
  width,
  height,
  onPress,
  small,
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
      {small ? (
        <Space style={{ margin: -8 }}>
          <SmallP gray bold numberOfLines={1}>
            {title}
          </SmallP>
        </Space>
      ) : (
        <Space vertical>
          <Space align="center" style={{ margin: -8 }}>
            <H3>{title}</H3>
            <SmallP bold gray>
              {typeof locations === "string" ? locations : locations?.join(",")}
            </SmallP>
          </Space>
          <SmallP bold gray>
            {moment(timestamp).format("YYYY-MM-DD HH:mm")}
          </SmallP>
        </Space>
      )}
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
