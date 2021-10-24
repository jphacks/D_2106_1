import { useCallback, useEffect, useRef, useState } from "react";

// https://ysfaran.github.io/blog/post/0002-use-state-with-promise/

const useStateWithPromise = <S>(initialState: S | (() => S)) => {
  const [state, setState] = useState<S>(initialState);
  const [counter, setCounter] = useState(0);
  const resolverRef = useRef<((value: S) => void) | null>(null);

  useEffect(() => {
    if (resolverRef.current) {
      resolverRef.current(state);
      resolverRef.current = null;
    }
    /**
     * Since a state update could be triggered with the exact same state again,
     * it's not enough to specify state as the only dependency of this useEffect.
     * That's why resolverRef.current is also a dependency, because it will guarantee,
     * that handleSetState was called in previous render
     */
  }, [resolverRef.current, counter]);

  const handleSetState = useCallback(
    (stateAction: ((prev: S) => S) | S) => {
      setState(stateAction);
      setCounter((v) => v + 1);
      return new Promise((resolve: (value: S) => void) => {
        resolverRef.current = resolve;
      });
    },
    [setState],
  );

  return [state, handleSetState] as [S, typeof handleSetState];
};

export default useStateWithPromise;
