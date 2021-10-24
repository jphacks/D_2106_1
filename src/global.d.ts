import { ValueResolver } from "src/utils/extension";
import { CSSProp } from "styled-components";

declare global {
  /** Extends array object */
  interface Array<T> {
    /** Returns the first element that satisfies the predicate */
    first(predicate?: (element: T) => boolean): T | undefined;
    /** Returns the last element that satisfies the predicate */
    last(predicate?: (element: T) => boolean): T | undefined;
    uniqueBy(valueResolver?: ValueResolver<T>): T[];
  }
}

declare module "*.svg";
declare module "src/assets/icons/*.svg" {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export = value;
}

declare module "react" {
  interface Attributes {
    css?: CSSProp;
  }
}

export {};
