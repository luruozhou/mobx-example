import DemoStore from '../pages/goods/stores/demoStore';
import GoodsDetailStore from '../pages/goods/stores/goodsDetailStore';
import GoodsListStore from '../pages/goods/stores/goodsListStore';
import HomeStore from '../pages/home/stores/homeStore';
import DemoAction from '../pages/goods/actions/demoAction';
import GoodsDetailAction from '../pages/goods/actions/goodsDetailAction';
import GoodsListAction from '../pages/goods/actions/goodsListAction';
import HomeAction from '../pages/home/actions/homeAction';
import { IStoresToProps, IReactComponent, IWrappedComponent } from 'mobx-react';

export interface IRootStore {
  goods: {
    demoStore: DemoStore;
    goodsDetailStore: GoodsDetailStore;
    goodsListStore: GoodsListStore;
  };
  home: {
    homeStore: HomeStore;
  };
}

export interface IRootAction {
  goods: {
    demoAction: DemoAction;
    goodsDetailAction: GoodsDetailAction;
    goodsListAction: GoodsListAction;
  };
  home: {
    homeAction: HomeAction;
  };
}

export interface IInject {
  rootStore: IRootStore;
  rootAction: IRootAction;
}

declare module 'mobx-react' {
  export type IValueMapSelf = IStoresToProps<IInject>;

  export function inject<S extends IInject, P, I, C>(
    fn: IStoresToProps<S, P, I, C>
  ): <T extends IReactComponent>(target: T) => T & IWrappedComponent<P>;
}
