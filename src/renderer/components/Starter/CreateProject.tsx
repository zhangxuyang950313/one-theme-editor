import React, { useState } from "react";
import styled from "styled-components";

import { addProject, TypeProjectInfo } from "@/core/data";
import { useSelector } from "react-redux";
import { getBrandInfo } from "@/store/modules/normalized/selector";

import { Modal, Button } from "antd";
import Steps from "../Steps";

type TypeProps = {
  refreshList: () => Promise<void>;
};

function CreateProject(props: TypeProps): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const [brandInfo] = useSelector(getBrandInfo);
  // 创建新工程
  const handleAddProduct = async () => {
    const info: TypeProjectInfo = {
      name: "我的主题",
      description: "描述",
      designer: "默认",
      author: "默认",
      uiVersion: "V12"
    };
    return addProject(info).then(() => {
      setModalVisible(false);
      props.refreshList();
    });
  };
  return (
    <StyleCreateProject>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        新建主题
      </Button>
      <Modal
        className="modal"
        visible={modalVisible}
        title={`创建${brandInfo.name}主题`}
        onOk={handleAddProduct}
      >
        <Steps steps={["选择模板", "填写信息", "开始制作"]} current={1} />
      </Modal>
    </StyleCreateProject>
  );
}

const StyleCreateProject = styled.div`
  .modal {
    width: 80%;
  }
`;

export default CreateProject;
