// 主题描述信息配置
const labelMap = {
  name: "主题名称",
  designer: "设计师",
  author: "制作者",
  version: "版本号",
  uiVersion: "UI版本"
};

type TypeLabelKey = keyof typeof labelMap;

type TypeProjectConfig = {
  [k in TypeLabelKey]: {
    name: string;
    key: TypeLabelKey;
  };
};

// 生成使用类型
export const projectInfoConfig = (() => {
  const keys = Object.keys(labelMap) as Array<TypeLabelKey>;
  return keys.reduce((t, k) => {
    t[k] = { name: labelMap[k], key: k };
    return t;
  }, {} as TypeProjectConfig);
})();
