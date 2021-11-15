import path from "path";
import React from "react";
import styled from "styled-components";
import { remote } from "electron";
import { Notification } from "@arco-design/web-react";
import { HEX_FORMAT, RESOURCE_TAG } from "src/common/enums";
import { TypeBlockCollection } from "src/types/config.page";
import FileFiller from "./FileFiller/index";
import ValueFiller from "./ValueFiller/index";
import { previewResourceEmitter, PREVIEW_EVENT } from "@/singletons/emitters";

function resolveResourceFile(relative: string): string {
  return path.join(window.$one.$reactiveState.get("resourcePath"), relative);
}
function resolveProjectFile(relative: string): string {
  return path.join(window.$one.$reactiveState.get("projectPath"), relative);
}

async function importResource(to: string): Promise<void> {
  // 选择图片导入
  remote.dialog
    .showOpenDialog({
      title: "选择素材",
      properties: ["openFile", "createDirectory"]
    })
    .then(result => {
      if (result.canceled) return;
      window.$one.$server.copyFile({
        from: result.filePaths[0],
        to
      });
    });
}

// 所有填充器的包装器
// 所有类型及响应都在 switch 处理
const FillerWrapper: React.FC<{ data: TypeBlockCollection }> = props => {
  const { data } = props;
  switch (data.tag) {
    case RESOURCE_TAG.File: {
      return (
        <StyleFileFillerWrapper>
          {data.items.map((item, key) => {
            const projectFile = resolveProjectFile(item.sourceData.src);
            const resourceFile = resolveResourceFile(item.sourceData.src);
            return (
              <div className="file-display__item" key={key}>
                <FileFiller
                  data={item}
                  // 小预览图点击
                  onFloatClick={() => {
                    window.$one.$server.copyFile({
                      from: resourceFile,
                      to: projectFile
                    });
                  }}
                  // 大预览图点击
                  onPrimaryClick={() => {
                    remote.shell.showItemInFolder(projectFile);
                  }}
                  // 定位按钮
                  onLocate={() => {
                    // 定位到预览图位置
                    previewResourceEmitter.emit(
                      PREVIEW_EVENT.locateLayout,
                      item.keyPath
                    );
                  }}
                  // 导入按钮
                  onImport={() => {
                    importResource(projectFile);
                  }}
                  // 删除按钮
                  onDelete={() => {
                    window.$one.$server
                      .deleteFile(projectFile)
                      .catch((err: Error) => {
                        Notification.warning({ content: err.message });
                      });
                  }}
                />
              </div>
            );
          })}
        </StyleFileFillerWrapper>
      );
    }
    case RESOURCE_TAG.String:
    case RESOURCE_TAG.Number:
    case RESOURCE_TAG.Color:
    case RESOURCE_TAG.Boolean: {
      return (
        <StyleValueFillerWrapper>
          {data.items.map((xmlItem, key) => (
            <ValueFiller
              key={key}
              xmlItem={xmlItem}
              use={data.tag}
              colorFormat={HEX_FORMAT.ARGB}
            />
          ))}
        </StyleValueFillerWrapper>
      );
    }
    default: {
      return null;
    }
  }
};

// 文件填充器
const StyleFileFillerWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px 30px;
  .file-display__item {
    margin: 0 20px 20px 0;
  }
`;

// 值填充器
const StyleValueFillerWrapper = styled.div`
  flex-shrink: 0;
  padding: 20px 30px;
`;

export default FillerWrapper;
