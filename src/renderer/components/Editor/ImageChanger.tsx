// 图片替换单元组件
import path from "path";
import React, { useEffect, useState } from "react";
import { remote } from "electron";

// components
import styled from "styled-components";
import { notification } from "antd";
import {
  RightCircleOutlined,
  DeleteOutlined,
  FormOutlined,
  ImportOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone
} from "@ant-design/icons";

// script
import { apiCopyFile, apiDeleteFile } from "@/api";
import { useLoadImageByPath } from "@/hooks/image";
import { useProjectRoot } from "@/hooks/project";
import { useToListWatcher } from "@/hooks/fileWatcher";
import { useSourceConfigRoot } from "@/hooks/sourceConfig";
import { TypeSCPageSourceConf } from "types/source-config";
import ERR_CODE from "@/core/error-code";

// 图片素材展示
type TypePropsOfShowImage = {
  filepath?: string;
  onClick?: () => void;
  onImport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  // showHandler 时就要强制传入 to 列表
} & (
  | { showHandler: true; absoluteToList: string[] }
  | { showHandler?: false; absoluteToList?: string[] }
);
function ImageShower(props: TypePropsOfShowImage) {
  const {
    //
    filepath,
    showHandler,
    absoluteToList,
    onClick,
    onImport,
    onDelete
  } = props;

  // 图片参数改变，用于重载
  const [count, updateCount] = useState(0);

  // 图片预加载
  const [url, handleReload] = useLoadImageByPath(filepath);

  // 图片重载
  useEffect(() => {
    handleReload(filepath ? `${filepath}&count=${count}` : "");
    updateCount(count + 1);
  }, [absoluteToList]);

  const Content: React.FC = () => {
    return (
      <StyleImageBackground srcUrl={url}>
        <div
          className="preview"
          can-click={String(!!onClick)}
          onClick={() => onClick && onClick()}
        />
      </StyleImageBackground>
    );
  };

  // 右侧图片操作区
  const Handler: React.FC = () => {
    // 导入按钮
    const ImportButton = (
      <ImportOutlined
        className="press import"
        onClick={() => onImport && onImport()}
      />
    );
    // .9编辑按钮
    const EditButton = <FormOutlined className="press edit" />;
    // 删除按钮
    const DeleteButton = (
      <DeleteOutlined
        className="press delete"
        onClick={() => onDelete && onDelete()}
      />
    );
    return (
      <div className="handler">
        {ImportButton}
        {filepath && EditButton}
        {filepath && DeleteButton}
      </div>
    );
  };
  return (
    <StyleShowImage>
      <Content />
      {/* 支持操作 */}
      {showHandler && <Handler />}
    </StyleShowImage>
  );
}

const StyleShowImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  .handler {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 20px;
    margin: 0 10px;
    .press {
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.5;
      }
    }
    .import {
      font-size: 19px;
      color: gray;
    }
    .edit {
      font-size: 18px;
      color: gray;
    }
    .delete {
      color: red;
    }
  }
