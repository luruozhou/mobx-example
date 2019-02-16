import invariant from 'invariant';
import {
  instanceType,
  storeTypeSymbol,
  storeInstanceSymbol,
  getInstanceFuncSymbol,
  singleInstanceSymbol,
  appActionKeySymbol,
  appStoreKeySymbol,
} from './meta';
import { defineReadOnlyProperty, firstToLowercase } from './utils';
import AsyncManager from './zone';

export class App {
  rootStore = {};
  rootAction = {};

  constructor() {
    this.asyncManager = AsyncManager.getInstance();
    this.processStores();
    this.processActions();
  }

  processStores() {
    let scannedStores = (App[appStoreKeySymbol] || []).reduce((ret, item) => {
      ret[item.page] = ret[item.page] || {};
      ret[item.page][item.name] = item.target;
      return ret;
    }, {});

    //扫描的文件
    Object.keys(scannedStores).forEach(pageKey => {
      invariant(
        !this.rootStore[pageKey],
        `dumplicated page or component name for ${pageKey}`
      );

      defineReadOnlyProperty(this.rootStore, pageKey, {});

      let pageStore = scannedStores[pageKey];
      this.processPageStore(pageStore, this.rootStore[pageKey]);
    });
  }

  processPageStore(pageStore, finalPageStore) {
    Object.keys(pageStore).forEach(storeKey => {
      this.processSingleStore(pageStore[storeKey], storeKey, finalPageStore);
    });
  }

  processSingleStore(storeClassOrInstance, storeKey, finalPageStore) {
    let asyncManager = this.asyncManager;
    if (typeof storeClassOrInstance == 'function') {
      if (
        storeClassOrInstance[storeTypeSymbol] === instanceType.singleton ||
        storeClassOrInstance[storeTypeSymbol] === undefined
      ) {
        Object.defineProperty(finalPageStore, firstToLowercase(storeKey), {
          configurable: true,
          enumerable: true,
          get() {
            storeClassOrInstance[singleInstanceSymbol] =
              storeClassOrInstance[singleInstanceSymbol] ||
              new storeClassOrInstance();

            asyncManager.wrapStore(storeClassOrInstance[singleInstanceSymbol]);

            return storeClassOrInstance[singleInstanceSymbol];
          },
          set() {
            throw Error('can not set store again');
          },
        });
      } else {
        this.processMultiInstance(storeClassOrInstance);

        Object.defineProperty(finalPageStore, firstToLowercase(storeKey), {
          configurable: true,
          enumerable: true,
          get() {
            return storeClassOrInstance[getInstanceFuncSymbol];
          },
          set() {
            throw Error('can not set store again');
          },
        });
      }
    } else {
      asyncManager.wrapStore(storeClassOrInstance);
      defineReadOnlyProperty(
        finalPageStore,
        firstToLowercase(storeKey),
        storeClassOrInstance
      );
    }
  }

  processMultiInstance(storeClassOrInstance) {
    let asyncManager = this.asyncManager;

    storeClassOrInstance[storeInstanceSymbol] =
      storeClassOrInstance[storeInstanceSymbol] || {};

    storeClassOrInstance[getInstanceFuncSymbol] =
      storeClassOrInstance[getInstanceFuncSymbol] ||
      function(uniqueKey) {
        storeClassOrInstance[storeInstanceSymbol][uniqueKey] =
          storeClassOrInstance[storeInstanceSymbol][uniqueKey] ||
          new storeClassOrInstance();

        asyncManager.wrapStore(
          storeClassOrInstance[storeInstanceSymbol][uniqueKey]
        );

        return storeClassOrInstance[storeInstanceSymbol][uniqueKey];
      };
  }

  processActions() {
    let scannedActions = (App[appActionKeySymbol] || []).reduce((ret, item) => {
      ret[item.page] = ret[item.page] || {};
      ret[item.page][item.name] = item.target;
      return ret;
    }, {});
    Object.keys(scannedActions).forEach(pageKey => {
      defineReadOnlyProperty(this.rootAction, pageKey, {});

      let pageAction = scannedActions[pageKey];
      let pageStore = this.rootStore[pageKey];
      this.processPageAction(pageAction, this.rootAction[pageKey], pageStore);
    });
  }

  processPageAction(pageAction, finalPageAction, pageStore) {
    Object.keys(pageAction).forEach(actionKey => {
      this.processSingleAction(
        pageAction[actionKey],
        actionKey,
        finalPageAction,
        pageStore
      );
    });
  }

  processSingleAction(
    actionClassOrInstance,
    actionKey,
    finalPageAction,
    pageStore
  ) {
    let asyncManager = this.asyncManager;

    if (typeof actionClassOrInstance == 'function') {
      Object.defineProperty(finalPageAction, firstToLowercase(actionKey), {
        configurable: true,
        enumerable: true,
        get() {
          actionClassOrInstance[singleInstanceSymbol] =
            actionClassOrInstance[singleInstanceSymbol] ||
            new actionClassOrInstance(
              pageStore,
              finalPageAction,
              this.rootStore,
              this.rootAction
            );

          asyncManager.wrapAction(actionClassOrInstance[singleInstanceSymbol]);

          return actionClassOrInstance[singleInstanceSymbol];
        },
        set() {
          throw Error('can not set action again');
        },
      });
    } else {
      asyncManager.wrapAction(actionClassOrInstance);

      defineReadOnlyProperty(
        finalPageAction,
        firstToLowercase(actionKey),
        actionClassOrInstance
      );
    }
  }
}

let app = null;

export function createApp() {
  app = app || new App();
  return app;
}
