import React, { useMemo, useRef } from "react";
import { useEffect } from "react";
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
  isActiveInBackground?: boolean;
  image: ImageSourcePropType;
};

const ACTIVE_SCALE = 0.9;
const INACTIVE_SCALE = 0.7;

const Card: React.FC<Props> = ({
  position,
  parentPosition,
  isActive,
  isActiveInBackground,
  onNope,
  onLike,
  image: imageSource,
}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const showSelf = () =>
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  const hideSelf = () =>
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

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
        onStartShouldSetPanResponder: (evt, gestureState) => !!isActive,
        onPanResponderMove: (evt, gestureState) =>
          position.setValue({ x: gestureState.dx, y: gestureState.dy }),
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx > 120) {
            Animated.spring(position, {
              toValue: { x: width + 100, y: gestureState.dy },
              useNativeDriver: true,
            }).start(hideSelf);
            onLike();
          } else if (gestureState.dx < -120) {
            Animated.spring(position, {
              toValue: { x: -width - 100, y: gestureState.dy },
              useNativeDriver: true,
            }).start(hideSelf);
            onNope();
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
      { rotate },
      { scale: nextCardScale },
      ...position.getTranslateTransform(),
    ],
    opacity,
  };

  useEffect(() => {
    (isActive || isActiveInBackground) && showSelf();
  }, [isActive, isActiveInBackground]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
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
});

export default Card;
