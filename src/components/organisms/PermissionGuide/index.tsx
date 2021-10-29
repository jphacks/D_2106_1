import { Button, Text } from "@ui-kitten/components";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { ScaledImage } from "src/components/atoms/Image";
import { P } from "src/components/atoms/Text";
import { Center } from "src/components/layouts/Align";
import { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import { useLocation } from "src/provider/location";
import { BORDER_COLOR } from "src/utils/color";
import { BASE_PX } from "src/utils/space";

const PermissionGuide: React.FC<{ onClose: () => void }> = ({
  onClose,
  children,
}) => {
  const { width } = useWindowDimensions();
  const { requirePermission, isPermissionOk } = useLocation();
  const [mlPermissionStatus, requestMLPermission] =
    MediaLibrary.usePermissions();

  useEffect(() => {
    if (!isPermissionOk) return;
    if (mlPermissionStatus?.accessPrivileges !== "all") return;
    onClose();
  }, [mlPermissionStatus?.accessPrivileges, isPermissionOk]);
  return (
    <ScrollView>
      <Padding size={BASE_PX} style={styles.flex1} bottom={40}>
        <Text category="h5">アプリの権限設定を変更してください</Text>
        <Space vertical>
          {!isPermissionOk && (
            <Space vertical>
              <Block content={"位置情報の利用を有効化してください"} />
              <Button onPress={requirePermission}>位置情報の有効化</Button>
              <Block content={"設定アプリを開きます"} />
              <Button onPress={() => Linking.openURL("app-settings:")}>
                設定画面を開く
              </Button>
              <Block content={"「位置情報」の項目を開きます"} />
              <Center>
                <ScaledImage
                  source={require("src/assets/images/settings-location.png")}
                  width={1029}
                  height={132}
                  size={width - BASE_PX * 2}
                  style={styles.image}
                />
              </Center>
              <Block content={"「常に」を選択してください"} />
              <Center>
                <ScaledImage
                  source={require("src/assets/images/settings-location-detail.png")}
                  width={1101}
                  height={567}
                  size={width - BASE_PX * 2}
                  style={styles.image}
                />
              </Center>
            </Space>
          )}
          {mlPermissionStatus?.accessPrivileges !== "all" &&
            (mlPermissionStatus?.status === "undetermined" ? (
              <Space vertical>
                <Block content={"カメラロールの利用を有効化してください"} />
                <P>
                  このアプリを利用するには「すべての写真へのアクセスを許可」を選んでください
                </P>
                <Button onPress={() => requestMLPermission()}>
                  カメラロールの有効化
                </Button>
              </Space>
            ) : (
              <Space vertical>
                <Block content={"「写真」の項目を開きます"} />
                <Center>
                  <ScaledImage
                    source={require("src/assets/images/settings-photo.png")}
                    width={1029}
                    height={132}
                    size={width - BASE_PX * 2}
                    style={styles.image}
                  />
                </Center>
                <Block content={"「すべての写真」を選択してください"} />
                <Center>
                  <ScaledImage
                    source={require("src/assets/images/settings-photo-detail.png")}
                    width={1101}
                    height={428}
                    size={width - BASE_PX * 2}
                    style={styles.image}
                  />
                </Center>
              </Space>
            ))}
          {children}
        </Space>
      </Padding>
    </ScrollView>
  );
};

export const Block: React.FC<{ content: string }> = ({ content }) => {
  return (
    <View style={styles.steps}>
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
