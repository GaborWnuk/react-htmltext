# react-htmltext
[![Build Status](https://travis-ci.org/GaborWnuk/react-htmltext.svg?branch=master)](https://travis-ci.org/GaborWnuk/react-htmltext)

HTML to Text component for React (Native)

![Preview](https://raw.githubusercontent.com/GaborWnuk/react-htmltext/master/images/preview.png)

## What is it for?
Main problem we've faced during development was how unreliable WebView was in Android and iOS. In a matter of fact it was slow and on Android - unusable, due to no way we could measure content height properly.

This tiny piece of code takes your simple html documents and converts into native React (Native) components. To be honest - it was tested on React Native only, so i have no idea wether it's of any use for web guys.

It was written in about 2 hours. Can it be prettier? Sure. Does it fit our needs? 100%. Feel free to contribute.

## How does it work?

```javascript
render() {
  const html = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
    'sed do eiusmod tempor <a href="">incididunt</a> ut labore et dolore magna aliqua.</p>' +
    "<p>Ut <strong>enim ad minim veniam, quis nostrud exercitation</strong> ullamco laboris " +
    "nisi ut aliquip ex ea commodo consequat. </p>" +
    "<p>Duis aute <code>irure dolor in reprehenderit</code> in voluptate velit esse cillum" +
    "dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, " +
    "sunt in culpa qui officia deserunt mollit anim id est laborum.</p>";

  const baseFontStyle = {
    fontSize: 16,
    fontFamily: "HelveticaNeue",
    lineHeight: 22,
  };
  const paragraphStyle = { ...baseFontStyle };
  const boldStyle = { ...baseFontStyle, fontWeight: "500" };
  const italicStyle = { ...baseFontStyle, fontStyle: "italic" };
  const codeStyle = { ...baseFontStyle, fontFamily: "Menlo" };
  const hrefStyle = { ...baseFontStyle, fontWeight: "500", color: "#007AFF" };

  const styles = {
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

  return (
    <HTMLText
      html={html}
      onPress={url => {
        //Code below will be executed when you tap on a link.
        console.log(url);
      }}
    />
  );
}
```

## Installation

Use your favourite packager:

```
npm i --save react-htmltext
```

or

```
yarn add react-htmltext
```

## License
MIT.