`;

const StyleImageBackground = styled.div<{ srcUrl?: string }>`
  position: relative;
  width: 84px;
  height: 84px;
  box-sizing: border-box;
  background-color: #c2c2c2;
  background-image: linear-gradient(45deg, #6d6d6d 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #6d6d6d 0),
    linear-gradient(45deg, #6d6d6d 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #6d6d6d 0);
  background-size: 14px 14px;
  background-position: 0 0, 7px 7px, 7px 7px, 0 0;

  display: flex;
  justify-content: center;
  align-items: center;

  .preview {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: center/contain no-repeat;
    background-image: ${({ srcUrl }) => `url(${srcUrl || ""})` || "unset"};
    &[can-click="true"] {
      cursor: pointer;
      transform: scale(0.8);
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(0.9);
        transition: transform 0.1s ease;
      }
    }
  }
`;

const ImageChanger: React.FC<TypeSCPageSourceConf> = sourceConf => {
  const { from, to } = sourceConf;
  const projectRoot = useProjectRoot();
  const sourceConfigRoot = useSourceConfigRoot();
  const newRelativeToList = useToListWatcher(to);

  if (!sourceConf || !from || !sourceConfigRoot || !projectRoot) return null;

  // 素材绝对路径
  const absoluteFrom = path.join(sourceConfigRoot, from.relativePath);

  // 目标素材绝对路径列表
  const absoluteToList = to.map(item => path.join(projectRoot, item));

  // 更新后的模板绝对路径列表
  const newAbsoluteToList = newRelativeToList.map(item =>
    path.join(projectRoot, item)
  );

  // 筛选一个有效的用于展示
  const absoluteToForShow = newAbsoluteToList[0] || "";

  /**
   * 点击原始素材，mac 支持小窗预览
   * @param filepath
   * @param name
   */
  const previewFile = (filepath: string, name: string) => {
    if (process.platform !== "darwin") return;
    remote.getCurrentWindow().previewFile(filepath, name);
  };
  // 拷贝到模板素材
  const copyToWith = (file: string) => {
    if (!(Array.isArray(to) && to.length > 0)) {
      notification.warn({ message: `"${sourceConf.name}"${ERR_CODE[3006]}` });
      return;
    }
    absoluteToList.forEach(target => {
      apiCopyFile(file, target);
    });
  };
  // 手动选取素材
  const handleImport = () => {
    // 选择图片添加
    remote.dialog
      .showOpenDialog({
        title: "选择素材",
        properties: ["openFile", "createDirectory"]
      })
      .then(result => {
        if (result.canceled) return;
        console.log(result);
        copyToWith(result.filePaths[0]);
      });
  };
  // 拷贝默认素材
  const handleCopyDefault = () => {
    copyToWith(absoluteFrom);
  };
  // 删除素材
  const handleDelete = () => {
    if (!Array.isArray(absoluteToList)) return;
    absoluteToList.forEach((item, index) => {
      setTimeout(() => {
        apiDeleteFile(item);
      }, index * 100);
    });
  };
  return (
    <StyleImageChanger>
      {/* 图片描述 */}
      <div className="text description">
        {sourceConf.name}
        {from.width && from.height ? (
          <span className="image-size">
            ({`${from.width}×${from.height}`}
            {from.size && <span> | {(from.size / 1024).toFixed(1)}kb</span>})
          </span>
        ) : null}
      </div>
      {to.map(relativePath => {
        const basename = path.basename(relativePath);
        // const hasIt = fse.existsSync(path.join(projectRoot, relativePath));
        const hasIt = new Set(newRelativeToList).has(relativePath);
        const absPath = path.join(projectRoot, relativePath);
        return (
          <p
            key={basename}
            className="text to-basename"
            data-exists={String(hasIt)}
            onClick={() => hasIt && remote.shell.showItemInFolder(absPath)}
          >
            {hasIt ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#ff0000" />
            )}
            &ensp;
            {basename}
          </p>
        );
      })}
      <div className="edit-wrapper">
        <div className="left">
          <ImageShower
            filepath={absoluteFrom}
            onClick={() => {
              if (process.platform !== "darwin") {
                remote.shell.showItemInFolder(absoluteFrom);
              } else {
                previewFile(absoluteFrom, sourceConf.name);
              }
            }}
          />
        </div>
        <RightCircleOutlined className="center " onClick={handleCopyDefault} />
        <div className="right">
          <ImageShower
            showHandler
            filepath={absoluteToForShow}
            absoluteToList={newAbsoluteToList}
            onClick={() => remote.shell.showItemInFolder(absoluteToForShow)}
            onImport={handleImport}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </StyleImageChanger>
  );
};

const StyleImageChanger = styled.div`
  /* display: inline; */
  /* padding: 10px; */
  margin-bottom: 20px;
  .text {
    margin-bottom: 6px;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .description {
    font-size: 14px;
    .image-size {
      margin-left: 4px;
      font-size: 10px;
      color: ${({ theme }) => theme["@text-color"]};
    }
  }
  .to-basename {
    font-size: 10px;
    color: ${({ theme }) => theme["@text-color-secondary"]};
    user-select: text;
    max-width: 100%;
    /* overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
    &[data-exists="true"] {
      cursor: pointer;
    }
    &[data-exists="false"] {
      opacity: 0.5;
    }
  }
  .edit-wrapper {
    display: flex;
    flex-direction: wrap;
    align-items: center;
    .left,
    .right {
      /* margin: 10px; */
    }
    .center {
      cursor: pointer;
      font-size: 30px;
      color: ${({ theme }) => theme["@text-color"]};
      margin: 20px;
      transition: all 0.5s ease;
      &:hover {
        opacity: 0.5;
        transition: all 0.1s ease;
      }
    }
  }
`;
export default ImageChanger;
