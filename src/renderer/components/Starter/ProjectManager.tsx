import React from "react";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";

const handleNewProduct = () => {
  // modal.templateSelector();
  // Modal.confirm({
  //   title: "选择模板",
  //   onOk: () => {
  //     store.dispatch({
  //       type: UPDATE_SELECTED_TEMPLATE,
  //       payload: {
  //         template: templateList[0], // 暂选第1个模板
  //         uiVersion: templateList[0].uiVersions[1], // 暂选miui12
  //       },
  //     });
  //     history.push("editor");
  //   },
  // });
};

function ProjectManager(): JSX.Element {
  return (
    <StyleProjectManager>
      <div className="title">
        <h2>主题列表</h2>
        <p>新建、选择一个主题开始制作</p>
      </div>
      {/* 新建 */}
      <StyleAddProject onClick={handleNewProduct}>
        <PlusOutlined className="plus-icon" />
      </StyleAddProject>
      {/* 历史 */}
      <div className="product-list">
        <div className="product"></div>
      </div>
    </StyleProjectManager>
  );
}

const StyleProjectManager = styled.div`
  padding: 30px;
  .title {
    h2 {
      color: ${({ theme }) => theme["@text-color"]};
    }
    p {
      margin-top: 10px;
      font-size: 14px;
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
  }
`;

// 新建项目
const StyleAddProject = styled.div`
  position: relative;
  margin-top: 30px;
  width: 160px;
  height: 274px;
  border-radius: 10px;
  border: 1px solid;
  border-color: ${({ theme }) => theme["@disabled-color"]};
  background: ${({ theme }) => theme["@background-color"]};
  .plus-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    line-height: 100%;
    font-size: 30px;
    text-align: center;
    vertical-align: 50%;
    color: ${({ theme }) => theme["@text-color-secondary"]};
  }
  transition: 0.3s all;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
    transition: 0.3s all;
  }
`;

export default ProjectManager;
