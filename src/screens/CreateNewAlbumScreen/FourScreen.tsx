import { useRoute } from "@react-navigation/native";
import { Asset } from "expo-media-library";
import React, { useCallback, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Image from "src/components/atoms/Image";
import Message from "src/components/atoms/Message";
import { View } from "src/components/atoms/Themed";
import Margin from "src/components/layouts/Margin";
import ImageGrid from "src/components/organisms/ImageGrid";
import { BASE_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

const FourScreen: React.FC<{ selectedAssets: Asset[] }> = ({
  selectedAssets,
}) => {
  const { width } = useWindowDimensions();
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
  return (
    <View style={styles.flex1} onLayout={onLayoutParent}>
      <View></View>
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
            images={selectedAssets.map((a) => a.uri)}
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
  gridImage: {
    borderWidth: 1,
    borderColor: "white",
  },
  howToText: {
    fontSize: 20,
  },
});

export default () => {
  const route = useRoute();
  const selectedAssets: Asset[] = (route.params as any)?.selected;
  console.log("selectedAssets", selectedAssets);

  if (!selectedAssets?.length || selectedAssets.length <= 0)
    return <Message message="選択された画像が見つかりませんでした" />;

  return <FourScreen selectedAssets={selectedAssets} />;
};
