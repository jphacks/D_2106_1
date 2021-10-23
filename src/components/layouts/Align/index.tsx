import { View } from "src/components/atoms/Themed";
import styled from "styled-components";

export type Props = {
  disabled?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
};

export const Center = styled(View)<Props>`
  ${({ disabled }) =>
    disabled
      ? ""
      : `
  align-items: center;
  justify-content: center;
  `}
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};
`;
export const BothCenter = styled(View)<Props>`
  ${({ disabled }) =>
    disabled
      ? ""
      : `
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;`}
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};
`;

export const BothFixedCenter = styled(View)<Props>`
  ${({ disabled }) =>
    disabled
      ? ""
      : `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);`}
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};
`;

export const Left = styled(View)<Props>``;

export const Right = styled(View)<Props>`
  flex-direction: column;
  align-items: flex-end;
`;
