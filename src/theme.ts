/**
 * @file Theme setup for Material-UI.
 */

import { blue, blueGrey, lightBlue, orange } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';

import {
  createThemeProvider,
  isThemeDark,
  useConditionalCSS,
} from '@skybrush/app-theme-mui';

import type { RootState } from './store/reducers';

// @ts-expect-error TS(2307)
import darkModeExtraCSS from '!!raw-loader!~/../assets/css/dark-mode.css';

import { ThemeType } from '@skybrush/app-theme-mui';

/**
 * Specialized Material-UI theme provider that defaults to dark theme.
 */
const DarkModeAwareThemeProvider = createThemeProvider({
  primaryColor: (dark) => (dark ? orange : blue),
  secondaryColor: (dark) => (dark ? lightBlue : blueGrey),
});

/**
 * Specialized theme provider that dynamically loads dark mode CSS for workbench and panels.
 */
export const DarkModeExtraCSSProvider = () => {
  const theme = useTheme();
  const isDark = isThemeDark(theme);
  // Ensure dark-mode stylesheet is applied for dark mode or defaults
  useConditionalCSS(darkModeExtraCSS, true);
  return null;
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    type:
      state.settings.display.theme === ThemeType.AUTO || !state.settings.display.theme
        ? ThemeType.DARK
        : state.settings.display.theme,
  })
)(DarkModeAwareThemeProvider);
