import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class SwissProvider extends PureComponent {
  getChildContext() {
    const { controller } = this.props;

    return { swissController: controller };
  }
  render() {
    const { children } = this.props;
    return children;
  }
}

SwissProvider.childContextTypes = {
  swissController: PropTypes.object,
};
SwissProvider.propTypes = {
  swiss: PropTypes.object,
  children: PropTypes.element,
};