/* eslint-env es2017 */

import BackendError from "./BackendError";

const XHR_STATUS_SUCCESS = 4;

/**
 * Interne Methode zum allgemeinen Senden von Requests
 *
 * @param {!string} method Die HTTP Request Method
 * @param {!string} url Die URL
 * @param {?object} data Ein optionaler Payload, der als JSON in den Request Body aufgenommen wird
 * @param {?string} token Das JSON Web Token, falls der API Endpoint Authentifizierung benötigt
 */
function sendRequest(method, url, data, token) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open(method, url, true);
        if (typeof token === "string") {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XHR_STATUS_SUCCESS) {
                return;
            }

            try {
                const data = JSON.parse(xhr.responseText);

                if (data.err) {
                    reject(new BackendError(xhr.status, data.msg));
                } else {
                    resolve(data);
                }
            } catch (err) {
                reject(err);
            }
        };
        if (typeof data !== "undefined" && data !== null) {
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}

/**
 * Holt ein JSON-Objekt mit HTTP GET von der angegebenen URL
 *
 * @param {string} url Die URL
 * @param {?string} token Das JSON Web Token, falls aktuell ein Nutzer eingeloggt ist
 *     (optional, wird nur für authentifizierte Requests benötigt)
 * @return {Promise<object>} Das JSON-Objekt
 */
export function getJSON(url, token) {
    return sendRequest("GET", url, null, token);
}

/**
 * Sendet ein JSON-Objekt mit HTTP POST zur angegebenen URL und gibt die Antwort als JSON-Objekt
 * zurück
 *
 * @param {string} url Die URL
 * @param {?object} data Die im Request Body zu sendenden Daten (optional)
 * @param {?string} token Das JSON Web Token, falls aktuell ein Nutzer eingeloggt ist
 *     (optional, wird nur für authentifizierte Requests benötigt)
 * @return {Promise<object>} Das JSON-Objekt das vom Backend zurückgegeben wurde
 */
export function postJSON(url, data, token) {
    return sendRequest("POST", url, data, token);
}

/**
 * Sendet ein JSON-Objekt mit HTTP PUT zur angegebenen URL und gibt die Antwort als JSON-Objekt
 * zurück
 *
 * @param {string} url Die URL
 * @param {?object} data Die im Request Body zu sendenden Daten (optional)
 * @param {?string} token Das JSON Web Token, falls aktuell ein Nutzer eingeloggt ist
 *     (optional, wird nur für authentifizierte Requests benötigt)
 * @return {Promise<object>} Das JSON-Objekt das vom Backend zurückgegeben wurde
 */
export function putJSON(url, data, token) {
    return sendRequest("PUT", url, data, token);
}

/**
 * Sendet ein JSON-Objekt mit HTTP DELETE zur angegebenen URL und gibt die Antwort als JSON-Objekt
 * zurück
 *
 * @param {string} url Die URL
 * @param {?object} data Die im Request Body zu sendenden Daten (optional)
 * @param {?string} token Das JSON Web Token, falls aktuell ein Nutzer eingeloggt ist
 *     (optional, wird nur für authentifizierte Requests benötigt)
 * @return {Promise<object>} Das JSON-Objekt das vom Backend zurückgegeben wurde
 */
export function deleteJSON(url, data, token) {
    return sendRequest("DELETE", url, data, token);
}
