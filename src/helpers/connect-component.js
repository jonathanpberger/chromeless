/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// External Dependencies
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { styled } from '@mui/material/styles';

const connectComponent = (component, mapStateToProps, actionCreators, stylesFunc) => {
  // Adds `on` to binded action names
  const onActionCreators = {};
  if (actionCreators) {
    Object.keys(actionCreators).forEach((key) => {
      const newKey = `on${key[0].toUpperCase()}${key.substring(1, key.length)}`;
      onActionCreators[newKey] = actionCreators[key];
    });
  }

  // Apply styling with MUI v5's styled API if styles are provided
  const StyledComponent = stylesFunc
    ? styled(component, {
        name: component.displayName || component.name,
      })(stylesFunc)
    : component;

  return connect(
    mapStateToProps,
    (dispatch) => bindActionCreators(onActionCreators, dispatch),
  )(StyledComponent);
};

export default connectComponent;