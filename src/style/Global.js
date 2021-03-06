import styled, { createGlobalStyle } from 'styled-components'

const Global = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Amatic+SC:400,700|Mansalva:400,700|Montserrat:400,500,700|Caveat+Brush:400,500,700|Just+Me+Again+Down+Here:400,500,700');
  html > body > #root {
    height: min-content;
  }
  html {
    font-size: 62.5%;
    @media only screen and (max-width: 400px) {
      font-size: 56.25%;
    }
  }
  *, *::after, *::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  body {
    box-sizing: border-box;
    overflow-x: hidden;
  }

`

// font-family: 'Roboto', 'Source Serif Pro','Source Code Pro', monospace;
// font-weight: 400;
// line-height: 1.2;
// letter-spacing: .2rem;

export default Global
