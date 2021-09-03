import React, { forwardRef, useImperativeHandle } from "react";
import { Form, FormInstance, FormProps } from "antd";
import { TypeProjectInfo } from "src/types/project";
import {
  ProjectAuthor,
  ProjectDesigner,
  ProjectName,
  ProjectVersion
} from "./Forms";

type TypeProps = {
  className?: string;
  // 初始化数据
  initialValues: TypeProjectInfo | undefined;
  form: FormInstance<TypeProjectInfo>;
} & FormProps;

type TypeRef = FormInstance<TypeProjectInfo>;

// 主题信息表单
function ProjectInfoForm(props: TypeProps, ref: React.ForwardedRef<TypeRef>) {
  const { form, initialValues, className } = props;

  useImperativeHandle(ref, () => form);

  const onInputChange = (field: keyof TypeProjectInfo) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      form.setFieldsValue({ [field]: event.target.value });
    };
  };
  // const onSelectChange = (field: keyof TypeProjectDescription) => {
  //   return (value: string) => {
  //     form.setFieldsValue({ [field]: value });
  //   };
  // };
  return (
    <Form
      name="FormProductInfo"
      className={className}
      colon={false}
      labelAlign="right"
      labelCol={{ span: 4 }}
      {...props}
      form={form}
      initialValues={initialValues}
    >
      <ProjectName onChange={onInputChange("name")} />
      <ProjectDesigner onChange={onInputChange("designer")} />
      <ProjectAuthor onChange={onInputChange("author")} />
      <ProjectVersion onChange={onInputChange("version")} />
    </Form>
  );
}

export default forwardRef<TypeRef, TypeProps>(ProjectInfoForm);
