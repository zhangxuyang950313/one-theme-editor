import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { addProject, TypeProjectInfo } from "@/core/data";
import { useSelector } from "react-redux";
import { getBrandInfo } from "@/store/modules/normalized/selector";

import { getTemplateConfigList } from "@/core/template-compiler";

import { Modal, Button } from "antd";
import { TypeTemplateConfig } from "@/types/project";
import Steps from "../Steps";
import ProjectInfo from "../ProjectInfo";
import TemplateManager from "./TemplateManager";

type TypeProps = {
  refreshList: () => Promise<void>;
};

function CreateProject(props: TypeProps): JSX.Element {
  // 机型信息
  const [brandInfo] = useSelector(getBrandInfo);
  // 模板列表
  const [templateList, setTemplateList] = useState<TypeTemplateConfig[]>([]);
  // 弹框控制
  const [modalVisible, setModalVisible] = useState(false);
  // 当先选择的模板
  const [selectiveTemp, setSelectiveTemp] = useState<TypeTemplateConfig>();
  // 当前步骤
  const [curStep, setCurStep] = useState(0);

  // 获取模板列表
  useEffect(() => {
    getTemplateConfigList().then(setTemplateList);
  }, []);

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

  // 上一步
  const handlePrev = () => {
    if (curStep === 0) {
      setModalVisible(false);
      return;
    }
    setCurStep(curStep - 1);
  };

  // 下一步
  const handleNext = () => {
    if (curStep === 2) {
      // 创建工程
      handleAddProduct();
      return;
    }
    setCurStep(curStep + 1);
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
        width="700px"
        visible={modalVisible}
        title={`创建${brandInfo.name}主题`}
        destroyOnClose={true}
        okButtonProps={{ disabled: !selectiveTemp }}
        okText={curStep < 2 ? "下一步" : "开始"}
        cancelText={curStep > 0 ? "上一步" : "取消"}
        onOk={handleNext}
        onCancel={handlePrev}
        afterClose={() => setCurStep(0)}
      >
        <Steps steps={["选择模板", "填写信息", "开始创作"]} current={curStep} />
        <StyleStepContainer>
          {/* 选择模板 */}
          {curStep === 0 && (
            <TemplateManager
              templateList={templateList}
              selective={selectiveTemp}
              onSelected={setSelectiveTemp}
            />
          )}
          {/* 填写主题信息 */}
          {curStep === 1 && <ProjectInfo />}
        </StyleStepContainer>
      </Modal>
    </StyleCreateProject>
  );
}

const StyleCreateProject = styled.div``;

const StyleStepContainer = styled.div`
  padding: 10px 0;
  height: 50vh;
`;

export default CreateProject;
