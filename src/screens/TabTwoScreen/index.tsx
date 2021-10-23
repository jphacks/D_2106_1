import { Button } from "@ui-kitten/components";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Image from "src/components/atoms/Image";
import { P } from "src/components/atoms/Text";
import { View } from "src/components/atoms/Themed";
import { Center } from "src/components/layouts/Align";
import Margin from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import ImageGrid from "src/components/organisms/ImageGrid";
import useCameraRoll from "src/hooks/useCameraRoll";
import { BASE_PX } from "src/utils/space";
import Card from "./Card";

type CardType = {
  id: string;
  image: { uri: string };
  position: Animated.ValueXY;
  parentPosition: Animated.ValueXY;
};

export default function TabTwoScreen() {
  const { width } = useWindowDimensions();
  const imgSize = width;
  const [parentHeight, setParentHeight] = useState(0);
  const [previewHeight, setPreviewHeight] = useState(0);

  const assets = useCameraRoll();
  const [likedAssetIds, setLikedAssetIds] = useState<string[]>([]);
  const likedAssetExists = likedAssetIds.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);

  const data: CardType[] = useMemo(
    () =>
      assets
        .map((a) => ({
          id: a.id,
          image: { uri: a.uri },
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
    setLikedAssetIds([]);
    data.forEach((item) => {
      item.position.setValue({ x: 0, y: 0 });
    });
  }, [data]);

  const modalizeRef = useRef<Modalize>(null);

  const onLayoutParent = useCallback(
    (e: LayoutChangeEvent) => setParentHeight(e.nativeEvent.layout.height),
    []
  );
  const onLayoutPreview = useCallback(
    (e: LayoutChangeEvent) => setPreviewHeight(e.nativeEvent.layout.height),
    []
  );

  const ModalHeader = () => <View style={{ margin: BASE_PX }}></View>;

  return (
    <View style={styles.flex1} onLayout={onLayoutParent}>
      <Center
        style={{ width: imgSize, height: imgSize, marginBottom: BASE_PX }}
        onLayout={onLayoutPreview}
      >
        <Space vertical>
          <Button disabled={!likedAssetExists}>アルバムを作成</Button>
          <Button onPress={resetSelection}>もう一度やり直す</Button>
        </Space>
        {data
          .map((item, index) => (
            <Card
              key={item.id}
              {...item}
              onNope={() => {
                setActiveIndex((v) => v + 1);
                setLikedAssetIds((v) => v.filter((vi) => vi !== item.id));
              }}
              onLike={() => {
                setActiveIndex((v) => v + 1);
                setLikedAssetIds((v) => [...v, item.id]);
              }}
              isActive={activeIndex === index}
              isActiveInBackground={activeIndex < index}
            />
          ))
          .reverse()}
      </Center>
      <Modalize
        ref={modalizeRef}
        snapPoint={100}
        withHandle={true}
        handlePosition="inside"
        alwaysOpen={parentHeight - previewHeight - BASE_PX}
        modalTopOffset={150}
        HeaderComponent={ModalHeader}
      >
        <Margin top={BASE_PX}>
          <ImageGrid
            images={data
              .filter((c) => likedAssetIds.includes(c.id))
              .map((c) => c.image.uri)}
            renderImage={({ imageUri }) => (
              <Image
                source={{ uri: imageUri }}
                width={width / 3}
                height={width / 3}
                style={styles.gridImage}
              />
            )}
            flatListProps={{
              scrollEnabled: false,
              numColumns: 3,
              ListHeaderComponent: () => (
                <>
                  {!likedAssetExists && (
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
                        <P gray style={{ fontSize: 20 }}>
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
                        <P gray style={{ fontSize: 20 }}>
                          アルバムに追加
                        </P>
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
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  previewContainer: {
    flex: 1,
    flexDirection: "row",
  },
  gridImage: {
    borderWidth: 1,
    borderColor: "white",
  },
});
