export const defineReadOnlyProperty = (
  target,
  name,
  value,
  message = 'property is readonly'
) => {
  Object.defineProperty(target, name, {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set() {
      throw Error(message);
    },
  });
};

export const defineHiddenProperty = (target, name, value) => {
  Object.defineProperty(target, name, {
    configurable: true,
    enumerable: false,
    writable: false,
    value,
  });
};

export function firstToLowercase(str) {
  return str.charAt(0).toLowerCase() + str.substr(1);
}

export function isPromiseLike(p) {
  if (
    p &&
    typeof p === 'object' &&
    typeof p.then === 'function' &&
    typeof p.catch === 'function'
  ) {
    return true;
  }
  return false;
}
