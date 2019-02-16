import 'zone.js';
import {
  asyncManagerSymbol,
  storeWrappedSymbol,
  actionWrappedSymbol,
} from './meta';
import { defineHiddenProperty } from './utils';

export default class AsyncManager {
  static singleton = null;

  static getInstance() {
    if (!this.singleton) {
      new this();
    }

    return this.singleton;
  }

  zone;

  constructor() {
    if (AsyncManager.singleton !== null) return AsyncManager.singleton;

    this.init();
    AsyncManager.singleton = this;
  }

  init() {
    this.zone = Zone.root.fork({
      name: asyncManagerSymbol,
    });
  }

  wrapStore(storeInstance) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.storeHasWrapped(storeInstance)) {
        return;
      }

      let propKeys = this.getFunctionKeys(storeInstance);
      propKeys.forEach(prop => {
        if (typeof storeInstance[prop] === 'function') {
          storeInstance[prop] = this.wrapStoreFunc(
            storeInstance[prop],
            storeInstance,
            prop
          );
        }
      });
      defineHiddenProperty(storeInstance, storeWrappedSymbol, true);
    }
  }

  wrapStoreFunc = (fn, context, prop) => {
    return (...args) => {
      if (Zone.current !== this.zone) {
        console.error(
          `store ${context.constructor &&
            context.constructor.name} 的方法${prop}必须在action里调用`
        );
        return;
      }
      return fn.apply(context, args);
    };
  };

  storeHasWrapped(storeInstance) {
    return storeInstance && storeInstance[storeWrappedSymbol] === true;
  }

  actionHasWrapped(actionInstance) {
    return actionInstance && actionInstance[actionWrappedSymbol] === true;
  }

  wrapAction(actionInstance) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.actionHasWrapped(actionInstance)) {
        return;
      }
      let propKeys = this.getFunctionKeys(actionInstance);
      propKeys.forEach(prop => {
        if (typeof actionInstance[prop] === 'function') {
          actionInstance[prop] = this.wrapActionFunc(actionInstance, prop);
        }
      });

      defineHiddenProperty(actionInstance, actionWrappedSymbol, true);
    }
  }

  wrapActionFunc(action, prop) {
    let origin = action[prop];
    return (...args) => {
      return this.zone.run(origin, action, args);
    };
  }

  getFunctionKeys(obj) {
    //获取实例和原型上的属性
    let objProto = Object.getPrototypeOf(obj) || obj.__proto__;
    let propKeys = [
      ...Object.keys(obj),
      ...Object.getOwnPropertyNames(objProto),
    ];
    propKeys = Array.from(new Set(propKeys));
    propKeys = propKeys.filter(key => key !== 'constructor');
    return propKeys;
  }
}
