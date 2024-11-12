import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
        --bg: #1A1A17;
        --border: #000;
        --main: white;
        --s: #FF7F7F;
        --a: #FFBF7E;
        --b: #FFDF80;
        --c: #FFFF7F;
        --d: #BFFF7F;
        --e: #7FFF7F;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-size: 10px;
    }

    div {
        color: var(--main);
    }

    button {
        background: none;
        border: none;
        outline: none;
    }
    
    input {
        border: none;
        outline: none;
        background: none;
        -moz-appearance: textfield;
        appearance: textfield;

        // Remove arrows from number input
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
            display: none;
        }
    }

    a {
        text-decoration: none;
    }
`;

const GlobalStyles = (): JSX.Element => {
  return <GlobalStyle />;
};

export default GlobalStyles;
