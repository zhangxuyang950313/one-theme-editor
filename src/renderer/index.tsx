import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

import "antd/dist/antd.css"; // antd 样式
import zhCN from "antd/lib/locale/zh_CN"; // antd 中文

import { ConfigProvider, Spin } from "antd";
import Router from "./router";
import store from "./store";
import LightTheme from "./theme/light";
import { useInitEditor } from "./hooks";

function Index(): JSX.Element {
  const loading = useInitEditor();
  return loading ? (
    <Spin className="auto-margin" tip="初始化..." spinning={loading} />
  ) : (
    <Router />
  );
}

function Root(): JSX.Element {
  return (
    <Provider store={store}>
      <StyleGlobal />
      <ThemeProvider theme={LightTheme}>
        <ConfigProvider locale={zhCN}>
          <StyleContainer>
            <Index />
          </StyleContainer>
        </ConfigProvider>
      </ThemeProvider>
    </Provider>
  );
}

const StyleGlobal = createGlobalStyle`
body,
html {
    margin: 0;
    user-select: none;
  }
`;

// 布局容器
const StyleContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => theme["@background-color"]};
  display: flex;
  .auto-margin {
    margin: auto;
  }
`;

// if (module.hot) module.hot.accept();

ReactDOM.render(<Root />, document.getElementById("root"));
