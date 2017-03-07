import React from 'react';
import { View, StyleSheet } from 'react-native';
import HTMLText from '../';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<HTMLText />);
});
