/* eslint-env es2020 */

import { createMuiTheme } from "@material-ui/core/styles";

export const GRID_SIZE_XS = 12;
export const GRID_SIZE_SM = 12;
export const GRID_SIZE_MD = 6;
export const GRID_SIZE_LG = 6;
export const GRID_SIZE_XL = 4;

export const COLOR_BACKGROUND_DEFAULT = "#202020";
export const COLOR_BACKGROUND_PAPER = "#282828";

export const COLOR_TEXT_PRIMARY = "rgba(255, 255, 255, 0.75)";
export const COLOR_TEXT_SECONDARY = "rgba(255, 255, 255, 0.65)";
export const COLOR_TEXT_DISABLED = "rgba(255, 255, 255, 0.5)";

export const COLOR_PRIMARY = "#673ab7";
export const COLOR_PRIMARY_DARK = "#320b86";
export const COLOR_PRIMARY_LIGHT = "#9a67ea";
export const TEXT_ON_PRIMARY = "rgba(255, 255, 255, 0.75)";

export const COLOR_SECONDARY = "#f57c00";
export const COLOR_SECONDARY_DARK = "#bb4d00";
export const COLOR_SECONDARY_LIGHT = "#ffad42";
export const TEXT_ON_SECONDARY = "rgba(255, 255, 255, 0.75)";

export const COLOR_ERROR = "#f44336";
export const COLOR_ERROR_DARK = "#d32f2f";
export const COLOR_ERROR_LIGHT = "#e57373";
export const TEXT_ON_ERROR = TEXT_ON_PRIMARY;

export const COLOR_WARNING = "#ff9800";
export const COLOR_WARNING_DARK = "#f57c00";
export const COLOR_WARNING_LIGHT = "#ffb74d";
export const TEXT_ON_WARNING = TEXT_ON_PRIMARY;

export const COLOR_INFO = "#2196f3";
export const COLOR_INFO_DARK = "#1976d2";
export const COLOR_INFO_LIGHT = "#64b5f6";
export const TEXT_ON_INFO = TEXT_ON_PRIMARY;

export const COLOR_SUCCESS = "#4caf50";
export const COLOR_SUCCESS_DARK = "#388e3c";
export const COLOR_SUCCESS_LIGHT = "#81c784";
export const TEXT_ON_SUCCESS = TEXT_ON_PRIMARY;

/**
 * Das Haupt-Theme der App, wird vom Material UI Framework gelesen
 */
const theme = createMuiTheme({
    palette: {
        background: {
            default: COLOR_BACKGROUND_DEFAULT,
            paper: COLOR_BACKGROUND_PAPER,
        },
        text: {
            primary: COLOR_TEXT_PRIMARY,
            secondary: COLOR_TEXT_SECONDARY,
            disabled: COLOR_TEXT_DISABLED,
        },
        primary: {
            dark: COLOR_PRIMARY_DARK,
            main: COLOR_PRIMARY,
            light: COLOR_PRIMARY_LIGHT,
            contrastText: TEXT_ON_PRIMARY,
        },
        secondary: {
            light: COLOR_SECONDARY_LIGHT,
            main: COLOR_SECONDARY,
            dark: COLOR_SECONDARY_DARK,
            contrastText: TEXT_ON_SECONDARY,
        },
        error: {
            light: COLOR_ERROR_LIGHT,
            main: COLOR_ERROR,
            dark: COLOR_ERROR_DARK,
            contrastText: TEXT_ON_ERROR,
        },
        warning: {
            light: COLOR_WARNING_LIGHT,
            main: COLOR_WARNING,
            dark: COLOR_WARNING_DARK,
            contrastText: TEXT_ON_WARNING,
        },
        info: {
            light: COLOR_INFO_LIGHT,
            main: COLOR_INFO,
            dark: COLOR_INFO_DARK,
            contrastText: TEXT_ON_INFO,
        },
        success: {
            light: COLOR_SUCCESS_LIGHT,
            main: COLOR_SUCCESS,
            dark: COLOR_SUCCESS_DARK,
            contrastText: TEXT_ON_SUCCESS,
        },
    },
});
export default theme;
