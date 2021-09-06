import fse from "fs-extra";
import JsZip from "jszip";

export async function unzipProject(
  file: string
): Promise<{ [key: string]: JsZip.JSZipObject }> {
  const buffer = fse.readFileSync(file);
  const jsZip = await JsZip.loadAsync(buffer);

  const buff = await jsZip.file(".DS_Store")?.async("nodebuffer");
  JsZip.loadAsync(buff).then(data => {
    // console.log(data.);
  });
  console.log(buff);
  console.log(jsZip.file("com.android.settings"));
  // console.log(jsZip.files);
  return Object.keys(jsZip.files);
}
