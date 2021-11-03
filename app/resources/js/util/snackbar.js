/* eslint-env es11 */

import { SHOW_NOTIFICATION } from "./events";

/**
 * Dringlichkeits-Wert für Snackbar-Nachrichten, die Erfolge anzeigen.
 * Zu Verwenden mit {@link showNotification}.
 *
 * @type {string}
 */
export const SEVERITY_SUCCESS = "success";

/**
 * Dringlichkeits-Wert für Snackbar-Nachrichten, die Fehler anzeigen.
 * Zu Verwenden mit {@link showNotification}.
 *
 * @type {string}
 */
export const SEVERITY_ERROR = "error";

/**
 * Dringlichkeits-Wert für Snackbar-Nachrichten, die Warnungen anzeigen.
 * Zu Verwenden mit {@link showNotification}.
 *
 * @type {string}
 */
export const SEVERITY_WARNING = "warning";

/**
 * Dringlichkeits-Wert für Snackbar-Nachrichten, die normale Informationen
 * anzeigen. Zu Verwenden mit {@link showNotification}.
 *
 * @type {string}
 */
export const SEVERITY_INFO = "info";

/**
 * Zeigt eine Benachrichtigung auf der Snackbar an
 *
 * @param {string} severity Die Dringlichkeit (s. {@link https://material-ui.com/api/alert/})
 * @param {string} message Die anzuzeigende Nachricht
 */
export function showNotification(severity, message) {
    window.document.dispatchEvent(new CustomEvent(
        SHOW_NOTIFICATION,
        {
            detail: {
                severity: severity,
                message: message,
            },
        },
    ));
}
