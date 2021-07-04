import { useLayoutEffect, useState } from "react";
import { message } from "antd";
import {
  apiGetSourceConfigList,
  apiGetBrandConfList,
  apiGetSourceDescriptionList
} from "@/api/index";
import {
  ActionSetBrandInfoList,
  ActionSetSourceDescriptionList,
  ActionSetCurrentBrand
} from "@/store/starter/action";
import { getCurrentBrandConf } from "@/store/starter/selector";
import {
  ActionSetCurrentModule,
  ActionSetCurrentPage
} from "@/store/editor/action";
import {
  getCurrentModule,
  getCurrentPage,
  getSCModuleList,
  getCurrentPageGroupList,
  getSourceConfigRoot,
  getSourceConfig,
  getCurrentSourceTypeList,
  getCurrentSourceList,
  getCurrentXmlTemplateList
} from "@/store/editor/selector";
import {
  TypeSourceConfig,
  TypeSourceDescription,
  TypeSCPageGroupConf,
  TypeSCModuleConf,
  TypeSCPageConf,
  TypeSCPageSourceTypeConf,
  TypeSCPageSourceElement,
  TypeSCPageImageElement,
  TypeSCPageTextElement,
  TypeSCPageTemplateConf
} from "types/source-config";
import { TypeBrandConf } from "types/project";
import ERR_CODE from "@/core/error-code";
import { ELEMENT_TYPES } from "src/enum";
import {
  useStarterDispatch,
  useGlobalDispatch,
  useEditorDispatch,
  useStarterSelector,
  useEditorSelector
} from "@/store/index";
import { useAsyncUpdater } from "./index";

// 获取当前资源配置数据
export function useSourceConfig(): TypeSourceConfig | null {
  return useEditorSelector(getSourceConfig);
}

// 获取当前资源配置目录
export function useSourceConfigRoot(): string | null {
  return useEditorSelector(getSourceConfigRoot);
}

// 获取当前资源配置命名空间
export function useNamespace(): string | null {
  const sourceConfig = useSourceConfig();
  return sourceConfig?.namespace || null;
}

// 当前选择的厂商信息
export function useCurrentBrandConf(): [
  TypeBrandConf | null,
  (brandConf: TypeBrandConf) => void
] {
  const dispatch = useStarterDispatch();
  return [
    useStarterSelector(getCurrentBrandConf),
    brandConf => dispatch(ActionSetCurrentBrand(brandConf))
  ];
}

// 获取配置的厂商列表
export function useBrandConfList(): TypeBrandConf[] {
  const [value, updateValue] = useState<TypeBrandConf[]>([]);
  const dispatchStarter = useStarterDispatch();
  const registerUpdater = useAsyncUpdater();
  useLayoutEffect(() => {
    apiGetBrandConfList().then(conf => {
      // 添加默认小米，去重
      const list = conf.reduce<TypeBrandConf[]>((t, o) => {
        if (!t.some(item => item.type === o.type)) t.push(o);
        return t;
      }, []);
      registerUpdater(() => {
        dispatchStarter(ActionSetBrandInfoList(list));
        dispatchStarter(ActionSetCurrentBrand(list[0]));
        updateValue(list);
      });
    });
  }, []);
  return value;
}

// 获取配置预览列表
export function useSourceDescriptionList(): [TypeSourceDescription[], boolean] {
  const [value, updateValue] = useState<TypeSourceDescription[]>([]);
  const [loading, updateLoading] = useState(true);
  const [brandConf] = useCurrentBrandConf();
  const dispatchStarter = useStarterDispatch();
  useLayoutEffect(() => {
    if (!brandConf) return;
    apiGetSourceDescriptionList(brandConf.type)
      .then(data => {
        console.log("配置预览列表：", data);
        updateValue(data);
        dispatchStarter(ActionSetSourceDescriptionList(data));
      })
      .catch(err => {
        const content = ERR_CODE[3002];
        message.error({ content });
        console.log(`${content}: ${err}`);
      })
      .finally(() => {
        updateLoading(false);
      });
  }, [brandConf, dispatchStarter]);
  return [value, loading];
}

// 获取配置列表
export function useSourceConfigList(): [TypeSourceConfig[], boolean] {
  const [value, updateValue] = useState<TypeSourceConfig[]>([]);
  const [loading, updateLoading] = useState(true);
  const [brandConf] = useCurrentBrandConf();
  const dispatch = useGlobalDispatch();
  useLayoutEffect(() => {
    if (!brandConf) return;
    apiGetSourceConfigList(brandConf.type)
      .then(data => {
        console.log("配置列表", data);
        updateValue(data);
      })
      .catch(err => {
        const content = ERR_CODE[3002];
        message.error({ content });
        console.log(`${content}: ${err}`);
      })
      .finally(() => {
        updateLoading(false);
      });
  }, [brandConf, dispatch]);
  return [value, loading];
}

// 当前配置模块列表
export function useCurrentModuleList(): TypeSCModuleConf[] {
  return useEditorSelector(getSCModuleList);
}

// 获取当前选择的模块
export function useCurrentModule(): [
  TypeSCModuleConf | null,
  (data: TypeSCModuleConf) => void
] {
  const dispatch = useEditorDispatch();
  return [
    useEditorSelector(getCurrentModule),
    data => dispatch(ActionSetCurrentModule(data))
  ];
}

// 当前选择的模块页面组列表
export function useCurrentPageGroupList(): TypeSCPageGroupConf[] {
  return useEditorSelector(getCurrentPageGroupList);
}

// 获取当前选择的页面
export function useCurrentPage(): [
  TypeSCPageConf | null,
  (data: TypeSCPageConf) => void
] {
  const dispatch = useEditorDispatch();
  return [
    useEditorSelector(getCurrentPage),
    data => dispatch(ActionSetCurrentPage(data))
  ];
}

export function useSourceList(): TypeSCPageSourceElement[] {
  return useEditorSelector(getCurrentSourceList);
}

export function useSourceTypeList(): TypeSCPageSourceTypeConf[] {
  return useEditorSelector(getCurrentSourceTypeList);
}

export function useImageSourceList(): TypeSCPageImageElement[] {
  const sourceList = useSourceList();
  return sourceList.flatMap(item =>
    item.type === ELEMENT_TYPES.IMAGE ? [item] : []
  );
}

export function useXmlSourceList(): TypeSCPageTextElement[] {
  const sourceList = useSourceList();
  return sourceList.flatMap(item =>
    item.type === ELEMENT_TYPES.TEXT ? [item] : []
  );
}

export function useXmlTemplateList(): TypeSCPageTemplateConf[] {
  return useEditorSelector(getCurrentXmlTemplateList);
}
