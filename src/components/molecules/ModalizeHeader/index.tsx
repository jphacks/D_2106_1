import React from "react";
import Divider from "src/components/atoms/Divider";
import { H2 } from "src/components/atoms/Text";
import BothEdge from "src/components/layouts/BothEdge";
import Margin from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import { BASE_PX, SMALL_PX } from "src/utils/space";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  title?: string;
  onClose?: () => void;
  right?: React.ReactNode;
};

const ModalizeHeader: React.FC<Props> = ({ title, onClose, right }) => (
  <>
    <Margin size={BASE_PX} bottom={SMALL_PX}>
      <BothEdge
        left={
          <Space align="center" size={0}>
            <AntDesign name="close" size={24} color="black" onPress={onClose} />
            {title && <H2>{title}</H2>}
          </Space>
        }
        right={right}
        fixed="right"
        style={{ alignItems: "center" }}
      />
    </Margin>
    <Divider bottom={0} />
  </>
);

export default ModalizeHeader;
