import * as React from 'react';
import { inject, observer } from 'mobx-react';
import './index.scss';
import { IRootStore, IRootAction } from '../../../typings/index';

type injectorReturnType = ReturnType<typeof injector>;

interface Props extends Partial<injectorReturnType> {
  prefixCls?: string;

  [k: string]: any;
}

function injector({
  rootStore,
  rootAction,
}: {
  rootStore: IRootStore;
  rootAction: IRootAction;
}) {
  return {
    pageStore: rootStore.goods,
    pageAction: rootAction.goods,
  };
}

@inject(injector)
@observer
export default class GoodsList extends React.Component<Props, {}> {
  static defaultProps = {
    prefixCls: 'page-goods__goods-list',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onSelectGoods = goods => {
    let { pageAction, pageStore } = this.props;

    // pageStore.goodsDetailStore.setLoading(true); //如果在组件内直接调用store的方法，会给出无效的提示
    pageAction.goodsListAction.setCurrentGoods(goods);
  };

  render() {
    let { prefixCls, pageStore } = this.props;
    return (
      <div className={prefixCls}>
        <ul>
          {pageStore.goodsListStore.goodsList.map(goods => {
            return (
              <li
                key={goods.id}
                onClick={this.onSelectGoods.bind(this, goods)}
                className={
                  pageStore.goodsDetailStore.currentGoods &&
                  pageStore.goodsDetailStore.currentGoods.id === goods.id
                    ? 'active'
                    : ''
                }
              >
                {goods.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
