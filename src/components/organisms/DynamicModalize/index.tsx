import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Modalize,
  ModalizeProps as ModalizePropsOrig,
} from "react-native-modalize";
import Image from "src/components/atoms/Image";
import PostCard from "src/components/atoms/PostCard";
import Margin, { Padding } from "src/components/layouts/Margin";
import ImageGrid from "src/components/organisms/ImageGrid";
import { LARGE_PX, SMALL_PX, TINY_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

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
  // animatedValueをここに追加
};

const dynamicModalizeContext = React.createContext<DynamicModalizeState>({
  loading: false,
  direction: "horizontal",
  contentHeight: 100,
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
  const onPositionChange = (pos: "initial" | "top") => {
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
      {...props}
    >
      {loading && <ActivityIndicator />}
      <dynamicModalizeContext.Provider
        value={{
          loading: !!loading,
          direction: openStatus === "initial" ? "horizontal" : "vertical",
          contentHeight: height,
        }}
      >
        <View style={{ height }}>{children}</View>
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
};

export const ImageList = <T,>({
  data,
  previewFlatListRef,
  onPressItem,
  extractImageUri,
  keyExtractor,
  previewSize,
}: ImageListProps<T>) => {
  const dynamicModalizeState = useDynamicModalizeState();
  if (dynamicModalizeState === null) return null;
  const { direction, contentHeight } = dynamicModalizeState;
  const { width } = useWindowDimensions();

  return direction === "horizontal" ? (
    <FlatList
      data={data}
      ref={previewFlatListRef}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() => onPressItem?.({ item, index })}
          activeOpacity={0.7}
        >
          <Margin size={SMALL_PX} top={SMALL_PX}>
            <View style={{ ...globalStyles.shadow, shadowOpacity: 0.15 }}>
              <Image
                source={{ uri: extractImageUri(item) }}
                height={previewSize ?? contentHeight - 2 * SMALL_PX}
                width={previewSize ?? contentHeight - 2 * SMALL_PX}
                style={globalStyles.rounodedImage}
              />
            </View>
          </Margin>
        </TouchableOpacity>
      )}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  ) : (
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
    />
  );
};

export type AlbumListProps<T> = {
  data: T[];
  previewFlatListRef?: React.RefObject<FlatList<T>>;
  onPressItem?: (args: { item: T; index: number }) => void;
  keyExtractor: (item: T) => string;
};

export const AlbumList = <
  T extends { title: string; imageUrl: string; timestamp: number }
>({
  data,
  previewFlatListRef,
  onPressItem,
  keyExtractor,
}: AlbumListProps<T>) => {
  const dynamicModalizeState = useDynamicModalizeState();
  if (dynamicModalizeState === null) return null;
  const { direction, contentHeight } = dynamicModalizeState;
  const { width } = useWindowDimensions();

  const cardAspectRatio = 4 / 3;
  const verticalWidth = width - SMALL_PX * 2;
  const verticalHeight = verticalWidth / cardAspectRatio;
  const horizontalHeight = contentHeight - 50;
  const horizontalWidth = horizontalHeight * cardAspectRatio;

  const renderItem = ({ item, index }) => (
    <Padding size={TINY_PX}>
      <PostCard
        title={item.title}
        imageUrl={item.imageUrl}
        locations={[]}
        timestamp={item.timestamp}
        onPress={() => onPressItem?.({ item, index })}
        width={direction === "vertical" ? verticalWidth : horizontalWidth}
        height={direction === "vertical" ? verticalHeight : horizontalHeight}
      />
    </Padding>
  );

  return direction === "horizontal" ? (
    <FlatList
      data={data}
      ref={previewFlatListRef}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  ) : (
    <FlatList
      data={data}
      ref={previewFlatListRef}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default DynamicModalizeContainer;
