import { useCallback, useRef, useState } from "react";

// async の実行中かどうかの state を得られる
// 重複の実行を防ぐ
const useAsyncCallback = <T extends Array<any>, U>(
  fn: (...args: T) => Promise<U>,
  deps: any[] | null = null
): [(...args: T) => Promise<U | null>, boolean] => {
  const [handling, setHandling] = useState(false);

  const fn1 = patchedAsyncFn<T, U | null>(fn, async (origFn, ...args) => {
    setHandling(true);
    let result: U | null = null;
    try {
      result = await origFn(...args);
    } catch (e) {
      console.error(e);
    }
    setHandling(false);
    return result;
  });
  const fn2 = useSingleCallback(fn1);
  const fn3 = deps ? useCallback(fn2, deps) : fn2;
  return [fn3, handling];
};

// 重複の実行を防ぐ
export const useSingleCallback = <T extends Array<any>, U>(
  fn: (...args: T) => Promise<U>
): ((...args: T) => Promise<U | null>) => {
  const handlingRef = useRef(false);
  const wrapperFn = patchedAsyncFn<T, U | null>(fn, async (origFn, ...args) => {
    if (handlingRef.current) return null;
    handlingRef.current = true;

    let result: U | null = null;
    try {
      result = await origFn(...args);
    } catch (e) {
      console.error(e);
    }
    handlingRef.current = false;
    return result;
  });
  return wrapperFn;
};

export const patchedAsyncFn =
  <T extends Array<any>, U>(
    fn: (...args: T) => Promise<U>,
    process: (fn: (...args: T) => Promise<U>, ...args: T) => Promise<U>
  ): ((...args: T) => Promise<U>) =>
  async (...args: T) =>
    await process(fn, ...args);

export const patchedFn =
  <T extends Array<any>, U>(
    fn: (...args: T) => U,
    process: (fn: (...args: T) => U, ...args: T) => U
  ): ((...args: T) => U) =>
  (...args: T) =>
    process(fn, ...args);

export default useAsyncCallback;
