import { Button } from "@ui-kitten/components";
import * as React from "react";
import useCameraRoll from "src/hooks/useCameraRoll";
import useUploadImage from "src/hooks/useUploadImage";
import { View } from "../components/Themed";

function TabThreeScreenBackup() {
  const { assets } = useCameraRoll();
  const { uploadAssetImages } = useUploadImage("/upload/image");

  return (
    <View style={{ flex: 1.5 }}>
      <Button
        onPress={() => {
          uploadAssetImages({
            albumId: "asdfasdf",
            assets: [
              ...assets,
              ...assets,
              ...assets,
              ...assets,
              ...assets,
              ...assets,
              ...assets,
              ...assets,
              ...assets,
              ...assets,
              ...assets,
            ],
          });
        }}
      >
        test
      </Button>
    </View>
  );
}
export default TabThreeScreenBackup;
