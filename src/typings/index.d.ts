import AComponentStore from '../components/AComponent/stores/aComponentStore';
import GoodsStore from '../pages/goods/stores/goodsStore';
import GoodsDetailStore from '../pages/goods/stores/goodsDetailStore';
import GoodsListStore from '../pages/goods/stores/goodsListStore';
import AComponentAction from '../components/AComponent/actions/aComponentAction';
import GoodsAction from '../pages/goods/actions/goodsAction';
import GoodsDetailAction from '../pages/goods/actions/goodsDetailAction';
import GoodsListAction from '../pages/goods/actions/goodsListAction';
import { IStoresToProps, IReactComponent, IWrappedComponent } from 'mobx-react';

export interface IRootStore {
  AComponent: {
    aComponentStore: AComponentStore;
  };
  goods: {
    goodsStore: GoodsStore;
    goodsDetailStore: GoodsDetailStore;
    goodsListStore: GoodsListStore;
  };
}

export interface IRootAction {
  AComponent: {
    aComponentAction: AComponentAction;
  };
  goods: {
    goodsAction: GoodsAction;
    goodsDetailAction: GoodsDetailAction;
    goodsListAction: GoodsListAction;
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
