import { useRoute } from "@react-navigation/core";
import { Button } from "@ui-kitten/components";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
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
import { PRIMARY_COLOR } from "src/utils/color";
import { BASE_PX, SMALL_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

const SecondScreen: React.FC<{
  recordingBeginTime: number;
  startLocation: LocationData | null;
  isDemo?: boolean;
}> = ({ recordingBeginTime, startLocation, isDemo }) => {
  const mapRef = useRef<MapView>(null);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const windowDimensions = useWindowDimensions();
  const [isFreeLook, setIsFreeLook] = useState(false);
  const { assets, refreshAssets } = useCameraRoll({
    options: { createdAfter: recordingBeginTime, first: 100 },
    isDemo,
  });

  const { locations } = useLocation();
  const lastLocation = locations.last() ?? startLocation;

  const animateToCoordinate = (coord?: Coordinate) =>
    coord &&
    mapRef.current?.animateToRegion(
      {
        ...coord,
        latitude: coord.latitude - 0.005 * 0.125,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      500
    );

  useInterval(() => refreshAssets(), 5000);
  useEffect(() => {
    if (!isFreeLook && !isDemo) animateToCoordinate(lastLocation?.coordinate);
  }, [lastLocation]);

  // ?????????????????????????????????
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
    <>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          initialRegion={DEFAULT_REGION}
          onPanDrag={() => setIsFreeLook(true)}
          onLayout={onLayoutMap}
          style={{ flex: 1 }}
        >
          <Polyline
            coordinates={locations.map((l) => l.coordinate)}
            strokeWidth={4}
            strokeColor="#A7894B"
          />
          {locations.map((l) => (
            <Marker coordinate={l.coordinate}>
              <View style={styles.pointMarker} />
            </Marker>
          ))}
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
            onPress={() =>
              navigation.navigate(screens.CreateNewAlbumThird, {
                isDemo: isDemo,
              })
            }
            disabled={assets.length <= 0}
          >
            ??????????????????????????????
          </Button>
          {isFreeLook && (
            <Button
              onPress={() => {
                setIsFreeLook(false);
                animateToCoordinate(lastLocation?.coordinate);
              }}
              disabled={!isFreeLook}
            >
              ??????????????????
            </Button>
          )}
        </Space>
        <Modalize
          snapPoint={100}
          withHandle={true}
          handlePosition="inside"
          alwaysOpen={windowDimensions.height * 0.25}
          modalHeight={windowDimensions.height * 0.75}
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
                        <P gray>???????????????????????????????????????</P>
                        <P gray>????????????????????????????????????????????????</P>
                      </Space>
                    )}
                  </>
                ),
              }}
            />
          </Margin>
        </Modalize>
      </View>
    </>
  );
};

type Coordinate = {
  latitude: number;
  longitude: number;
};
const DEFAULT_REGION = {
  latitude: 37.331,
  longitude: -122.0399526,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  pointMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_COLOR,
  },
});

export default () => {
  const route = useRoute();
  const isDemo: boolean = (route.params as any)?.isDemo;

  const [recordingBeginTimeStr, , loading] = useAsyncStorage<string | null>(
    RECORDING_BEGIN_TIME,
    null
  );
  const recordingBeginTime =
    recordingBeginTimeStr !== null ? parseInt(recordingBeginTimeStr) : null;
  const [startLocation, setStartLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const fn = async () => {
      try {
        const currentPosition = await Location.getCurrentPositionAsync();
        setStartLocation(positionToLocation(currentPosition));
      } catch {}
    };
    fn();
  }, [isDemo]);

  if (loading) return <ScreenLoader />;
  if (recordingBeginTime === null)
    return <Message message="???????????????????????????????????????????????????" />;
  return (
    <SecondScreen
      recordingBeginTime={recordingBeginTime}
      startLocation={startLocation}
      isDemo={isDemo}
    />
  );
};
