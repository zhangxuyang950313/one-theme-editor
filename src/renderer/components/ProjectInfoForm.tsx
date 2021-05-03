import React, { forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";

import { TypeProjectInfo, TypeUiVersionConf } from "types/project";

// components
import { Form, FormInstance } from "antd";
import {
  ProjectAuthor,
  ProjectDesigner,
  ProjectName,
  ProjectUIVersion,
  ProjectVersion
} from "./Forms";

type TypeProps = {
  // ui 版本列表，用于渲染 select
  uiVersions: TypeUiVersionConf[];
  // 初始化数据
  initialValues: TypeProjectInfo | undefined;
  form: FormInstance<TypeProjectInfo>;
};

type TypeRef = FormInstance<TypeProjectInfo>;

// 主题信息表单
function ProjectInfoForm(props: TypeProps, ref: React.ForwardedRef<TypeRef>) {
  const { form, uiVersions, initialValues } = props;

  useImperativeHandle(ref, () => form);

  const onInputChange = (field: keyof TypeProjectInfo) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      form.setFieldsValue({ [field]: event.target.value });
    };
  };
  const onSelectChange = (field: keyof TypeProjectInfo) => {
    return (value: string) => {
      form.setFieldsValue({ [field]: value });
    };
  };
  return (
    <StyleProjectInfoForm>
      <Form
        name="FormProductInfo"
        form={form}
        colon={false}
        labelAlign="right"
        labelCol={{ span: 6 }}
        initialValues={initialValues}
      >
        <ProjectName onChange={onInputChange("name")} />
        <ProjectDesigner onChange={onInputChange("designer")} />
        <ProjectAuthor onChange={onInputChange("author")} />
        <ProjectVersion onChange={onInputChange("version")} />
        <ProjectUIVersion
          uiVersions={uiVersions}
          onChange={onSelectChange("uiVersion")}
        />
      </Form>
    </StyleProjectInfoForm>
  );
}

const StyleProjectInfoForm = styled.div`
  width: 100%;
  flex-shrink: 0;
`;

export default forwardRef<TypeRef, TypeProps>(ProjectInfoForm);
