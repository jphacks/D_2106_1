import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { SmallP } from "src/components/atoms/Text";
import { View } from "src/components/atoms/Themed";
import Margin from "src/components/layouts/Margin";
import ImageGrid from "src/components/organisms/ImageGrid";
import { BASE_PX } from "src/utils/space";
import Card from "./Card";

const dummyImg = {
  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
};

type CardType = {
  id: string;
  image: { uri: string };
  position: Animated.ValueXY;
  parentPosition: Animated.ValueXY;
};

export default function TabTwoScreen() {
  const { width: imgSize } = useWindowDimensions();
  const [parentHeight, setParentHeight] = useState(0);
  const [previewHeight, setPreviewHeight] = useState(0);
  const data: CardType[] = useMemo(
    () =>
      Array.from({ length: 50 }, () => dummyImg)
        .map((image, i) => ({
          id: `${i}`,
          image,
          isActive: i === 0,
          position: new Animated.ValueXY(),
        }))
        .map((item, i, arr) => ({
          ...item,
          parentPosition: arr[i - 1]?.position ?? null,
        })),
    []
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const modalizeRef = useRef<Modalize>(null);

  const onLayoutParent = useCallback(
    (e: LayoutChangeEvent) => setParentHeight(e.nativeEvent.layout.height),
    []
  );
  const onLayoutPreview = useCallback(
    (e: LayoutChangeEvent) => setPreviewHeight(e.nativeEvent.layout.height),
    []
  );

  const ModalHeader = () => (
    <View style={{ margin: BASE_PX }}>
      <SmallP>追加された画像</SmallP>
    </View>
  );

  return (
    <View style={styles.flex1} onLayout={onLayoutParent}>
      <View
        style={{ width: imgSize, height: imgSize, marginBottom: BASE_PX }}
        onLayout={onLayoutPreview}
      >
        {data
          .map((card, index) => (
            <Card
              key={card.id}
              {...card}
              onNope={() => setActiveIndex((v) => v + 1)}
              onLike={() => setActiveIndex((v) => v + 1)}
              isActive={activeIndex === index}
            />
          ))
          .reverse()}
      </View>
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
            images={data.map((c) => c.image.uri)}
            flatListProps={{ scrollEnabled: false }}
          />
        </Margin>
      </Modalize>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  gridImage: {
    borderWidth: 1,
    borderColor: "white",
  },
});
