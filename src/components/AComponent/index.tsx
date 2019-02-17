import * as React from 'react';
import { inject, observer } from 'mobx-react';
import './index.scss';
import { IRootStore, IRootAction } from '../../typings/index';

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
  return {};
}

@inject(injector)
@observer
export default class AComponent extends React.Component<Props, {}> {
  static defaultProps = {
    prefixCls: 'component-a-component',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    let { prefixCls } = this.props;
    return <div className={prefixCls}>一个通用组件</div>;
  }
}
