// import './App/app'

import * as React from 'react';
import { render } from 'react-dom';
import proptypes from 'proptypes';

class Test extends React.Component<any, any> {
  static propTypes = {
    name: proptypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }
  componentDidMount() {
    this.setState({
      count: this.state.count + 1,
    });
  }
  render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        {this.state.count}
      </div>
    );
  }
}

render(<Test name="jim" />, document.getElementById('app'));
