import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { PROTOCOL_TYPE } from "src/common/enums";
import { TypeSourceData } from "src/types/config.page";

import { useSubscribeSrc } from "../../hooks";

const ImageElement: React.FC<{
  mouseEffect?: boolean;
  shouldSubscribe?: boolean;
  sourceUrl: string;
  sourceData: TypeSourceData;
}> = props => {
  const [url, setUrl] = useState(props.sourceUrl);
  const { mouseEffect, shouldSubscribe, sourceData } = props;
  const subscribe = useSubscribeSrc({ immediately: true });
  useLayoutEffect(() => {
    if (!shouldSubscribe) return;
    if (
      sourceData.protocol === PROTOCOL_TYPE.src ||
      sourceData.protocol === PROTOCOL_TYPE.project
    ) {
      subscribe(sourceData.src, () => {
        const u = new URL(url);
        u.searchParams.set("t", Date.now().toString());
        setUrl(u.toString());
      });
    }
  }, []);

  return <StyleImage data-mouse-effect={mouseEffect} alt="" src={url} />;
};

const StyleImage = styled.img`
  display: inherit;
  /* width: 100%; */
  height: 100%;
  object-fit: contain;
  &[data-mouse-effect="true"] {
    outline: 1px dashed var(--color-primary-light-4);
  }
  transition: all 0.2s ease-in;
  &[data-mouse-effect="true"]:hover {
    cursor: pointer;
    filter: drop-shadow(0 0 10px var(--color-primary-light-4));
    outline: 2px solid var(--color-primary-light-4);
    transition: all 0.2s ease-out;
  }
`;

export default ImageElement;
