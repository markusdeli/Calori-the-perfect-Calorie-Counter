/* eslint-env es11 */

/**
 * Fehlerklasse für alle Backend-Requests deren Antwort die `err` Property auf
 * `true` gesetzt hat
 */
export default class BackendError extends Error {

    /**
     * Erstellt einen neuen BackendError
     *
     * @param {number} code Der HTTP-Statuscode
     * @param {string} msg Die Fehlermeldung
     */
    constructor(code, msg) {
        super(msg);

        this._code = code;
    }

    /**
     * Der HTTP-Statuscode mit dem die Anfrage beantwortet wurde
     */
    get code() {
        return this._code;
    }

}
