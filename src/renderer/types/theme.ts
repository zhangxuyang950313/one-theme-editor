import "styled-components";
import defaultTheme from "../theme/light";

declare module "styled-components" {
  type CustomTheme = typeof defaultTheme;
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends CustomTheme {}
}
