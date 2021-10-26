import ImageEditor from "@react-native-community/image-editor";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-media-library";
import { useAppContext } from "src/provider/app";
import { groupBy } from "src/utils";

const MAX_NUM_PER_GROUP = 10;
const MAX_IMAGE_SIZE = 1500;

const useUploadImage = (endpoint: string) => {
  const { serverHost } = useAppContext();
  const uploadAssetImages = async ({
    albumId,
    assets,
    onProgress,
  }: {
    albumId: string;
    assets: Asset[];
    onProgress?: (r: number) => void;
  }) => {
    const groups = groupBy(assets, (a, i) =>
      Math.ceil((i + 1) / MAX_NUM_PER_GROUP)
    ).map(([, a]) => a);

    for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
      // 最大 MAX_NUM_PER_GROUP 個の assets
      const group = groups[groupIdx];
      const formData = new FormData();
      for (let assetIdx = 0; assetIdx < group.length; assetIdx++) {
        const a = group[assetIdx];
        const assetInfo = await MediaLibrary.getAssetInfoAsync(
          a.uri.replace("ph://", "")
        );
        const imageSize = { width: assetInfo.width, height: assetInfo.height };
        const displaySize = clampImageSize(imageSize);
        const localJpgUri = await ImageEditor.cropImage(a.uri, {
          size: imageSize,
          displaySize,
          offset: { x: 0, y: 0 },
          resizeMode: "stretch",
        });
        formData.append(`image${assetIdx + 1}`, {
          // @ts-ignore
          uri: localJpgUri,
          name: `${Math.round(assetInfo.creationTime / 1000)}.jpg`,
          type: "image/jpeg",
        });
      }
      formData.append("album_id", albumId);
      formData.append("image_num", `${group.length}`);

      const result = await fetch(`${serverHost}${endpoint}`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => res.json());
      if (result.status !== 200) {
        throw new Error(result.err);
      }
      onProgress?.((groupIdx + 1) / groups.length);
    }
  };
  return { uploadAssetImages };
};

const clampImageSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  // width と height の大きい方
  const largerSize = Math.max(width, height);

  const targetSize = Math.min(largerSize, MAX_IMAGE_SIZE);
  return {
    width: Math.ceil((width / largerSize) * targetSize),
    height: Math.ceil((height / largerSize) * targetSize),
  };
};

export default useUploadImage;
