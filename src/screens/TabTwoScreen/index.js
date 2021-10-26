import { Avatar, Button, Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput } from "react-native";
import { Center } from "src/components/layouts/Align";
import Space from "src/components/layouts/Space";
import * as ImagePicker from "expo-image-picker";
import { Padding } from "src/components/layouts/Margin";

const SampleUser = {
  userid: "shinjibaka2021",
  name: "真治",
  profile_image_url:
    "https://amd-pctr.c.yimg.jp/r/iwiz-amd/20211020-00000048-chuspo-000-2-view.jpg",
  introduction:
    "しんじ22歳　座右の銘は、「毎日が学び」                            #春から東京大学大学院 #有料物件 #学歴ロンダリングしてる人と繋がりたい #来世はゴリラになりたい #シャバーニ",
};

export default function TabTwoScreen({ navigation }) {
  const [image, setImage] = useState(SampleUser.profile_image_url);
  const [name, setName] = useState(SampleUser.name);
  const [introduction, setIntrodution] = useState(SampleUser.introduction);

  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    setImage(result.uri);
  };

  return (
    <Space direction="vertical" style={{ marginTop: 20, flex: 1 }}>
      <Center style={{ padding: 10 }}>
        <Text>プロフィール画像</Text>
        <Avatar marginTop={10} size="giant" source={{ uri: image }} />
        <Button
          marginTop={10}
          size="small"
          onPress={() => {
            pickImage();
            console.log("pushed");
          }}
        >
          画像を選択する
        </Button>
      </Center>
      <Text>名前</Text>
      <TextInput
        style={styles.name}
        onChangeText={setName}
        value={name}
        maxLength={12}
      />
      <Text>自己紹介</Text>
      <TextInput
        style={styles.introduction}
        onChangeText={setIntrodution}
        value={introduction}
        maxLength={128}
        multiline={"True"}
      />
      <Button>変更を保存する</Button>
    </Space>
  );
}

const styles = StyleSheet.create({
  name: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  introduction: {
    height: 120,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlign: "center",
  },
});
