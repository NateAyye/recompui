import React from "react";

import {theme} from "./stitches.config";
import {ReCompUIThemeContext} from "./types";

export const defaultContext: ReCompUIThemeContext = {
  isDark: false,
  theme,
  type: "light",
};

const ThemeContext: React.Context<ReCompUIThemeContext> =
  React.createContext<ReCompUIThemeContext>(defaultContext);

export default ThemeContext;
