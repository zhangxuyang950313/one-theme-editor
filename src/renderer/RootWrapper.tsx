import React, { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

import "antd/dist/antd.css"; // antd 样式
// import zhCN from "antd/lib/locale/zh_CN"; // antd 中文

import "@arco-design/theme-one-editor/css/arco.css"; // arco.design
// import "@arco-design/web-react/dist/css/arco.css"; // arco.design

// import { ConfigProvider } from "antd";
import LogUtil from "src/common/utils/LogUtil";
// import * as electronStore from "src/store";
import DarkTheme from "src/common/theme/dark";

import { RecoilRoot, useRecoilSnapshot } from "recoil";

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

function useDebugObserver() {
  const snapshot = useRecoilSnapshot();
  useLayoutEffect(() => {
    console.debug("The following atoms were modified:");
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);
}

function useLogInfo() {
  useLayoutEffect(() => {
    LogUtil.init("[version]electron", process.versions.electron); // electron 版本
    LogUtil.init("[version]modules", process.versions.modules); // ABI版本
    LogUtil.init("[version]node", process.versions.node); // NODE版本
    LogUtil.init("[version]v8", process.versions.v8); // V8 引擎版本
    LogUtil.init("[version]chrome", process.versions.chrome); // chrome版本
    LogUtil.init("[type]process", process.type);
    LogUtil.init(`[pid]main`, window.$one.$server.getPID());
    LogUtil.init(`[pid]render`, process.pid);
  }, []);
}

function useTheme() {
  const [theme, setTheme] = useState(DarkTheme);
  useLayoutEffect(() => {
    document.body.setAttribute("arco-theme", "dark");
    // electronStore.config.set("themeConfig", DarkTheme);
    // const thm = electronStore.config.get("themeConfig");
    // if (thm) setTheme(thm);
  }, []);
  return theme;
}

const Root: React.FC = props => {
  const theme = useTheme();
  useLogInfo();
  useDebugObserver();
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
    <RecoilRoot>
      <Root>
        <Index />
      </Root>
    </RecoilRoot>,
    document.getElementById("root")
  );
}
