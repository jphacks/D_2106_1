import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import {
  Modalize,
  ModalizeProps as ModalizePropsOrig,
} from "react-native-modalize";
import Image from "src/components/atoms/Image";
import PostCard from "src/components/atoms/PostCard";
import { Center } from "src/components/layouts/Align";
import Margin, { Padding } from "src/components/layouts/Margin";
import ImageGrid from "src/components/organisms/ImageGrid";
import { LARGE_PX, SMALL_PX, TINY_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

// Type instantiation is excessively deep and possibly infinite
// が発生するので、any にしてしまう
const AnimatedView: any = Animated.View;

type ModalizeProps = Omit<
  ModalizePropsOrig,
  | "alwaysOpen"
  | "modalHeight"
  | "onPositionChange"
  | "handlePosition"
  | "rootStyle"
  | "modalStyle"
>;
export type ContainerProps = {
  loading?: boolean;
} & ModalizeProps;

export type DynamicModalizeState = {
  loading: boolean;
  direction: "vertical" | "horizontal";
  contentHeight: number;
  animated: Animated.Value;
  initialHeight: number;
  topHeight: number;
};

const dynamicModalizeContext = React.createContext<DynamicModalizeState>({
  loading: false,
  direction: "horizontal",
  contentHeight: 100,
  animated: new Animated.Value(0),
  initialHeight: 100,
  topHeight: 100,
});

export const useDynamicModalizeState = () =>
  useContext<DynamicModalizeState>(dynamicModalizeContext);

const DynamicModalizeContainer = ({
  children,
  loading,
  ...props
}: ContainerProps) => {
  const windowDimensions = useWindowDimensions();
  const [openStatus, setOpenStatus] = useState<"initial" | "top">("initial");
  // ここで　Animated を使う

  const initialHeight = windowDimensions.height * 0.25;
  const topHeight = windowDimensions.height * 0.75;
  const [height, setHeight] = useState(initialHeight);
  const animated: Animated.Value = React.useRef(new Animated.Value(0)).current;
  const onPositionChange = async (pos: "initial" | "top") => {
    setOpenStatus(pos);
    if (pos === "initial") setHeight(initialHeight);
    if (pos === "top") setHeight(topHeight);
  };

  return (
    <Modalize
      alwaysOpen={initialHeight}
      modalHeight={topHeight}
      onPositionChange={onPositionChange}
      handlePosition="inside"
      rootStyle={{ marginBottom: 0 }}
      modalStyle={[globalStyles.shadow]}
      onLayout={({ layout }) => setHeight(layout.height)}
      panGestureAnimatedValue={animated}
      {...props}
    >
      {loading && <ActivityIndicator />}
      <dynamicModalizeContext.Provider
        value={{
          loading: !!loading,
          direction: openStatus === "initial" ? "horizontal" : "vertical",
          contentHeight: height,
          animated: animated,
          initialHeight,
          topHeight,
        }}
      >
        <View style={{ height: topHeight, position: "relative" }}>
          {children}
        </View>
      </dynamicModalizeContext.Provider>
    </Modalize>
  );
};

export type ImageListProps<T> = {
  data: T[];
  previewFlatListRef?: React.RefObject<FlatList<T>>;
  onPressItem?: (args: { item: T; index: number }) => void;
  extractImageUri: (item: T) => string;
  keyExtractor: (item: T) => string;
  previewSize?: number;
  style?: StyleProp<ViewStyle>;
};

export const ImageList = <T,>({
  data,
  previewFlatListRef,
  onPressItem,
  extractImageUri,
  keyExtractor,
  previewSize,
  style,
}: ImageListProps<T>) => {
  const dynamicModalizeState = useDynamicModalizeState();
  if (dynamicModalizeState === null) return null;
  const { direction, loading, initialHeight, topHeight, animated } =
    dynamicModalizeState;
  const detailListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();

  const inputRange = [0, 1];

  const increase = animated.interpolate({
    inputRange,
    outputRange: [1, 0],
  });
  const decrease = animated.interpolate({
    inputRange,
    outputRange: [0, 1],
  });

  useEffect(() => {
    if (direction === "horizontal")
      detailListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [direction]);

  const horizontalHeight = previewSize ?? initialHeight - 40;
  const Header = <>{loading && <ActivityIndicator />}</>;
  return (
    <>
      <AnimatedView
        style={[
          styles.fitToParent,
          {
            opacity: increase,
            height: horizontalHeight,
            paddingBottom: 0,
          },
          style,
        ]}
      >
        <FlatList
          data={data}
          ref={previewFlatListRef}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onPressItem?.({ item, index })}
              activeOpacity={0.7}
            >
              <Margin size={SMALL_PX}>
                <View style={[globalStyles.shadow, { shadowOpacity: 0.15 }]}>
                  <Image
                    source={{ uri: extractImageUri(item) }}
                    height={horizontalHeight - 2 * SMALL_PX}
                    width={horizontalHeight - 2 * SMALL_PX}
                    style={[globalStyles.rounodedImage]}
                  />
                </View>
              </Margin>
            </TouchableOpacity>
          )}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </AnimatedView>
      <AnimatedView
        style={[styles.fitToParent, { opacity: decrease, height: topHeight }]}
        pointerEvents={direction === "horizontal" ? "none" : "auto"}
      >
        <ImageGrid
          data={data}
          extractImageUri={extractImageUri}
          renderImage={({ item }) => (
            <Margin size={SMALL_PX} top={LARGE_PX}>
              <View style={{ ...globalStyles.shadow, shadowOpacity: 0.15 }}>
                <Image
                  source={{ uri: extractImageUri(item) }}
                  width={width / 3 - SMALL_PX * 2}
                  height={width / 3 - SMALL_PX * 2}
                  style={globalStyles.rounodedImage}
                />
              </View>
            </Margin>
          )}
          flatListProps={{ numColumns: 3 }}
          flatListRef={detailListRef}
        />
      </AnimatedView>
    </>
  );
};

