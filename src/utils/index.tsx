// JavaScript や React に関連するような内容

export const randomString = () => Math.random().toString(32).substring(2);

export const trimString = (s?: any): string | null => {
  if (typeof s !== "string") return s;
  const trimed = s.trim();
  return trimed.length > 0 ? trimed : null;
};

export const trimObject = <T extends { [key: string]: any }>(
  obj?: T | null
): T | null | undefined =>
  (obj === null || obj === undefined
    ? obj
    : Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          typeof value === "string"
            ? trimString(value)
            : Array.isArray(value)
            ? value.map((v) => trimObject(v))
            : typeof value === "object"
            ? trimObject(value)
            : value,
        ])
      )) as T | null | undefined;

export const filterNullable = (obj: any): any =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => !undefinedOrNull(value))
  );
export const isNotEmpty = <T,>(arg?: T | null): arg is T =>
  !!arg && (Array.isArray(arg) ? arg.length > 0 : true);

export const undefinedOrNull = (o: any): o is undefined | null =>
  o === undefined || o === null;

export const emptyFn = () => {
  /** do nothing */
};
export const emptyAsyncFn = async () => {
  /** do nothing */
};

export const objectMap = <V, U>(
  obj: {
    [key in string]: V;
  },
  fn: (v: V, k: string, i: number) => U
) =>
  Object.fromEntries(
    Object.entries<V>(obj).map(([k, v], i) => [k, fn(v, k, i)])
  );
export const objectFilter = <V,>(
  obj: {
    [key in string]: V;
  },
  fn: (v: V, k: string, i: number) => boolean
) =>
  Object.fromEntries(Object.entries<V>(obj).filter(([k, v], i) => fn(v, k, i)));

export const unixtime = () => Math.round(new Date().getTime() / 1000);

export const isUuid = (s: string | null): s is string =>
  !!s &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s
  );

const patterns = {
  1: "1",
  // 2桁の数値の 2桁目の数 + 1桁目の数 という意味になります
  2: "21",
  // 3桁の数値の 3桁目の数 + 2桁目の数 + 1桁目の数 という意味になります
  3: "321",
  4: "4,321",
  5: "5.43万",
  6: "65.4万",
  7: "765万",
  8: "8,765万",
  9: "9.87億",
  // 10桁目からは2桁で指定します
  10: "1009.08億",
  11: "111009億",
  12: "12,111009億",
  13: "13.1211兆",
  14: "1413.12兆",
  15: "151413兆",
};
export const formatNumber = (n?: number | null) => {
  if (undefinedOrNull(n)) return "";
  const s = String(Math.abs(n));
  const pattern =
    patterns[(n < 0 ? "-" : "") + s.length] ||
    (patterns[s.length] && `-${patterns[s.length]}`);
  return `${
    pattern
      ? pattern.replace(
          s.length < 10 ? /\d/g : /\d\d/g,
          (pos) => s[s.length - pos]
        )
      : n
  }`;
};

export const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);
export const intersperse = <T,>(
  arr: T[],
  sep: T | ((index: number) => T)
): T[] =>
  arr
    .reduce((a, v, i) => [...a, v, sep instanceof Function ? sep(i) : sep], [])
    .slice(0, -1);

export const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));
export const groupBy = <K, V>(
  array: readonly V[],
  getKey: (cur: V, idx: number, src: readonly V[]) => K
): [K, V[]][] =>
  Array.from(
    array.reduce((map, cur, idx, src) => {
      const key = getKey(cur, idx, src);
      const list = map.get(key);
      if (list) list.push(cur);
      else map.set(key, [cur]);
      return map;
    }, new Map<K, V[]>())
  );

export const isString = (obj: any): obj is string =>
  typeof obj === "string" || obj instanceof String;
