import { createTheme } from '@mui/material/styles';
import { merge } from 'lodash-es';

import { colorsLight, colorsDark } from './Colors';
import components from './Components';
import { typography } from './Fonts';

export const customizableLightTheme = (customization) => {
  const customizedLightThemeBase = createTheme(
    merge(
      {},
      typography(customization?.typography ?? {}),
      colorsLight(customization?.palette?.primary?.main)
    )
  );

  return createTheme(
    merge({}, customizedLightThemeBase, components(customizedLightThemeBase), customization)
  );
};

export const customizableDarkTheme = (customization) => {
  const customizedDarkThemeBase = createTheme(
    merge(
      {},
      typography(customization?.typography ?? {}),
      colorsDark(customization?.palette?.primary?.main, customization?.palette?.darker)
    )
  );

  return createTheme(
    merge({}, customizedDarkThemeBase, components(customizedDarkThemeBase), customization)
  );
};

const themes = {
  light: customizableLightTheme,
  dark: customizableDarkTheme,
};
export default themes;
