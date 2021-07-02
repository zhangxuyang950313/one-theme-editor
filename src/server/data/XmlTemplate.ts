import { xml2jsonElements } from "server/compiler/xml";

export default class XmlTemplate {
  private file: string;
  constructor(file: string) {
    this.file = file;
  }

  getTemplateData() {
    xml2jsonElements(this.file).then(console.log);
  }
}