export type AlbumListProps<T> = {
  data: T[];
  previewFlatListRef?: React.RefObject<FlatList<T>>;
  onPressItem?: (args: { item: T; index: number }) => void;
  keyExtractor: (item: T) => string;
};

export const AlbumList = <
  T extends {
    title: string;
    imageUrl: string;
    timestamp: number;
    locations: string[];
  }
>({
  data,
  previewFlatListRef,
  onPressItem,
  keyExtractor,
}: AlbumListProps<T>) => {
  const dynamicModalizeState = useDynamicModalizeState();
  if (dynamicModalizeState === null) return null;
  const { initialHeight, topHeight, direction, animated } =
    dynamicModalizeState;
  const detailListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();

  const cardAspectRatio = 5 / 4;
  const verticalWidth = width - SMALL_PX * 2;
  const verticalHeight = verticalWidth / cardAspectRatio;
  const horizontalHeight = initialHeight - 50;
  const horizontalWidth = horizontalHeight * cardAspectRatio;

  const renderVerticalItem = ({ item, index }) => (
    <Padding size={TINY_PX}>
      <Center>
        <PostCard
          title={item.title}
          imageUrl={item.imageUrl}
          locations={item.locations}
          timestamp={item.timestamp}
          onPress={() => onPressItem?.({ item, index })}
          width={verticalWidth}
          height={verticalHeight}
        />
      </Center>
    </Padding>
  );
  const renderHorizontalItem = ({ item, index }) => (
    <Padding size={TINY_PX}>
      <PostCard
        title={item.title}
        imageUrl={item.imageUrl}
        locations={[]}
        timestamp={item.timestamp}
        onPress={() => onPressItem?.({ item, index })}
        width={horizontalWidth}
        height={horizontalHeight}
        small
      />
    </Padding>
  );

  const inputRange = [0, 1];

  const increase = animated.interpolate({
    inputRange,
    outputRange: [1, 0],
  });
  const decrease = animated.interpolate({
    inputRange,
    outputRange: [0, 1],
  });
  const common = {
    data,
    ref: previewFlatListRef,
    keyExtractor,
  };

  useEffect(() => {
    if (direction === "horizontal")
      detailListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [direction]);
  return (
    <>
      <AnimatedView
        style={[
          styles.fitToParent,
          { opacity: increase, height: initialHeight },
        ]}
      >
        <FlatList
          {...common}
          renderItem={renderHorizontalItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </AnimatedView>
      <AnimatedView
        style={[styles.fitToParent, { opacity: decrease, height: topHeight }]}
        pointerEvents={direction === "horizontal" ? "none" : "auto"}
      >
        <FlatList
          {...common}
          ref={detailListRef}
          renderItem={renderVerticalItem}
          style={{ overflow: "visible" }}
        />
      </AnimatedView>
    </>
  );
};

export const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

const styles = StyleSheet.create({
  fitToParent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 50,
  },
});

export default DynamicModalizeContainer;
