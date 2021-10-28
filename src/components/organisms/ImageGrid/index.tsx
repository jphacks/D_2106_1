import React, { PropsWithChildren, useCallback, useState } from "react";
import {
  FlatList,
  FlatListProps,
  ImageSourcePropType,
  ModalProps,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import useBoolState from "src/hooks/useBoolState";

export type Props<T> = {
  data: T[];
  extractImageUri: (item: T) => string;
  shift?: number;
  onLongPress?: (image: ImageSourcePropType) => void;
  onImageIndexChange?: (imageIndex: number) => void;
  presentationStyle?: ModalProps["presentationStyle"];
  animationType?: ModalProps["animationType"];
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  delayLongPress?: number;
  HeaderComponent?: React.FC<{ imageIndex: number }>;
  FooterComponent?: React.FC<{ imageIndex: number }>;
  flatListProps?: Partial<FlatListProps<T>>;
  renderImage: ({ item }: { item: T }) => React.ReactNode;
};

const ImageGrid = <T,>({
  data,
  extractImageUri,
  shift = 0,
  flatListProps,
  renderImage,
  ...props
}: PropsWithChildren<Props<T>>) => {
  const { state: visible, setTrue, setFalse } = useBoolState(false);
  const [currentImageIndex, setImageIndex] = useState(0);

  const onSelect = useCallback(
    (index: number) => {
      setImageIndex(index);
      setTrue();
    },
    [setImageIndex, setTrue]
  );

  return (
    <>
      <FlatList
        {...flatListProps}
        data={data}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={`${item}_${index}`}
            activeOpacity={0.8}
            onPress={() => onSelect(index)}
          >
            {renderImage({ item })}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => extractImageUri(item)}
        contentContainerStyle={styles.gridContainer}
      />
      <ImageViewing
        images={data?.map((item) => ({ uri: extractImageUri(item) }))}
        imageIndex={currentImageIndex}
        visible={visible}
        presentationStyle="overFullScreen"
        backgroundColor="white"
        onRequestClose={setFalse}
        {...props}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // imageList: { flexGrow: 0 },
  // imageListContainer: {
  //   flex: 0,
  //   paddingLeft: 10,
  //   marginBottom: 10,
  // },
  // imageWrapper: {
  //   marginRight: 10,
  // },
  gridImage: {
    borderWidth: 1,
    borderColor: "white",
  },
  gridContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default ImageGrid;
