import * as React from 'react';
import { render } from 'react-dom';
import { provider } from './mobx/provider';
import routes from './routes/routes.js';
import './mobxDependence';

@provider
class App extends React.Component<any, any> {
  static defaultProps = {
    prefixCls: 'app-container',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    let { prefixCls } = this.props;
    return (
      <div className={prefixCls}>
        <div onClick={() => console.log('this is a mobx project')} />
        {routes}
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
