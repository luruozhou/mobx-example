import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { createApp } from './app';

export const provider = WrapComponentOrElement => {
  let app = createApp();

  if (React.isValidElement(WrapComponentOrElement)) {
    let componentName = getDisplayName(WrapComponentOrElement.type);

    return (
      <Provider
        rootStore={app.rootStore}
        rootAction={app.rootAction}
        suppressChangedStoreWarning={true}
      >
        {WrapComponentOrElement}
      </Provider>
    );
  } else {
    return class WrapperComponent extends Component {
      static displayName = `Provider(${getDisplayName(
        WrapComponentOrElement
      )})`;

      constructor(props) {
        super(props);
      }

      componentWillReceiveProps(nextProps) {}

      render() {
        const props = this.props;
        return (
          <Provider
            rootStore={app.rootStore}
            rootAction={app.rootAction}
            suppressChangedStoreWarning={true}
          >
            <WrapComponentOrElement {...props}>
              {this.props.children}
            </WrapComponentOrElement>
          </Provider>
        );
      }
    };
  }
};

export function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
