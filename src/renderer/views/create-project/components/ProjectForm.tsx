import path from "path";
import fse from "fs-extra";
import React, { useState, useEffect } from "react";
import { Form } from "@arco-design/web-react";
import { TypeProjectInfo } from "src/types/project";
import { TypeFileTempConfig } from "src/types/scenario.config";
import { ProjectInput } from "@/components/Forms";
import pathUtil from "src/common/utils/pathUtil";

const defaultPath = pathUtil.ELECTRON_DESKTOP;

const ProjectForm: React.FC<{
  projectInfoConfig: TypeFileTempConfig;
  initialValues: TypeProjectInfo;
  onLocalPathSuggestion?: (p: string) => void;
  onFormValuesChange: (v: Partial<TypeProjectInfo>) => void;
}> = props => {
  const {
    projectInfoConfig,
    initialValues,
    onLocalPathSuggestion,
    onFormValuesChange
  } = props;
  // 填写本地目录
  const [localForSave, setLocalForSave] = useState(
    path.join(defaultPath, initialValues.name)
  );
  // 表单实例
  const [form] = Form.useForm<TypeProjectInfo>();

  useEffect(() => {
    onLocalPathSuggestion && onLocalPathSuggestion(localForSave);
  }, [localForSave]);

  return (
    <>
      <Form
        form={form}
        colon={false}
        labelAlign="right"
        // labelCol={{ span: 5 }}
        initialValues={initialValues}
        onValuesChange={changedValue => {
          const projectName = changedValue.name;
          if (!projectName) return;
          if (path.basename(localForSave) === projectName) return;
          // 非绝对路径使用默认路径
          if (!path.isAbsolute(localForSave)) {
            setLocalForSave(path.join(defaultPath, projectName));
            return;
          }
          // 路径存在视为目标根路径，向后追加工程名称
          if (fse.pathExistsSync(localForSave)) {
            setLocalForSave(path.join(localForSave, projectName));
            return;
          }
          // 当前路径不存在且向上一级路径存在视为当前的目标路径，替换最后一级路径
          const dirname = path.dirname(localForSave);
          if (fse.pathExistsSync(dirname)) {
            setLocalForSave(path.join(dirname, projectName));
            return;
          }
        }}
        onChange={value => {
          onFormValuesChange(value);
        }}
        // onFieldsChange={() => {
        //   // setFieldsError(form.getFieldsError());
        //   projectInfoRef.current = form.getFieldsValue();
        // }}
      >
        {projectInfoConfig.items.map(prop => {
          return (
            prop.visible && (
              <ProjectInput
                className="project-input"
                key={prop.name}
                field={prop.name}
                label={prop.description}
                disabled={prop.disabled}
                onChange={value => {
                  form.setFieldsValue({
                    [prop.name]: value
                  });
                }}
              />
            )
          );
        })}
      </Form>
    </>
  );
};

export default ProjectForm;
