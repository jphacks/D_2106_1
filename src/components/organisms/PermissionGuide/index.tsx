import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { Linking, StyleSheet, useWindowDimensions, View } from "react-native";
import Image from "src/components/atoms/Image";
import { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import { BASE_PX } from "src/utils/space";

const PermissionGuide = () => {
  const { width, height } = useWindowDimensions();
  return (
    <Padding size={BASE_PX} style={styles.flex1}>
      <Text category="h5">
        Mappinstagramを使用するために、位置情報の設定を変更してください
      </Text>
      <Space vertical>
        <View style={styles.steps}>
          <View style={{ flex: 1 }}>
            <Text category="h6" style={styles.paragraph}>
              1
            </Text>
          </View>
          <View style={{ flex: 10 }}>
            <Text category="h6">
              この画面の一番下のボタンから、設定画面を開いてください
            </Text>
          </View>
        </View>
        <View style={styles.steps}>
          <View style={{ flex: 1 }}>
            <Text category="h6" style={styles.paragraph}>
              2
            </Text>
          </View>
          <View style={{ flex: 10 }}>
            <Text category="h6">「位置情報」をタップしてください</Text>
          </View>
        </View>
        <Image
          source={require("src/assets/images/Location.jpeg")}
          width={width - 50}
          height={50}
          resizeMode="contain"
        />
        <View style={styles.steps}>
          <View style={{ flex: 1 }}>
            <Text category="h6" style={styles.paragraph}>
              3
            </Text>
          </View>
          <View style={{ flex: 10 }}>
            <Text category="h6">「常に」を選択してください</Text>
          </View>
        </View>
        <Image
          source={require("src/assets/images/LocationMode.jpeg")}
          width={width - 50}
          height={height / 4}
          resizeMode="contain"
        />
        <View style={styles.steps}>
          <View style={{ flex: 1 }}>
            <Text category="h6" style={styles.paragraph}>
              4
            </Text>
          </View>
          <View style={{ flex: 10 }}>
            <Text category="h6">Mappinstagramをもう一度開いてください</Text>
          </View>
        </View>
      </Space>
      <View style={styles.button}>
        <Button onPress={() => Linking.openURL("app-settings:")}>
          設定画面を開く
        </Button>
      </View>
    </Padding>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  header: {
    flexGrow: 0,
    // backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  content: {
    flexGrow: 1,
    // backgroundColor: "silver",
  },
  text: {
    margin: 2,
  },
  steps: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: "row",
    marginTop: 20,
  },
  paragraph: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexGrow: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PermissionGuide;
