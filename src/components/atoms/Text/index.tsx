import React from "react";
import { BLACK_COLOR, DANGER_COLOR, GRAY_COLOR } from "src/utils/color";
import styled from "styled-components";
import { Text } from "../Themed";

export type Props = {
  bold?: boolean;
  gray?: boolean;
  center?: boolean;
  color?: string;
  lineHeight?: number;
};

const wrap =
  <T,>(Component: T): T =>
  // @ts-ignore
  ({ children, ...props }) =>
    (
      // @ts-ignore
      <Component {...props}>{children ?? ""}</Component>
    );

export const H1FontSize = 26;
export const H2FontSize = 22;
export const H3FontSize = 18;

export const PFontSize = 16;
export const SmallFontSize = 14;
export const TinyFontSize = 12;

export const BaseTextStyle = `
  color: ${BLACK_COLOR};
  font-weight: 400;
`;
export const H1Style = `
  font-size: ${H1FontSize}px !important;
  font-weight: bold !important;
`;
export const H2Style = `
  font-size: ${H2FontSize}px !important;
  font-weight: bold !important;
`;
export const H3Style = `
  font-size: ${H3FontSize}px !important;
  font-weight: bold !important;
`;
export const PStyle = `
  font-size: ${PFontSize}px;
  font-weight: 400;
`;
export const SmallStyle = `
  font-size: ${SmallFontSize}px;
`;
export const TinyStyle = `
  font-size: ${TinyFontSize}px;
`;
export const BoldStyle = `
  font-weight: bold;
`;
export const GrayStyle = `
  color: ${GRAY_COLOR};
`;

export const CenterStyle = `
  text-align: center;
`;
export const DangerStyle = `
  color: ${DANGER_COLOR};
`;

export const LinkStyle = `
  color: #2e78b7;
`;

const grayProps = ({ gray }: Pick<Props, "gray">) => (gray ? GrayStyle : "");
const boldProps = ({ bold }: Pick<Props, "bold">) => (bold ? BoldStyle : "");
const centerProps = ({ center }: Pick<Props, "center">) =>
  center ? CenterStyle : "";
const colorProps = ({ color }: Pick<Props, "color">) =>
  color ? `color: ${color};` : "";

export const H1 = wrap(styled(Text)<Props>`
  ${BaseTextStyle}
  ${H1Style}
  ${grayProps}
  ${boldProps}
  ${centerProps}
  ${colorProps}
  line-height: ${({ lineHeight = 1.5 }) => lineHeight * H1FontSize}px;
`);

export const H2 = wrap(styled(Text)<Props>`
  ${BaseTextStyle}
  ${H2Style}
  ${grayProps}
  ${boldProps}
  ${centerProps}
  ${colorProps}
  line-height: ${({ lineHeight = 1.5 }) => lineHeight * H2FontSize}px;
`);

export const H3 = wrap(styled(Text)<Props>`
  ${BaseTextStyle}
  ${H3Style}
  ${grayProps}
  ${boldProps}
  ${centerProps}
  ${colorProps}
  line-height: ${({ lineHeight = 1.5 }) => lineHeight * H3FontSize}px;
`);

export const P = wrap(styled(Text)<Props>`
  ${BaseTextStyle}
  ${PStyle}
  ${grayProps}
  ${boldProps}
  ${centerProps}
  ${colorProps}
  line-height: ${({ lineHeight = 1.5 }) => lineHeight * PFontSize}px;
`);

export const SmallP = wrap(styled(Text)<Props>`
  ${BaseTextStyle}
  ${PStyle}
  ${SmallStyle}
  ${grayProps}
  ${boldProps}
  ${centerProps}
  ${colorProps}
  line-height: ${({ lineHeight = 1.5 }) => lineHeight * SmallFontSize}px;
`);
export const TinyP = wrap(styled(Text)<Props>`
  ${BaseTextStyle}
  ${PStyle}
  ${TinyStyle}
  ${grayProps}
  ${boldProps}
  ${centerProps}
  ${colorProps}
  line-height: ${({ lineHeight = 1.5 }) => lineHeight * TinyFontSize}px;
`);
