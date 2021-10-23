import React, { useMemo } from "react";
import {
  Animated,
  Image as RNImage,
  ImageSourcePropType,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

export type Props = {
  position: Animated.ValueXY;
  parentPosition: Animated.ValueXY;
  onNope: () => void;
  onLike: () => void;
  isActive?: boolean;
  image: ImageSourcePropType;
};

const ACTIVE_SCALE = 0.9;
const INACTIVE_SCALE = 0.7;

const Card: React.FC<Props> = ({
  position,
  parentPosition,
  isActive,
  onNope,
  onLike,
  image: imageSource,
}) => {
  const { width } = useWindowDimensions();
  const rotate = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });
  const defaultScale = isActive ? ACTIVE_SCALE : INACTIVE_SCALE;
  const nextCardScale = parentPosition
    ? parentPosition.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: [ACTIVE_SCALE, INACTIVE_SCALE, ACTIVE_SCALE],
        extrapolate: "clamp",
      })
    : defaultScale;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
          return !!isActive;
        },
        onPanResponderMove: (evt, gestureState) => {
          position.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx > 120) {
            Animated.spring(position, {
              toValue: { x: width + 100, y: gestureState.dy },
              useNativeDriver: true,
            }).start();
            onNope();
          } else if (gestureState.dx < -120) {
            Animated.spring(position, {
              toValue: { x: -width - 100, y: gestureState.dy },
              useNativeDriver: true,
            }).start();
            onLike();
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [onNope, onLike]
  );

  const rotateAndTranslate = {
    transform: [
      { rotate: rotate },
      { scale: nextCardScale },
      ...position.getTranslateTransform(),
    ],
  };
  return (
    <Animated.View
      {...panResponder.panHandlers} // <----- This is what binds to the PanResponder's onPanResponderMove handler
      style={[rotateAndTranslate, styles.card, { width }]}
    >
      <RNImage style={styles.cardImg} source={imageSource} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardImg: {
    borderRadius: 20,
    height: undefined,
    width: undefined,
    resizeMode: "cover",
    flex: 1,
  },
  card: {
    position: "absolute",
    height: "105%",
  },
  cardTextContainer: {
    position: "absolute",
    top: 45,
    zIndex: 999,
  },
  cardText: {
    borderWidth: 2,
    fontSize: 30,
    fontWeight: "800",
    padding: 10,
    borderRadius: 4,
  },
  cardTextContainerLike: {
    right: 45,
    transform: [{ rotate: "15deg" }],
  },
  cardTextLike: {
    color: "#4bdb79",
    borderColor: "#4bdb79",
  },
  cardTextContainerNope: {
    left: 45,
    transform: [{ rotate: "-15deg" }],
  },
  cardTextNope: {
    color: "#D80027",
    borderColor: "#D80027",
  },
});

export default Card;
