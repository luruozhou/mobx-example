import * as React from 'react';
import { render } from 'react-dom';
import { provider } from './mobx/provider';
import routes from './routes/routes.js';
import './mobxDependence';

@provider
class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return routes;
  }
}

render(<App />, document.getElementById('app'));
