import logSymbols from "log-symbols";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

import "antd/dist/antd.css"; // antd 样式
// import zhCN from "antd/lib/locale/zh_CN"; // antd 中文

import "@arco-design/theme-one-editor/css/arco.css"; // arco.design
// import "@arco-design/web-react/dist/css/arco.css"; // arco.design

// import { ConfigProvider } from "antd";
import * as electronStore from "src/store";
import DarkTheme from "src/common/theme/dark";
import { GlobalStore } from "./store/global/index";
// import Router from "./router";
// import { useInitEditorConfig } from "./hooks";
// import { LOAD_STATUS } from "src/enum";

// const Index: React.FC = () => {
//   // const socket = useSocket();
//   const [status] = useInitEditorConfig();
//   switch (status) {
//     case LOAD_STATUS.INITIAL:
//     case LOAD_STATUS.LOADING: {
//       return <Spin className="auto-margin" tip="初始化" spinning />;
//     }
//     // TODO
//     case LOAD_STATUS.FAILED: {
//       return <div>出错了</div>;
//     }
//     case LOAD_STATUS.SUCCESS:
//     default:
//       return <Router />;
//   }
// };

const Root: React.FC = props => {
  const [theme, setTheme] = useState(DarkTheme);
  useLayoutEffect(() => {
    document.body.setAttribute("arco-theme", "dark");
  }, []);
  useEffect(() => {
    console.log(logSymbols.success, `主进程id ${window.$one.$server.getPID()}`);
    console.log(logSymbols.success, `渲染进程启动 ${process.pid}`);
    console.log("process.versions.electron", process.versions.electron); // electron 版本
    console.log("process.versions.modules", process.versions.modules); // ABI版本
    console.log("process.versions.node", process.versions.node); // NODE版本
    console.log("process.versions.v8", process.versions.v8); // V8 引擎版本
    console.log("process.versions.chrome", process.versions.chrome); // chrome版本
    electronStore.config.set("themeConfig", DarkTheme);
    const thm = electronStore.config.get("themeConfig");
    if (thm) setTheme(thm);
  }, []);
  return (
    <Provider store={GlobalStore.store}>
      <ThemeProvider theme={theme}>
        <StyleGlobal />
        {/* <ConfigProvider locale={zhCN}> */}
        <StyleContainer>{props.children}</StyleContainer>
        {/* </ConfigProvider> */}
      </ThemeProvider>
    </Provider>
  );
};

const StyleGlobal = createGlobalStyle`
  body,
  html {
      margin: 0;
      user-select: none;
      /* -webkit-app-region: drag; */
  }
  body {
    overflow: hidden;
  }
  *{
    .arco-btn-primary:not(.arco-btn-disabled){
      color: var(--color-bg-1);
    }
    .arco-btn-primary:not(.arco-btn-disabled):not(.arco-btn-loading):hover {
      color: var(--color-bg-1);
    }
    &::-webkit-scrollbar {/*滚动条整体样式*/
      width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 5px;
    }

    &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 10px;
      background-color: var(--color-border-4);
    }

    &::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 10px;
      background-color: var(--color-border-2);
    }
  }
`;

// 布局容器
const StyleContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-bg-1);
  display: flex;
`;

// if (module.hot) module.hot.accept();

export default function RootWrapper(Index: React.FC): void {
  ReactDOM.render(
    <Root>
      <Index />
    </Root>,
    document.getElementById("root")
  );
}
