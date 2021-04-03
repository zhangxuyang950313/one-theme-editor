import React, { useState } from "react";
import styled from "styled-components";

import { addProject, TypeProjectInfo } from "@/core/data";
import { useSelector } from "react-redux";
import { getBrandInfo } from "@/store/modules/normalized/selector";

import { getTemplateConfigList } from "@/core/template-compiler";

import { Modal, Button } from "antd";
import { TypeTemplateConfig } from "@/types/project";
import Steps from "../Steps";
import TemplateManager from "./TemplateManager";

type TypeProps = {
  refreshList: () => Promise<void>;
};

function CreateProject(props: TypeProps): JSX.Element {
  const [brandInfo] = useSelector(getBrandInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectiveTemp, setSelectiveTemp] = useState<TypeTemplateConfig>();
  const [curStep, setCurStep] = useState(0);

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

  // 下一步
  const handleNext = () => {
    if (curStep < 2) {
      setCurStep(curStep + 1);
      return;
    }
    // 创建工程
    handleAddProduct();
  };
  return (
    <StyleCreateProject>
      <Button
        type="primary"
        onClick={() => {
          getTemplateConfigList().then(console.log);
          setModalVisible(true);
        }}
      >
        新建主题
      </Button>
      <Modal
        width="80%"
        visible={modalVisible}
        title={`创建${brandInfo.name}主题`}
        okButtonProps={{ disabled: !selectiveTemp }}
        okText={curStep < 2 ? "下一步" : "开始"}
        onOk={handleNext}
        onCancel={() => setModalVisible(false)}
      >
        <Steps steps={["选择模板", "填写信息", "开始制作"]} current={curStep} />
        <StyleStepContainer>
          {/* 选择模板 */}
          {curStep === 0 && <TemplateManager onSelected={setSelectiveTemp} />}
        </StyleStepContainer>
      </Modal>
    </StyleCreateProject>
  );
}

const StyleCreateProject = styled.div``;

const StyleStepContainer = styled.div`
  padding: 10px 0;
`;

export default CreateProject;
