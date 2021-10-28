import { Avatar, Button, Text } from "@ui-kitten/components";
import React from "react";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import PostedCard from "src/components/atoms/PostedCard";
import { Padding } from "src/components/layouts/Margin";

import Space from "src/components/layouts/Space";

const SampleUser = {
  userid: "shinjibaka2021",
  name: "真治",
  profile_image_url:
    "https://amd-pctr.c.yimg.jp/r/iwiz-amd/20211020-00000048-chuspo-000-2-view.jpg",
  introduction:
    "しんじ22歳　座右の銘は、「毎日が学び」                            #春から東京大学大学院 #有料物件 #学歴ロンダリングしてる人と繋がりたい #来世はゴリラになりたい #シャバーニ",
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
  const renderItem = ({ item }) => (
    <Padding size={30}>
      <PostedCard
        title={item.title}
        imageUrl={item.imageUrl}
        createdAt={item.createdAt}
        timestamp={item.timestamp}
        width={windowDimensions.width - 80}
        height={210}
      />
    </Padding>
  );
  return (
    <Padding size={10}>
      <FlatList
        data={sampleData}
        renderItem={renderItem}
        ListHeaderComponent={
          <Space direction="vertical" style={styles.plofile}>
            <Space size="middle">
              <Avatar
                size="giant"
                source={{ uri: SampleUser.profile_image_url }}
              />
              <Space direction="vertical" size={0}>
                <Text category="h4">{SampleUser.name}</Text>
                <Text>{SampleUser.userid}</Text>
              </Space>
            </Space>
            <Text>{SampleUser.introduction}</Text>
            <Button size="small">プロフィールを編集する</Button>
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
