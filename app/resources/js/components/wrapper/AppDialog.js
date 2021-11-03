/* eslint-env es2020 */

import { styled } from "@material-ui/core/styles";
import { Dialog } from "@material-ui/core";

import { COLOR_BACKGROUND, COLOR_TEXT } from "../../theme";

/**
 * Wrapper für die Dialog Component aus `@material-ui/core` im Farbschema der App
 */
const AppDialog = styled(Dialog)({
    background: COLOR_BACKGROUND,
    color: COLOR_TEXT,
});
export default AppDialog;
