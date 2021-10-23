import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { View } from "src/components/atoms/Themed";
import styled from "styled-components";

// Ant Design の Space との相性があまり良くなく、
// Align: Horizontal のときはうまく省略してくれない
// flex を用いて横並びした子要素の中で使用する場合は、
// flex-element に min-width: 0px; を適応する必要がある

export type Props = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  fixed: "left" | "right";
  fullHeight?: boolean;
  leftStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

const BothEdge: React.FC<Props> = React.memo(
  ({ left, right, fixed, fullHeight, leftStyle, rightStyle, style }) => (
    <Container fullHeight={fullHeight} style={style}>
      <Left fixed={fixed === "left"} fullHeight={fullHeight} style={leftStyle}>
        {left}
      </Left>
      <Right fixed={fixed === "right"} fullHeight={fullHeight} style={rightStyle}>
        {right}
      </Right>
    </Container>
  ),
);

const Container = styled(View)<{
  fullHeight?: boolean;
}>`
  width: 100%;
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};
  flex-direction: row;
  justify-content: space-between;
`;

const Left = styled(View)<{
  fixed: boolean;
  width?: string | null;
  fullHeight?: boolean;
}>`
  width: ${({ width }) => width ?? "auto"};
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};

  ${({ fixed }) => (!fixed ? "flex: 1;" : "")}
  flex-direction: row;
  justify-content: flex-start;
`;

const Right = styled(View)<{
  fixed: boolean;
  width?: string | null;
  fullHeight?: boolean;
}>`
  width: ${({ width }) => width ?? "auto"};
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};

  ${({ fixed }) => (!fixed ? "flex: 1;" : "")}
  flex-direction: row;
  justify-content: flex-end;
`;

export default BothEdge;
