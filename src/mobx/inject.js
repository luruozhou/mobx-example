import React, { Component } from 'react';
import { observer, inject as mobxInject } from 'mobx-react';

export const inject = f => wrappedComponent => {
  return class WrapperComponent extends Component {
    constructor(props) {
      super(props);
    }

    getNode = injector => {
      this.node = injector && injector.wrappedInstance;
    };

    render() {
      const props = this.props;
      props.ref = this.getNode;

      let element = React.createElement(
        mobxInject(f)(observer(wrappedComponent)),
        props
      );
      return element;
    }
  };
};
