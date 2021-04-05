import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

import "antd/dist/antd.css"; // antd 样式
import zhCN from "antd/lib/locale/zh_CN"; // antd 中文

import { ConfigProvider } from "antd";
import Router from "./router";
import store from "./store";
import LightTheme from "./theme/light";

function Root(): JSX.Element {
  return (
    <Provider store={store}>
      <StyleGlobal />
      <ThemeProvider theme={LightTheme}>
        <StyleContainer>
          <ConfigProvider locale={zhCN}>
            <Router />
          </ConfigProvider>
        </StyleContainer>
      </ThemeProvider>
    </Provider>
  );
}

const StyleGlobal = createGlobalStyle`
* {
    margin: 0;
  }
`;

// 布局容器
const StyleContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => theme["@background-color"]};
`;

if (module.hot) module.hot.accept();

ReactDOM.render(<Root />, document.getElementById("root"));
