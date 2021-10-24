import styled from "styled-components";
import { Button } from "@ui-kitten/components";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Image from "src/components/atoms/Image";
import ImageGrid from "src/components/organisms/ImageGrid";
import useCameraRoll from "src/hooks/useCameraRoll";
import { View } from "src/components/Themed";

export default function TabOneScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState("");
  const { width } = useWindowDimensions();
  const { assets } = useCameraRoll();

  return (
    <StyledContainer>
      <_header>
        <Button
          onPress={async () => {
            setCurrentTime(await moment());
            console.log(currentTime);
          }}
        >
          Go Travel
        </Button>
      </_header>
      <View>
        <ImageGrid
          data={assets}
          extractImageUri={(item) => item.uri}
          renderImage={({ imageUri }) => (
            <Image
              source={{ uri: imageUri }}
              width={width / 3}
              height={width / 3}
              style={styles.gridImage}
            />
          )}
          style={{ backgroundColor: "blue", width: 300, height: 300 }}
          flatListProps={{ numColumns: 3 }}
        />
      </View>
    </StyledContainer>
  );
}

const StyledContainer = styled.SafeAreaView`
    flex: 1;
    background color: #fff;
    // align-items: center;
    // justify-content: center;
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
    width: 100%;`;

const _pictures = styled.View`
    flex: 10;
    background color: white;
    align-items: center;
    flexWrap: wrap;
    flexDirection: row;
    width: 300;;
  `;

const styles = StyleSheet.create({
  gridImage: {
    borderWidth: 1,
    borderColor: "white",
  },
});
