import { Button } from "@ui-kitten/components";
import React from "react";
import { SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import Image from "src/components/atoms/Image";
import Message from "src/components/atoms/Message";
import ScreenLoader from "src/components/atoms/ScreenLoader";
import { P } from "src/components/atoms/Text";
import { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import ImageGrid from "src/components/organisms/ImageGrid";
import { View } from "src/components/Themed";
import { screens } from "src/dict";
import useAsyncStorage from "src/hooks/useAsyncStorage";
import { RECORDING_BEGIN_TIME } from "src/hooks/useBackgroundLocation";
import useCameraRoll from "src/hooks/useCameraRoll";
import useInterval from "src/hooks/useInterval";
import { useNavigation } from "src/hooks/useNavigation";
import { BORDER_COLOR } from "src/utils/color";
import { LARGE_PX } from "src/utils/space";

const SecondScreen: React.FC<{ recordingBeginTime: number }> = ({
  recordingBeginTime,
}) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { assets, refreshAssets } = useCameraRoll({
    createdAfter: recordingBeginTime,
  });

  useInterval(() => refreshAssets(), 5000);

  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.flex1}>
        <Padding size={LARGE_PX}>
          <Button
            onPress={() => navigation.navigate(screens.CreateNewAlbumThird)}
            disabled={assets.length <= 0}
          >
            アルバムの作成に進む
          </Button>
        </Padding>
        <P>ここの背景でマップデータ上に現状のGPS記録を表示させたい</P>
      </View>
      <View
        style={[styles.flex1, { borderColor: BORDER_COLOR, borderWidth: 2 }]}
      >
        <ImageGrid
          images={assets.map((items) => items.uri)}
          renderImage={({ imageUri }) => (
            <Image
              source={{ uri: imageUri }}
              width={width / 3}
              height={width / 3}
              style={styles.gridImage}
            />
          )}
          flatListProps={{
            numColumns: 3,
            ListHeaderComponent: (
              <>
                {assets.length <= 0 && (
                  <Space vertical>
                    <P gray>
                      位置情報を記録し始めてから撮影が行われていません。
                    </P>
                    <P gray>カメラアプリで写真を撮影しましょう。</P>
                  </Space>
                )}
              </>
            ),
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  gridImage: {
    borderWidth: 1,
    borderColor: "white",
  },
});

export default () => {
  const [recordingBeginTimeStr, , loading] = useAsyncStorage<string | null>(
    RECORDING_BEGIN_TIME,
    null
  );
  const recordingBeginTime = recordingBeginTimeStr
    ? parseInt(recordingBeginTimeStr)
    : null;

  if (loading) return <ScreenLoader />;
  if (!recordingBeginTime)
    return <Message message="記録開始時間が取得できませんでした" />;
  return <SecondScreen recordingBeginTime={recordingBeginTime} />;
};
