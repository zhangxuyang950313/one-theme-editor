import React from "react";

// components
import styled from "styled-components";
import {
  DeleteOutlined,
  FormOutlined,
  ImportOutlined
} from "@ant-design/icons";

// 图片操作区
const ImageHandler: React.FC<{
  hiddenImport?: boolean;
  hiddenEdit?: boolean;
  hiddenDelete?: boolean;
  onImport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}> = props => {
  const {
    //
    hiddenImport,
    hiddenEdit,
    hiddenDelete,
    onImport,
    onEdit,
    onDelete
  } = props;
  return (
    // 导入按钮
    <StyleHandler>
      {!hiddenImport && onImport && (
        <ImportOutlined className="press import" onClick={onImport} />
      )}
      {/* .9编辑按钮 */}
      {!hiddenEdit && onEdit && (
        <FormOutlined className="press edit" onClick={onEdit} />
      )}
      {/* 删除按钮 */}
      {!hiddenDelete && onDelete && (
        <DeleteOutlined className="press delete" onClick={onDelete} />
      )}
    </StyleHandler>
  );
};

const StyleHandler = styled.div`
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
`;

export default ImageHandler;
