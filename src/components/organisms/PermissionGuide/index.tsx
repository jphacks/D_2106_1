import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { Linking, StyleSheet, useWindowDimensions, View } from "react-native";
import { ScaledImage } from "src/components/atoms/Image";
import { Center } from "src/components/layouts/Align";
import { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import { useLocation } from "src/provider/location";
import { BORDER_COLOR } from "src/utils/color";
import { BASE_PX } from "src/utils/space";

const PermissionGuide = () => {
  const { width } = useWindowDimensions();
  const { requirePermission } = useLocation();
  return (
    <Padding size={BASE_PX} style={styles.flex1}>
      <Text category="h5">位置情報の設定を変更してください</Text>
      <Space vertical>
        <Block index={1} content={"位置情報の利用を有効化してください"} />
        <Button onPress={requirePermission}>位置情報の有効化</Button>
        <Block index={2} content={"設定アプリを開きます"} />
        <Button onPress={() => Linking.openURL("app-settings:")}>
          設定画面を開く
        </Button>
        <Block index={3} content={"「位置情報」の項目を開きます"} />
        <Center>
          <ScaledImage
            source={require("src/assets/images/Location.jpeg")}
            width={685}
            height={68}
            size={width - BASE_PX * 2}
            style={styles.image}
          />
        </Center>
        <Block index={4} content={"「常に」を選択してください"} />
        <Center>
          <ScaledImage
            source={require("src/assets/images/LocationMode.jpeg")}
            width={828}
            height={420}
            size={width - BASE_PX * 2}
            style={styles.image}
          />
        </Center>
      </Space>
    </Padding>
  );
};

const Block: React.FC<{ index: number; content: string }> = ({
  index,
  content,
}) => {
  return (
    <View style={styles.steps}>
      <View style={{ flex: 1 }}>
        <Text category="h6" style={styles.paragraph}>
          {index}
        </Text>
      </View>
      <View style={{ flex: 10 }}>
        <Text category="h6">{content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
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
  image: {
    borderColor: BORDER_COLOR,
    borderWidth: 2,
  },
});

export default PermissionGuide;
