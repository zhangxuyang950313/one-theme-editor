import { useInfoTemplateConfig, useProjectInfo } from "@/hooks/project";
import { Form, Modal, ModalProps } from "antd";
import React from "react";
import { TypeProjectInfo } from "src/types/project";
import styled from "styled-components";
import ProjectInfoForm from "../ProjectInfoForm";

const ProjectInfoModal: React.FC<ModalProps> = props => {
  const [form] = Form.useForm<TypeProjectInfo>();
  const projectInfo = useProjectInfo();
  const infoTemplate = useInfoTemplateConfig();
  console.log(infoTemplate);
  return (
    <StyleProjectInfoModal
      {...props}
      onOk={() => {
        // TODO 写入 infoTemplate.content
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
