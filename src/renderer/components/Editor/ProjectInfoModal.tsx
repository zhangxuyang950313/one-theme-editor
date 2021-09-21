import React from "react";
import styled from "styled-components";
import { Form, Modal, ModalProps } from "antd";
import { useInfoTemplateConfig, useProjectInfo } from "@/hooks/project/index";
import { TypeProjectInfo } from "src/types/project";
import ProjectInfoForm from "../ProjectInfoForm";

const ProjectInfoModal: React.FC<ModalProps> = props => {
  const [form] = Form.useForm<TypeProjectInfo>();
  const projectInfo = useProjectInfo();
  const infoTemplate = useInfoTemplateConfig();
  return (
    <StyleProjectInfoModal
      {...props}
      onOk={e => {
        // TODO 写入 infoTemplate.content
        console.log(infoTemplate);
        if (props.onCancel) {
          props.onCancel(e);
        }
      }}
    >
      <ProjectInfoForm
        form={form}
        preserve={false}
        initialValues={projectInfo}
      />
    </StyleProjectInfoModal>
  );
};

const StyleProjectInfoModal = styled(Modal)``;

export default ProjectInfoModal;
