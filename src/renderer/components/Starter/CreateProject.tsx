import React, { useState } from "react";
import styled from "styled-components";

import _ from "lodash";
import { useSelector } from "react-redux";
import { getBrandInfo } from "@/store/modules/template/selector";
import { createProject } from "@/core/data";
import { TypeTemplateConfig, TypeProjectInfo } from "@/types/project";

// components
import { Modal, Button, message, Form } from "antd";
import Steps from "@/components/Steps";
import ProjectInfo from "@/components/ProjectInfo";
import ProjectInfoForm from "@/components/ProjectInfoForm";
import { useTemplateList } from "@/hooks/template";
import TemplateManager from "./TemplateManager";
import TemplateCard from "./TemplateCard";
import ProjectCard from "./ProjectCard";

// 创建主题按钮
type TypeProps = {
  onProjectCreated: (projectInfo: TypeProjectInfo) => Promise<void>;
};
function CreateProject(props: TypeProps): JSX.Element {
  // 机型信息
  const brandInfo = useSelector(getBrandInfo);
  // 弹框控制
  const [modalVisible, setModalVisible] = useState(false);
  // 选择的模板
  const [templateConfig, setTemplateConf] = useState<TypeTemplateConfig>();
  // 当前步骤
  const [curStep, setCurStep] = useState(0);
  // 填写完成的项目数据
  const [projectInfo, setProjectInfo] = useState<TypeProjectInfo>();
  // 表单实例
  const [form] = Form.useForm<TypeProjectInfo>();

  // 表单默认值
  const initialValues = {
    name: "",
    designer: "",
    author: "",
    version: "1.0.0",
    uiVersion: _.last(templateConfig?.uiVersions)?.src || ""
  };

  // 模板列表
  const templateList = useTemplateList(brandInfo);

  // 步骤控制
  const nextStep = () => setCurStep(curStep + 1);
  const prevStep = () => setCurStep(curStep - 1);
  const jumpStep = (step: number) => setCurStep(step);

  // 弹框控制
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // 复位
  const init = () => {
    jumpStep(0);
    setTemplateConf(undefined);
    setProjectInfo(undefined);
    form.resetFields();
  };

  // 开始创建主题
  const handleCreateProject = () => {
    // getTemplateConfigList().then(console.log);
    // init();
    openModal();
  };

  // 上一步
  const handlePrev = () => {
    if (curStep === 0) {
      handleCancel();
      return;
    }
    prevStep();
  };

  // 下一步
  const handleNext = () => {
    // 校验表单
    if (curStep === 1) {
      form
        .validateFields()
        .then(data => {
          setProjectInfo(data);
          nextStep();
        })
        .catch(() => {
          //
        });
      return;
    }
    // 创建工程
    if (curStep === 2) {
      if (!projectInfo || !templateConfig) {
        message.warn({
          content: "创建失败",
          duration: 1000
        });
        return;
      }
      createProject({
        brandInfo,
        projectInfo,
        templateConfig,
        projectResource: {}
      }).then(data => {
        console.log("创建工程：", data);
        props.onProjectCreated(data.projectInfo);
        closeModal();
        init();
      });
      return;
    }
    nextStep();
  };

  // 主动关闭
  const handleCancel = () => {
    Modal.confirm({
      title: "提示",
      content: "填写的信息将不被保存，确定取消创建主题？",
      onOk: () => {
        closeModal();
        init();
      }
    });
  };

  // 弹框底部控制按钮
  const modalFooter = [
    <Button key="prev" onClick={curStep > 0 ? handlePrev : handleCancel}>
      {curStep > 0 ? "上一步" : "取消"}
    </Button>,
    <Button
      key="next"
      type="primary"
      onClick={handleNext}
      disabled={!templateConfig}
    >
      {curStep < 2 ? "下一步" : "开始"}
    </Button>
  ];

  // 创建主题步骤容器
  const StepContainer = () => {
    switch (curStep) {
      // 选择模板
      case 0: {
        return (
          <TemplateManager
            templateList={templateList}
            selective={templateConfig}
            onSelected={setTemplateConf}
          />
        );
      }
      // 填写主题信息
      case 1: {
        // 模板版本
        const uiVersions = templateConfig?.uiVersions;
        if (
          templateConfig && // 模板信息有效
          Array.isArray(uiVersions) &&
          uiVersions.length >= 0 // ui 版本信息有效
        ) {
          return (
            <StyleFillInfo>
              {/* 模板预览 */}
              <div className="template-card">
                <TemplateCard config={templateConfig} />
              </div>
              {/* 填写信息 */}
              <div className="project-info">
                <ProjectInfoForm
                  uiVersions={uiVersions}
                  form={form}
                  initialValues={initialValues}
                />
              </div>
            </StyleFillInfo>
          );
        }
        message.info({ content: "模板版本信息错误", duration: 1000 });
        jumpStep(0);
        return null;
      }
      // 信息确认
      case 2: {
        return (
          <StyleConfirmInfo>
            <div className="template-card">
              <ProjectCard projectInfo={form.getFieldsValue()} />
            </div>
            <div className="project-info">
              <ProjectInfo projectInfo={form.getFieldsValue()} />
            </div>
          </StyleConfirmInfo>
        );
      }
      default: {
        return null;
      }
    }
  };
  return (
    <StyleCreateProject>
      <Button type="primary" onClick={handleCreateProject}>
        新建主题
      </Button>
      <Modal
        style={{ minWidth: "500px" }}
        width="700px"
        visible={modalVisible}
        title={`创建${brandInfo.name}主题`}
        destroyOnClose={true}
        onCancel={() => closeModal()}
        footer={modalFooter}
      >
        <Steps steps={["选择模板", "填写信息", "开始创作"]} current={curStep} />
        <br />
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

const StyleConfirmInfo = styled(StyleFillInfo)``;

export default CreateProject;
