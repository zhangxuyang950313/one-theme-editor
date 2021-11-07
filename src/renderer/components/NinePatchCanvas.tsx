import React, { useEffect, useState } from "react";
import { scaleNinePatchCanvas } from "src/common/9patch/core";
import useSubscribeFile from "@/hooks/useSubscribeFile";

async function loadImage(src: string) {
  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });
  image.onload = null;
  image.onerror = null;
  return image;
}

const NinePatchCanvas: React.FC<
  React.HTMLAttributes<HTMLImageElement> & {
    src: string;
    width: number;
    height: number;
  }
> = props => {
  const { width, height } = props;
  const [src, setSrc] = useState(`src://${props.src}`);
  const [canvas, setCanvas] = useState(document.createElement("canvas"));
  useSubscribeFile(props.src, event => {
    const url = new URL(`src://${props.src}`);
    url.searchParams.set("t", Date.now().toString());
    setSrc(url.toString());
  });
  useEffect(() => {
    setSrc(`src://${props.src}`);
  }, [props.src]);
  useEffect(() => {
    if (!width || !height) return;
    loadImage(src).then(img => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      scaleNinePatchCanvas(canvas, width, height).then(cvs => {
        if (!cvs) return;
        setCanvas(cvs);
      });
    });
  }, [src, width, height]);

  return (
    <img
      {...props}
      className={props.className}
      alt=""
      src={canvas.toDataURL()}
    />
  );
};

export default NinePatchCanvas;
