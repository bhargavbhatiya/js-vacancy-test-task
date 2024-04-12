import { createTheme } from "@mantine/core";

import * as components from "./components";

const mainTheme = createTheme({
  fontFamily: "Inter, Roboto, sans-serif",
  fontFamilyMonospace: "monospace",
  headings: {
    fontFamily: "Inter, Roboto, sans-serif",
    fontWeight: "600",
  },
  lineHeights: {
    md: "1.45",
  },
  primaryColor: "blue",
  primaryShade: 6,
  components,
});

export default mainTheme;
