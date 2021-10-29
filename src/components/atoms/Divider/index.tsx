import { View } from "src/components/atoms/Themed";
import { undefinedOrNull } from "src/utils";
import { SMALL_PX } from "src/utils/space";
import styled from "styled-components";

export type Props = {
  size?: number;
  top?: number;
  bottom?: number;
};

const Divider = styled(View)<Props>`
  ${({ size: _size, top, bottom }) => {
    const size = _size ?? SMALL_PX;
    return undefinedOrNull(top) && undefinedOrNull(bottom)
      ? `margin:${size}px 0px;`
      : `margin:${top ?? size / 2}px 0px ${bottom ?? size / 2}px;`;
  }}
  height: 1px;
  width: 100%;
  background-color: #eee;
`;

export default Divider;
