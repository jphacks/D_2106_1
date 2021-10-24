import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Button, Input } from "@ui-kitten/components";
import { Asset } from "expo-media-library";
import React, { useCallback, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Image from "src/components/atoms/Image";
import Message from "src/components/atoms/Message";
import { P } from "src/components/atoms/Text";
import { View } from "src/components/atoms/Themed";
import { Center } from "src/components/layouts/Align";
import Margin, { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import ImageGrid from "src/components/organisms/ImageGrid";
import { trimString } from "src/utils";
import { BLACK_COLOR, PRIMARY_COLOR } from "src/utils/color";
import { BASE_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

const FourthScreen: React.FC<{ selectedAssets: Asset[] }> = ({
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

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<Asset | null>(null);

  const isFormDone = trimString(title) !== null && thumbnail !== null;
  return (
    <View style={styles.flex1} onLayout={onLayoutParent}>
      <Padding size={BASE_PX} bottom={0} onLayout={onLayoutPreview}>
        <Space vertical size={12}>
          <Button disabled={!isFormDone}>アルバムを作成</Button>
          <Input
            placeholder="アルバムのタイトル"
            value={title}
            onChangeText={(nextValue) => setTitle(nextValue)}
          />
          <P center>サムネイルとして使用する写真を選択</P>
          <Center>
            <AntDesign name="down" size={20} color={BLACK_COLOR} />
          </Center>
        </Space>
      </Padding>
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
            data={selectedAssets}
            extractImageUri={(item) => item.uri}
            renderImage={({ item }) => (
              <TouchableOpacity onPress={() => setThumbnail(item)}>
                <Image
                  source={{ uri: item.uri }}
                  width={width / 3}
                  height={width / 3}
                  style={[
                    styles.gridImage,
                    thumbnail?.id === item.id && {
                      borderWidth: 4,
                      borderColor: PRIMARY_COLOR,
                    },
                  ]}
                />
              </TouchableOpacity>
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

  return <FourthScreen selectedAssets={selectedAssets} />;
};
