export const storeNameSymbol = getSymbol('store-name');
export const storeTypeSymbol = getSymbol('store-type');
export const storeInstanceSymbol = getSymbol('store-instance'); //多实例缓存
export const singleInstanceSymbol = getSymbol('single-instance'); //单实例缓存
export const getInstanceFuncSymbol = getSymbol('get-instance-func'); //多实例根据key获取实例
export const actionNameSymbol = getSymbol('action-name');
export const actionTypeSymbol = getSymbol('action-type');
export const appStoreKeySymbol = getSymbol('app-store-key');
export const appActionKeySymbol = getSymbol('app-action-key');

export const asyncManagerSymbol = getSymbol('async-manager');
export const storeWrappedSymbol = getSymbol('store-has-wrapped');
export const actionWrappedSymbol = getSymbol('action-has-wrapped');

export const instanceType = {
  singleton: getSymbol('singleton'),
  multi: getSymbol('multi'),
};

function getSymbol(name) {
  return typeof Symbol !== 'undefined' ? Symbol(name) : `__symbol-${name}__`;
}
