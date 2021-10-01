import React from "react";
import styled from "styled-components";

import {
  useResourcePageOption,
  useResourceImageUrl,
  useResourceDefineList
} from "@/hooks/resource/index";
import { PreloadImage } from "../ImageCollection";

const Previewer: React.FC = () => {
  const [currentPage] = useResourcePageOption();
  const resourceDefineList = useResourceDefineList();
  const imageUrl = useResourceImageUrl(currentPage.preview || "");

  return (
    <StylePreviewer>
      <PreloadImage className="img" src={imageUrl} />
    </StylePreviewer>
  );
};

const StylePreviewer = styled.div`
  width: 100%;
  border-radius: 12px;
  border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]};
  overflow: hidden;
  .img {
    width: 100%;
  }
`;

export default Previewer;
