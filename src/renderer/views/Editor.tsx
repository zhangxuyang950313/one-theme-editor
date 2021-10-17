import React from "react";
import styled from "styled-components";
import { Button, Empty, Spin } from "antd";
import { useHistory } from "react-router";
import { useInitProject } from "@/hooks/project/index";
import { LOAD_STATUS } from "src/enum";
import EditorFrame from "@/components/Editor/index";

const Editor: React.FC = () => {
  const history = useHistory();
  const [projectData, status, handleFetch] = useInitProject();
  switch (status) {
    case LOAD_STATUS.INITIAL:
    case LOAD_STATUS.LOADING: {
      return (
        <StyleEditorEmpty>
          <Spin tip="加载中" />
        </StyleEditorEmpty>
      );
    }
    case LOAD_STATUS.FAILED:
    case LOAD_STATUS.UNKNOWN: {
      const isEmpty = projectData === null;
      return (
        <StyleEditorEmpty>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={isEmpty ? "暂无主题数据" : "加载失败"}
          />
          <div>
            <Button
              type="primary"
              onClick={() => {
                history.replace("/");
              }}
            >
              返回首页
            </Button>
            <span style={{ margin: "0 10px" }} />
            <Button
              type="primary"
              onClick={() => {
                handleFetch();
              }}
            >
              重试
            </Button>
          </div>
        </StyleEditorEmpty>
      );
    }
    // 进入编辑状态
    default: {
      return <EditorFrame />;
    }
  }
};

const StyleEditorEmpty = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default Editor;
