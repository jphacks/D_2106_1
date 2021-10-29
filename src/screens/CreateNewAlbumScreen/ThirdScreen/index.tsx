import { useRoute } from "@react-navigation/core";
import { Button } from "@ui-kitten/components";
import { Asset } from "expo-media-library";
import React, { useCallback, useMemo, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Image from "src/components/atoms/Image";
import Message from "src/components/atoms/Message";
import ScreenLoader from "src/components/atoms/ScreenLoader";
import { P } from "src/components/atoms/Text";
import { View } from "src/components/atoms/Themed";
import { Center } from "src/components/layouts/Align";
import Margin from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import ImageGrid from "src/components/organisms/ImageGrid";
import { screens } from "src/dict";
import useAsyncStorage from "src/hooks/useAsyncStorage";
import useCameraRoll from "src/hooks/useCameraRoll";
import { useNavigation } from "src/hooks/useNavigation";
import { RECORDING_BEGIN_TIME } from "src/provider/location";
import { BASE_PX, SMALL_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";
import Card from "./Card";

type CardType = {
  parentPosition: Animated.ValueXY;
  asset: Asset;
  position: Animated.ValueXY;
};

const ThirdScreen: React.FC<{ recordingBeginTime: number; isDemo?: boolean }> =
  ({ recordingBeginTime, isDemo }) => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const imgSize = width;
    const [parentHeight, setParentHeight] = useState(0);
    const [previewHeight, setPreviewHeight] = useState(0);
    const onLayoutParent = useCallback(
      (e: LayoutChangeEvent) => setParentHeight(e.nativeEvent.layout.height),
      []
    );
    const onLayoutPreview = useCallback(
      (e: LayoutChangeEvent) => setPreviewHeight(e.nativeEvent.layout.height),
      []
    );

    const { assets } = useCameraRoll(
      { createdAfter: recordingBeginTime },
      isDemo
    );

    const [likedAssets, setLikedAssets] = useState<typeof assets>([]);
    const likedAssetExists = likedAssets.length > 0;

    const [activeIndex, setActiveIndex] = useState(0);

    const data = useMemo(
      () =>
        assets
          .map((a) => ({
            asset: a,
            position: new Animated.ValueXY(),
          }))
          .map((item, i, arr) => ({
            ...item,
            parentPosition: arr[i - 1]?.position ?? null,
          })),
      [assets]
    );
    const resetSelection = useCallback(() => {
      setActiveIndex(0);
      setLikedAssets([]);
      data.forEach((item) => {
        item.position.setValue({ x: 0, y: 0 });
      });
    }, [data]);

    const navigateToNext = () => {
      console.log("called");
      navigation.navigate(screens.CreateNewAlbumFour, {
        selected: likedAssets,
      });
    };
    return (
      <View style={styles.flex1} onLayout={onLayoutParent}>
        <Center
          style={{ width: imgSize, height: imgSize, marginBottom: BASE_PX }}
          onLayout={onLayoutPreview}
        >
          <Space vertical>
            <Button onPress={navigateToNext} disabled={!likedAssetExists}>
              アルバム情報を入力
            </Button>
            <Button onPress={resetSelection} appearance="outline">
              もう一度やり直す
            </Button>
          </Space>
          {data
            .map((item, index) => (
              <Card
                key={item.asset.id}
                position={item.position}
                parentPosition={item.parentPosition}
                image={{ uri: item.asset.uri }}
                onNope={() => {
                  setActiveIndex((v) => v + 1);
                  setLikedAssets((v) =>
                    v.filter((vi) => vi.id !== item.asset.id)
                  );
                }}
                onLike={() => {
                  setActiveIndex((v) => v + 1);
                  setLikedAssets((v) => [...v, item.asset]);
                }}
                isActive={activeIndex === index}
                isActiveInBackground={activeIndex < index}
              />
            ))
            .reverse()}
        </Center>
        <Modalize
          snapPoint={100}
          withHandle={true}
          handlePosition="inside"
          alwaysOpen={parentHeight - previewHeight - BASE_PX}
          modalTopOffset={150}
          HeaderComponent={<View style={{ margin: BASE_PX }} />}
          modalStyle={globalStyles.shadow}
        >
          <Margin top={BASE_PX}>
            <ImageGrid
              data={likedAssets}
              extractImageUri={(item) => item.uri}
              renderImage={({ item }) => (
                <Margin size={SMALL_PX}>
                  <Image
                    source={{ uri: item.uri }}
                    width={width / 3 - SMALL_PX * 2}
                    height={width / 3 - SMALL_PX * 2}
                    style={globalStyles.rounodedImage}
                  />
                </Margin>
              )}
              flatListProps={{
                scrollEnabled: false,
                numColumns: 3,
                ListHeaderComponent: (
                  <>
                    {!likedAssetExists && (
                      <Space vertical align="center" size={BASE_PX}>
                        <P gray style={styles.howToText}>
                          スワイプして写真を選別しましょう
                        </P>
                        <Space size={0}>
                          <Space
                            vertical
                            align="center"
                            style={{ width: width / 2 }}
                          >
                            <Image
                              source={require("./arrow.png")}
                              width={50}
                              height={50}
                              resizeMode="contain"
                            />
                            <P gray style={styles.howToText}>
                              スキップ
                            </P>
                          </Space>
                          <Space
                            vertical
                            align="center"
                            style={{ width: width / 2 }}
                          >
                            <Image
                              source={require("./arrow.png")}
                              width={50}
                              height={50}
                              resizeMode="contain"
                              style={{ transform: [{ scaleX: -1 }] }}
                            />
                            <P gray style={styles.howToText}>
                              アルバムに追加
                            </P>
                          </Space>
                        </Space>
                      </Space>
                    )}
                  </>
                ),
              }}
            />
          </Margin>
        </Modalize>
      </View>
    );
  };

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  previewContainer: {
    flex: 1,
    flexDirection: "row",
  },
  howToText: {
    fontSize: 20,
  },
});

export default () => {
  const route = useRoute();

  const isDemo: boolean = (route.params as any)?.isDemo;

  const [recordingBeginTimeStr, , loading] = useAsyncStorage<string | null>(
    RECORDING_BEGIN_TIME,
    null
  );
  const recordingBeginTime = recordingBeginTimeStr
    ? parseInt(recordingBeginTimeStr)
    : null;

  if (loading) return <ScreenLoader />;
  if (!recordingBeginTime)
    return <Message message="記録開始時間が取得できませんでした" />;
  return (
    <ThirdScreen recordingBeginTime={recordingBeginTime} isDemo={isDemo} />
  );
};
