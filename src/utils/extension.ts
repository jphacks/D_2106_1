export {};

type Resolver<T> = (item: T) => any;
type Indexer<T> = number | keyof T | symbol;
export type ValueResolver<T> = Indexer<T> | Resolver<T>;

if (!String.prototype.hasOwnProperty("replaceAll")) {
  // @ts-ignore
  String.prototype.replaceAll = function (searchValue: string | RegExp, replaceValue: string) {
    return this.split(searchValue).join(replaceValue);
  };
}

if (!Array.prototype.hasOwnProperty("first")) {
  Array.prototype.first = function (predicate: (element) => boolean = () => true) {
    for (var i: number = 0; i < this.length; i++) {
      if (predicate(this[i])) return this[i];
    }
    return undefined;
  };
}

if (!Array.prototype.hasOwnProperty("last")) {
  Array.prototype.last = function (predicate: (element) => boolean = () => true) {
    for (var i: number = this.length; i-- > 0; ) {
      if (predicate(this[i])) return this[i];
    }
    return undefined;
  };
}

if (!Array.prototype.hasOwnProperty("uniqueBy")) {
  Array.prototype.uniqueBy = function <T>(this: T[], valueResolver?: ValueResolver<T>) {
    if (!(valueResolver != null)) return [...new Set(this)];

    const key = typeof valueResolver !== "function" && valueResolver,
      map = new Map<any, T>();

    valueResolver = key ? (item: Record<Indexer<T>, any>) => item?.[key] ?? item : valueResolver;

    for (const item of this) {
      const key = (valueResolver as Resolver<T>)(item);

      if (!map.has(key)) map.set(key, item);
    }

    return [...map.values()];
  };
}
