import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Button, Input } from "@ui-kitten/components";
import { Asset } from "expo-media-library";
import React, { useCallback, useState } from "react";
import {
  Alert,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Modalize } from "react-native-modalize";
import * as Progress from "react-native-progress";
import Image from "src/components/atoms/Image";
import Message from "src/components/atoms/Message";
import { P } from "src/components/atoms/Text";
import { View } from "src/components/atoms/Themed";
import { Center } from "src/components/layouts/Align";
import Margin, { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import ImageGrid from "src/components/organisms/ImageGrid";
import { screens } from "src/dict";
import useAsyncCallback from "src/hooks/useAsyncCallback";
import { useNavigation } from "src/hooks/useNavigation";
import { usePostAPI } from "src/hooks/usePostAPI";
import useUploadImage from "src/hooks/useUploadImage";
import { useLocation } from "src/provider/location";
import { trimString } from "src/utils";
import { BLACK_COLOR, PRIMARY_COLOR } from "src/utils/color";
import { BASE_PX, SMALL_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

const FourthScreen: React.FC<{ selectedAssets: Asset[] }> = ({
  selectedAssets,
}) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { locations } = useLocation();
  const [parentHeight, setParentHeight] = useState(0);
  const [previewHeight, setPreviewHeight] = useState(0);
  const { uploadAssetImages } = useUploadImage("/upload/image");
  const [postAlbumMetadata] = usePostAPI("/album");

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

  const [progress, setProgress] = useState(0);

  const isFormDone = trimString(title) !== null && thumbnail !== null;

  const [postAlbum, postingAlbum] = useAsyncCallback(async () => {
    let albumId: string = "-1";
    // メタデータの送信
    try {
      const startedAt = locations.first()?.timestamp;
      const endedAt = locations.last()?.timestamp;
      const variables = {
        title,
        isPublic: true,
        startedAt: startedAt && Math.round(startedAt / 1000),
        endedAt: endedAt && Math.round(endedAt / 1000),
        locations: locations.map((l: any) => ({
          latitude: l.coordinate.latitude,
          longitude: l.coordinate.longitude,
          timestamp: Math.round(l.timestamp / 1000),
        })),
      };
      const result = await postAlbumMetadata(variables);
      albumId = result.id;
    } catch (err) {
      Alert.alert("情報の送信に失敗しました", err.message);
      return;
    }
    try {
      await uploadAssetImages({
        albumId,
        assets: selectedAssets,
        onProgress: (r) => setProgress(r),
      });
    } catch (err) {
      Alert.alert("写真の送信に失敗しました", err.message);
      return;
    }
    navigation.navigate(screens.CreateNewAlbumFifth, { albumId });
  });
  return (
    <>
      <View style={styles.flex1} onLayout={onLayoutParent}>
        <Padding size={BASE_PX} bottom={0} onLayout={onLayoutPreview}>
          <Space vertical size={12}>
            <Button disabled={!isFormDone} onPress={postAlbum}>
              アルバムを作成
            </Button>
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
                  <Margin size={SMALL_PX}>
                    <Image
                      source={{ uri: item.uri }}
                      width={width / 3 - SMALL_PX * 2}
                      height={width / 3 - SMALL_PX * 2}
                      style={[
                        globalStyles.rounodedImage,
                        thumbnail?.id === item.id && {
                          borderWidth: 4,
                          borderColor: PRIMARY_COLOR,
                        },
                      ]}
                    />
                  </Margin>
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
      <Spinner
        visible={postingAlbum}
        overlayColor={"rgba(0, 0, 0, 0.25)"}
        customIndicator={<Progress.Pie progress={progress} size={50} />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  previewContainer: {
    flex: 1,
    flexDirection: "row",
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
