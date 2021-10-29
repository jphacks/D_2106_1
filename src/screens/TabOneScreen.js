import { Avatar, Button, Text } from "@ui-kitten/components";
import React from "react";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import PostCard from "src/components/atoms/PostCard";
import { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import { useGetAPI } from "src/hooks/useGetAPI";

export default function TabOneScreen({ navigation }) {
  const windowDimensions = useWindowDimensions();
  const { data: userData, loading: userLoading } = useGetAPI("/user", {
    device_id: "dummy_device_id_1",
  });
  const { id, name, profileImageUrl, introduction } = userData ?? {};
  const { data: postData, loading: postLoading } = useGetAPI("/albums/user", {
    user_id: "dummy_device_id_1",
  });

  const { albums } = postData ?? {};

  const renderItem = ({ item }) => (
    <Padding size={30}>
      <PostCard
        title={item.title}
        imageUrl={item.thumbnailImageUrl}
        locations={item.spot}
        timestamp={item.createdAt}
        width={windowDimensions.width - 80}
        height={260}
      />
    </Padding>
  );
  return (
    <Padding size={10}>
      <FlatList
        data={albums}
        renderItem={renderItem}
        ListHeaderComponent={
          <Space direction="vertical" style={styles.plofile}>
            <Space size="middle">
              <Avatar size="giant" source={{ uri: profileImageUrl }} />
              <Space direction="vertical" size={0}>
                <Text category="h4">{name}</Text>
                <Text>{id}</Text>
              </Space>
            </Space>
            <Text>{introduction}</Text>
            <Button size="small" onPress={() => console.log("pushed")}>
              プロフィールを編集する
            </Button>
          </Space>
        }
      />
    </Padding>
  );
}

const styles = StyleSheet.create({
  plofile: {
    marginTop: 10,
    marginBottom: 10,
  },
  posts: {},
});
