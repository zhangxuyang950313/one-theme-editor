import React from "react";
import ReactDOM from "react-dom";
import { Provider, useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";

import { getWindowTitle } from "./store/modules/base/selector";
import logo from "./assets/logo.svg";
import store from "./store";

function App() {
  const windowTitle = useSelector(getWindowTitle);
  return (
    <StyleApp>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {windowTitle}
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </StyleApp>
  );
}

function Root(): JSX.Element {
  return (
    <React.StrictMode>
      <StyleGlobal />
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

const StyleApp = styled.div`
  .App {
    text-align: center;
  }

  .App-logo {
    height: 40vmin;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    .App-logo {
      animation: App-logo-spin infinite 20s linear;
    }
  }

  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }

  .App-link {
    color: #61dafb;
  }

  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyleGlobal = createGlobalStyle`
* {
    margin: 0;
  }
`;

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<Root />, document.getElementById("root"));
