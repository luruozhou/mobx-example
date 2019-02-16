import {
  storeNameSymbol,
  appStoreKeySymbol,
  instanceType,
  storeTypeSymbol,
} from './meta';
import { App } from './app';

export let mStore = (config = { type: instanceType.singleton }) => target => {
  target[storeNameSymbol] = config.name || target.name || null;
  target[storeTypeSymbol] = config.type;
  App[appStoreKeySymbol] = App[appStoreKeySymbol] || [];
  App[appStoreKeySymbol].push({ target, name: config.name, page: config.page });
  return target;
};
