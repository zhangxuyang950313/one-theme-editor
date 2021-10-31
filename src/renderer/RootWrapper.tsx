import logSymbols from "log-symbols";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

import "antd/dist/antd.css"; // antd 样式
// import zhCN from "antd/lib/locale/zh_CN"; // antd 中文

// import "@arco-design/theme-one-editor/css/arco.css"; // arco.design
import "@arco-design/web-react/dist/css/arco.css"; // arco.design

// import { ConfigProvider } from "antd";
import * as electronStore from "src/store";
import { GlobalStore } from "./store/global/index";
// import Router from "./router";
// import { useInitEditorConfig } from "./hooks";
// import { LOAD_STATUS } from "src/enum";
import DarkTheme from "./theme/dark";

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
  useEffect(() => {
    document.body.setAttribute("arco-theme", "dark");
    localStorage.setItem("debug", "socket.io-client:socket");
    console.log(logSymbols.success, `主进程id ${window.$server.getPID()}`);
    console.log(logSymbols.success, `渲染进程启动 ${process.pid}`);
    // localStorage.debug = "*.io-client:socket";
    // localStorage.debug = "*";
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
    &::-webkit-scrollbar {/*滚动条整体样式*/
      width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 5px;
    }

    &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 10px;
      background: ${({ theme }) => theme["@scrollbar-thumb"]};
    }

    &::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 10px;
      background: ${({ theme }) => theme["@scrollbar-track"]};
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
  .auto-margin {
    margin: auto;
  }
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
