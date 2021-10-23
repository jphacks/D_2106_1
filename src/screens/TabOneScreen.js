import * as React from "react";
import { StyleSheet } from "react-native";

import * as MediaLibrary from "expo-media-library";
import styled from "styled-components";
import { Button, Text } from "@ui-kitten/components";
import moment from "moment";

export default function TabOneScreen({ navigation }) {
  const [currentTime, setCurrentTime] = React.useState("");
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [data, setData] = React.useState([]);
  const [isAsset, setIsAsset] = React.useState(false);

  const onPressGetAsset = async () => {
    const foo = await MediaLibrary.getAssetsAsync();
    setData(foo.assets.map((item) => item.uri));
  };

  React.useEffect(() => {
    requestPermission;
    if (isAsset) onPressGetAsset();
  }, [isAsset]);

  return (
    <_container>
      <_header>
        <Button
          onPress={async () => {
            requestPermission;
            setCurrentTime(await moment().format());
            console.log(currentTime);
            console.log(!isAsset);
            setIsAsset(!isAsset);
          }}
        >
          <Text>Go travel</Text>
        </Button>
        <Button title="ResetAsset" onPress={() => setData([])} />
      </_header>
      <_content>
        <_pictures>
          {data.map((uri) => (
            <Image source={{ uri }} style={{ width: 100, height: 100 }} />
          ))}
        </_pictures>
      </_content>
    </_container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

const _container = styled.SafeAreaView`
    flex: 1;
    background color: #fff;
    align-items: center;
    justify-content: center;
    `;
const _header = styled.View`
    flex: 2 0;
    background color: #fff;
    align-items: center;
    justify-content: center;
`;

const _content = styled.View`
    flex: 10;
    background color: silver;
    justify-content: center;
    align-items: center;
    width: 100%;
    `;

const _pictures = styled.View`
    flex: 10;
    background color: white;
    align-items: center;
    flexWrap: wrap;
    flexDirection: row;
    width: 300;;
  `;
