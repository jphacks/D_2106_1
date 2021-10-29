import { Avatar, Button, Text } from "@ui-kitten/components";
import React from "react";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import PostCard from "src/components/atoms/PostCard";
import { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import { useGetAPI } from "src/hooks/useGetAPI";
import { profileScreens } from "src/dict";

const SampleUser = {
  userid: "shinjibaka2021",
  name: "真治",
  profile_image_url:
    "https://amd-pctr.c.yimg.jp/r/iwiz-amd/20211020-00000048-chuspo-000-2-view.jpg",
  introduction:
    "しんじ22歳　座右の銘は、「毎日が学び」                            #春から東京大学大学院 #有料物件 #学歴ロンダリングしてる人と繋がりたい #動物園年パス勢 #40歳でFIREする人 #IPO(新規公開株)ガチ勢 #フリーエンジニア #機械学習 #来世はゴリラになりたい #シャバーニ",
};

const sampleData = [
  {
    title: "動物園",
    imageUrl:
      "https://amd-pctr.c.yimg.jp/r/iwiz-amd/20211020-00000048-chuspo-000-2-view.jpg",
    createdAt: ["Nagoya", "Mie", "Nara"],
    timestamp: 1635071480,
  },
  {
    title: "水族館",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Niphon_spinosus_Oga_Aquarium_2.jpg/1200px-Niphon_spinosus_Oga_Aquarium_2.jpg",
    createdAt: ["Nagoya", "Mie", "Nara"],
    timestamp: 1635071480,
  },
  {
    title: "動物園",
    imageUrl:
      "https://amd-pctr.c.yimg.jp/r/iwiz-amd/20211020-00000048-chuspo-000-2-view.jpg",
    createdAt: ["Nagoya", "Mie", "Nara"],
    timestamp: 1635071480,
  },
  {
    title: "水族館",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Niphon_spinosus_Oga_Aquarium_2.jpg/1200px-Niphon_spinosus_Oga_Aquarium_2.jpg",
    createdAt: ["Nagoya", "Mie", "Nara"],
    timestamp: 1635071480,
  },
];

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
