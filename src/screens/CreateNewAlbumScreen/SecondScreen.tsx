import { Button } from "@ui-kitten/components";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import Image from "src/components/atoms/Image";
import Message from "src/components/atoms/Message";
import ScreenLoader from "src/components/atoms/ScreenLoader";
import { P } from "src/components/atoms/Text";
import Margin from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import ImageGrid from "src/components/organisms/ImageGrid";
import { View } from "src/components/Themed";
import { screens } from "src/dict";
import useAsyncStorage from "src/hooks/useAsyncStorage";
import useCameraRoll from "src/hooks/useCameraRoll";
import useInterval from "src/hooks/useInterval";
import { useNavigation } from "src/hooks/useNavigation";
import {
  LocationData,
  positionToLocation,
  RECORDING_BEGIN_TIME,
  useLocation,
} from "src/provider/location";
import { BASE_PX, SMALL_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

const SecondScreen: React.FC<{
  recordingBeginTime: number;
  startLocation: LocationData;
}> = ({ recordingBeginTime, startLocation }) => {
  const mapRef = useRef<MapView>(null);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [isFreeLook, setIsFreeLook] = useState(false);
  const { assets, refreshAssets } = useCameraRoll({
    createdAfter: recordingBeginTime,
  });
  const { locations } = useLocation();
  const lastLocation = locations.last() ?? startLocation;

  const animateToCoordinate = (coord?: Coordinate) =>
    coord &&
    mapRef.current?.animateToRegion(
      { ...coord, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      500
    );

  useInterval(() => refreshAssets(), 5000);
  useEffect(() => {
    if (!isFreeLook) animateToCoordinate(lastLocation?.coordinate);
  }, [lastLocation]);

  // モーダル用に高さを取得
  const [parentHeight, setParentHeight] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const onLayoutParent = useCallback(
    (e: LayoutChangeEvent) => setParentHeight(e.nativeEvent.layout.height),
    []
  );
  const onLayoutMap = useCallback(
    (e: LayoutChangeEvent) => setMapHeight(e.nativeEvent.layout.height),
    []
  );

  return (
    <SafeAreaView style={styles.flex1}>
      <View
        style={[styles.flex1, { position: "relative" }]}
        onLayout={onLayoutParent}
      >
        <MapView
          ref={mapRef}
          style={{ flex: 0.5 }}
          initialRegion={DEFAULT_REGION}
          onPanDrag={() => setIsFreeLook(true)}
          onLayout={onLayoutMap}
        >
          <Polyline
            coordinates={locations.map((l) => l.coordinate)}
            strokeWidth={8}
          />
        </MapView>
        <Space
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
          }}
        >
          <Button
            onPress={() => navigation.navigate(screens.CreateNewAlbumThird)}
            disabled={assets.length <= 0}
          >
            アルバムの作成に進む
          </Button>
          {isFreeLook && (
            <Button
              onPress={() => {
                setIsFreeLook(false);
                animateToCoordinate(lastLocation?.coordinate);
              }}
              disabled={assets.length <= 0}
            >
              現在地に戻る
            </Button>
          )}
        </Space>
      </View>
      <Modalize
        snapPoint={100}
        withHandle={true}
        handlePosition="inside"
        alwaysOpen={parentHeight - mapHeight + 4}
        modalTopOffset={150}
        HeaderComponent={<View style={{ margin: BASE_PX }} />}
        modalStyle={globalStyles.shadow}
      >
        <Margin top={BASE_PX}>
          <ImageGrid
            data={assets}
            extractImageUri={(item) => item.uri}
            renderImage={({ item }) => (
              <Margin size={SMALL_PX}>
                <Image
                  source={{ uri: item.uri }}
                  width={width / 3 - SMALL_PX * 2}
                  height={width / 3 - SMALL_PX * 2}
                  style={globalStyles.rounodedImage}
                />
              </Margin>
            )}
            flatListProps={{
              scrollEnabled: false,
              numColumns: 3,
              ListHeaderComponent: (
                <>
                  {assets.length <= 0 && (
                    <Space vertical align="center">
                      <P gray>位置情報を記録し始めてから</P>
                      <P gray>新しく写真が追加されていません。</P>
                    </Space>
                  )}
                </>
              ),
            }}
          />
        </Margin>
      </Modalize>
    </SafeAreaView>
  );
};

type Coordinate = {
  latitude: number;
  longitude: number;
};
const DEFAULT_REGION = {
  latitude: 35.1221702,
  longitude: 136.9599526,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
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
  const [startLocation, setStartLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const fn = async () => {
      const currentPosition = await Location.getCurrentPositionAsync();
      setStartLocation(positionToLocation(currentPosition));
    };
    fn();
  }, []);

  if (loading || startLocation === null) return <ScreenLoader />;
  if (!recordingBeginTime)
    return <Message message="記録開始時間が取得できませんでした" />;
  return (
    <SecondScreen
      recordingBeginTime={recordingBeginTime}
      startLocation={startLocation}
    />
  );
};
