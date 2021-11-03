/* eslint-env es2020 */

// Eine Sammlung von allen CustomEvent Namen

/** Öffnet den Login-Dialog */
export const OPEN_LOGIN_DIALOG = "open-login-dialog";

/** Gibt an dass der Nutzer sich erfolgreich angemeldet hat */
export const USER_LOGIN = "user-login";

/** Gibt an dass der Nutzer sich abgemeldet hat */
export const USER_LOGOUT = "user-logout";

/** Wird gefeuert wenn sich der Datenbestand von Gerichten und Mahlzeiten ändert */
export const MEAL_UPDATE = "meal-update";

/** Wird gefeuert wenn sich der Datenbestand von sportlichen Betätigungen ändert */
export const SPORT_UPDATE = "sport-update";

/**
 * Zeigt eine Benachrichtigung mittels Snackbar an
 * (Sollte nur über showNotification() in `./snackbar.js` gemacht werden).
 *
 * In der `detail` Property des Events werden folgende zwei Properties angegeben:
 *
 * - `severity`: Einer der Strings `"error"`, `"info"`, `"success"` oder `"warning"`
 * - `message`: Ein String mit der anzuzeigenden Nachricht
 */
export const SHOW_NOTIFICATION = "show-notification";
