import * as React from 'react';
import { inject, observer } from 'mobx-react';
import './index.scss';
import { IRootStore, IRootAction } from '../../typings/index';
import GoodsList from './goodsList';
import GoodsDetail from './goodsDetail';

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
    pageAction: rootAction.goods.demoAction,
  };
}

@inject(injector)
@observer
export default class Demo extends React.Component<Props, {}> {
  static defaultProps = {
    prefixCls: 'page-goods',
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let { pageAction } = this.props;
    await pageAction.init();
  }

  render() {
    let { prefixCls } = this.props;
    return (
      <div className={prefixCls}>
        <GoodsList />
        <GoodsDetail />
      </div>
    );
  }
}
