import HomeStore from '../pages/home/stores/homeStore';
import HomeAction from '../pages/home/actions/homeAction';
import { IStoresToProps, IReactComponent, IWrappedComponent } from 'mobx-react';

export interface IRootStore {
  home: {
    homeStore: HomeStore;
  };
}

export interface IRootAction {
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
