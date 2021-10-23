import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { P } from "src/components/atoms/Text";
import BothCenterContainer from "src/components/layouts/BothCenterContainer";
import Space from "src/components/layouts/Space";
export type Props = {
  message: React.ReactNode;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Message: React.FC<Props> = ({ message, top, bottom, style }) => {
  return (
    <BothCenterContainer filled style={style}>
      <Space vertical size="large">
        {top}
        {typeof message === "string" ? (
          <P bold gray center>
            {message}
          </P>
        ) : (
          message
        )}
        {bottom}
      </Space>
    </BothCenterContainer>
  );
};

export default Message;
