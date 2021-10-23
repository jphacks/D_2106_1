import React, { useState } from "react";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { StyleSheet, Animated, ImageSourcePropType } from "react-native";

import EditScreenInfo from "src/components/EditScreenInfo";
import { Text, View } from "src/components/Themed";
import Card from "./Card";

const dummyImg: ImageSourcePropType = {
  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
};

type CardType = {
  id: string;
  image: ImageSourcePropType;
  // isActive: boolean;
  position: Animated.ValueXY;
  parentPosition: Animated.ValueXY;
};

export default function TabTwoScreen() {
  const { width } = useWindowDimensions();
  const cards: CardType[] = useMemo(
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

  return (
    <View style={{ width, height: width }}>
      {cards
        .map((card, index) => {
          return (
            <Card
              key={card.id}
              {...card}
              onNope={() => setActiveIndex((v) => v + 1)}
              onLike={() => setActiveIndex((v) => v + 1)}
              isActive={activeIndex === index}
            />
          );
        })
        .reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
