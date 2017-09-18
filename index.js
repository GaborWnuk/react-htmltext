/**
 * Simple HTML to Text component
 * https://github.com/GaborWnuk
 * @flow
 */

import React, { PureComponent } from 'react';
import { addons, View, Text, StyleSheet, Platform } from 'react-native';
import entities from 'entities';
import htmlparser from 'htmlparser2';

import InstagramEmbed from 'react-native-instagram-embed';

const paragraph = '\n\n';

const baseFontStyle = {
  fontSize: 16,
  fontFamily: 'HelveticaNeue',
  lineHeight: 22,
};
const paragraphStyle = { ...baseFontStyle };
const boldStyle = { ...baseFontStyle, fontWeight: '500' };
const italicStyle = { ...baseFontStyle, fontStyle: 'italic' };
const codeStyle = { ...baseFontStyle, fontFamily: 'Menlo' };
const hrefStyle = { ...baseFontStyle, fontWeight: '500', color: '#007AFF' };

export default class HTMLText extends PureComponent {
  _mounted: boolean;
  _rendering: boolean;
  static defaultProps = {
    styles: StyleSheet.create({
      p: paragraphStyle,
      b: boldStyle,
      strong: boldStyle,
      i: italicStyle,
      em: italicStyle,
      pre: codeStyle,
      code: codeStyle,
      a: hrefStyle,
    }),
  };

  constructor() {
    super();

    this.state = {
      element: null,
    };

    this._mounted = false;
    this._rendering = false;
  }

  componentWillReceiveProps() {
    if (this.state.element) {
      return;
    }

    this.renderHTML();
  }

  componentDidMount() {
    this._mounted = true;

    this.renderHTML();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _onLayout = layout => {
    this.setState({ width: layout.nativeEvent.layout.width });
  };

  _htmlToComponent(done) {
    const handler = new htmlparser.DomHandler((error, dom) => {
      if (error) {
        done(error);
      }

      done(null, this._domToElement(dom));
    });

    const parser = new htmlparser.Parser(handler);
    parser.write(this.props.html);
    parser.done();
  }

  _domToElement(dom, parent) {
    if (!dom) {
      return null;
    }

    return dom.map((node, index, list) => {
      if (node.type == 'text') {
        return (
          <Text
            key={index}
            style={parent ? this.props.styles[parent.name] : null}
          >
            {entities.decodeHTML(node.data)}
          </Text>
        );
      }

      if (node.type == 'tag') {
        var callback = null;

        if (node.name == 'a' && node.attribs && node.attribs.href) {
          callback = () => {
            const url = entities.decodeHTML(node.attribs.href);

            if (this.props.onPress !== undefined) {
              this.props.onPress(url);
            } else {
              console.warn(
                'onPress callback is undefined. Touch on ' +
                  url +
                  " won't have any effect.",
              );
            }
          };
        }

        let instagramRegex = /instagram\.com\/p\/([a-zA-Z0-9]+)/g;
        if (
          Platform.OS != 'android' &&
          instagramRegex.test(node.attribs.href)
        ) {
          const { width } = this.props.style;

          return (
            <InstagramEmbed
              url={node.attribs.href}
              style={[{ height: 240 }, !!width ? { width: width } : {}]}
            />
          );
        }

        return (
          <Text key={index} onPress={callback}>
            {this._domToElement(node.children, node)}
            {node.name == 'p' && index < list.length - 1 ? paragraph : null}
          </Text>
        );
      }
    });
  }

  renderHTML() {
    if (!this.props.html || this._rendering) {
      return;
    }

    this._rendering = true;

    this._htmlToComponent((error: any, element) => {
      this._rendering = false;

      if (error) {
        return console.error(error);
      }

      if (this._mounted) {
        this.setState({ element: element });
      }
    });
  }

  render() {
    if (this.state.element) {
      const { style } = this.props;
      return (
        <Text
          children={this.state.element}
          onLayout={this._onLayout}
          style={style}
        />
      );
    }

    return <Text />;
  }
}
