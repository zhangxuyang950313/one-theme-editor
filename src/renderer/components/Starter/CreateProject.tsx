import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { addProject, TypeProjectInfo } from "@/core/data";
import { useSelector } from "react-redux";
import { getBrandInfo } from "@/store/modules/normalized/selector";

import { getTemplateConfigList } from "@/core/template-compiler";

import { Modal, Button, message } from "antd";
import { TypeTemplateConfig } from "@/types/project";
import Steps from "../Steps";
import ProjectInfo from "../ProjectInfo";
import TemplateManager from "./TemplateManager";
import TemplateCard from "./TemplateCard";

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

  // 创建主题步骤容器
  const StepContainer = () => {
    switch (curStep) {
      // 选择模板
      case 0: {
        return (
          <TemplateManager
            templateList={templateList}
            selective={selectiveTemp}
            onSelected={setSelectiveTemp}
          />
        );
      }
      // 填写主题信息
      case 1: {
        // 模板版本
        const uiVersions = selectiveTemp?.uiVersions;
        if (
          selectiveTemp && // 模板信息有效
          Array.isArray(uiVersions) &&
          uiVersions.length >= 0 // ui 版本信息有效
        ) {
          return (
            <StyleFillInfo>
              {/* 模板预览 */}
              <div className="template-card">
                <TemplateCard config={selectiveTemp} />
              </div>
              {/* 填写信息 */}
              <div className="project-info">
                <ProjectInfo uiVersions={uiVersions} />
              </div>
            </StyleFillInfo>
          );
        }
        message.info({ content: "模板版本信息错误", duration: 1000 });
        setCurStep(0);
        return null;
      }
      // 信息确认
      case 2: {
        return null;
      }
      default: {
        return null;
      }
    }
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
        afterClose={() => setCurStep(0)}
        onCancel={() => {
          const close = () => setModalVisible(false);
          if (curStep === 0) {
            close();
            return;
          }
          Modal.confirm({
            title: "提示",
            content: "填写的信息将不被保存，确定取消创建主题？",
            onOk: close
          });
        }}
        footer={[
          <Button key="prev" onClick={handlePrev}>
            {curStep > 0 ? "上一步" : "取消"}
          </Button>,
          <Button
            key="next"
            type="primary"
            onClick={handleNext}
            disabled={!selectiveTemp}
          >
            {curStep < 2 ? "下一步" : "开始"}
          </Button>
        ]}
      >
        <Steps steps={["选择模板", "填写信息", "开始创作"]} current={curStep} />
        <StyleStepContainer>
          <StepContainer />
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

const StyleFillInfo = styled.div`
  display: flex;
  padding: 10px;
  .template-card {
    flex-shrink: 0;
    width: 200px;
  }
  .project-info {
    width: 100%;
    margin-left: 30px;
  }
`;

export default CreateProject;
