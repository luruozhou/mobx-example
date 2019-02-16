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
export default class GoodsDetail extends React.Component<Props, {}> {
  static defaultProps = {
    prefixCls: 'page-demo__goods-detail',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    let { prefixCls, pageStore } = this.props;

    let currentGoods = pageStore.goodsDetailStore.currentGoods;

    if (pageStore.goodsDetailStore.loading) {
      return <h3>loading...</h3>;
    }
    return (
      <div className={prefixCls}>
        <h1>{currentGoods && currentGoods.name}</h1>
        <p>{currentGoods && currentGoods.desc}</p>
        <img src={currentGoods && currentGoods.img} alt="" />
      </div>
    );
  }
}
