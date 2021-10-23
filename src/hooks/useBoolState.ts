import { useState } from "react";
import useAsyncCallback from "./useAsyncCallback";

export type Options = {
  onTrue?: () => any | boolean | Promise<boolean>;
  onFalse?: () => any | boolean | Promise<boolean>;
  onChange?: (v: boolean) => any | boolean | Promise<boolean>;
};

/**
 *
 * @param initialState Booleanの初期値
 * @param onTrue 値を変更する際の、次の値がfrueのときに実行される関数。関数内で return false をすると値は更新されない
 * @param onFalse 値を変更する際の、次の値がfalseのときに実行される関数。関数内で return false をすると値は更新されない
 */

const useBoolState = (
  initialState: boolean = false,
  { onTrue, onFalse, onChange }: Options = {},
) => {
  const [state, setState] = useState<boolean>(!!initialState);
  const [setTrue, handling1] = useAsyncCallback(async () => {
    if (onTrue && isFalse(await onTrue())) return;
    if (onChange && isFalse(await onChange(true))) return;
    setState(true);
  }, [onTrue, onChange]);
  const [setFalse, handling2] = useAsyncCallback(async () => {
    if (onFalse && isFalse(await onFalse())) return;
    if (onChange && isFalse(await onChange(false))) return;
    setState(false);
  }, [onFalse, onChange]);
  const [toggle, handling3] = useAsyncCallback(async () => {
    const nextV = !state;
    if (nextV && onTrue && isFalse(await onTrue())) return;
    if (!nextV && onFalse && isFalse(await onFalse())) return;
    if (onChange && isFalse(await onChange(nextV))) return;
    setState(nextV);
  }, [state, onTrue, onFalse, onChange]);
  const [setStateWithCallback, handling4] = useAsyncCallback(
    async (nextV: boolean) => {
      if (nextV && onTrue && isFalse(await onTrue())) return;
      if (!nextV && onFalse && isFalse(await onFalse())) return;
      if (onChange && isFalse(await onChange(nextV))) return;
      return setState(nextV);
    },
    [onTrue, onFalse, onChange],
  );

  const handling = handling1 || handling2 || handling3 || handling4;
  return {
    state,
    setState: setStateWithCallback,
    setStateRaw: setState,
    setTrue,
    setFalse,
    toggle,
    handling,
  };
};

const isFalse = (v: any) => v === false;

export default useBoolState;
