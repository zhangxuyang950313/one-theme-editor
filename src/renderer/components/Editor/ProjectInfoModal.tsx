import path from "path";
import fse from "fs-extra";
import React from "react";
import { Form, Modal, ModalProps } from "antd";
import { useProjectInfoConfig } from "@/hooks/project/index";
import { TypeProjectInfo } from "src/types/project";
import { useEditorSelector } from "@/store";
import TempStringUtil from "src/common/utils/TempStringUtil";
import { ProjectInput } from "../Forms";

const ProjectInfoModal: React.FC<ModalProps> = props => {
  const [form] = Form.useForm<TypeProjectInfo>();
  const projectInfo = useEditorSelector(state => state.projectData.description);
  const projectRoot = useEditorSelector(state => state.projectData.root);
  const projectInfoConfig = useProjectInfoConfig();
  return (
    <Modal
      {...props}
      onOk={async e => {
        const data = form.getFieldsValue();
        // TODO 写入 projectInfoConfig.content
        const replaced = TempStringUtil.eval(projectInfoConfig.template, data);
        console.log({
          projectInfoConfig,
          projectInfo: data,
          replaced
        });
        console.log(replaced);

        await fse.writeFile(
          path.join(projectRoot, projectInfoConfig.output),
          replaced,
          "utf8"
        );
        if (props.onOk) {
          props.onOk(e);
        }
      }}
    >
      <Form
        form={form}
        colon={false}
        labelAlign="right"
        labelCol={{ span: 4 }}
        preserve={false}
        initialValues={projectInfo}
      >
        {projectInfoConfig.items.map(item => {
          return (
            item.visible && (
              <ProjectInput
                key={item.name}
                name={item.name}
                label={item.description}
                disabled={item.disabled}
                onChange={event => {
                  form.setFieldsValue({ [item.name]: event.target.value });
                }}
              />
            )
          );
        })}
      </Form>
    </Modal>
  );
};

export default ProjectInfoModal;
