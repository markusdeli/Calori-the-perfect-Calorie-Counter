/* eslint-env es2020 */

import User from "../data/User";
import { USER_LOGIN, USER_LOGOUT } from "./events";
import { getJSON, postJSON, deleteJSON, putJSON } from "./xhr";

/** Der Schlüssel im localStorage für das JWT */
const LOCALSTORAGE_SESSION_TOKEN = "sessionToken";
/** Der Schlüssel im localStorage für die Nutzerdaten */
const LOCALSTORAGE_USER = "user";

export const API_BASEURL = "/api";
export const URL_USER_AUTH = API_BASEURL + "/user/auth";
export const URL_USER_SIGNUP = API_BASEURL + "/user/signup";

/**
 * @typedef {object} SignupFormData
 * @prop {string} userName Der Nutzername
 * @prop {string} pwd Das Passwort
 * @prop {string} email Die E-Mail Adresse
 * @prop {string} firstName Der Vorname
 * @prop {string} lastName Der Nachname
 * @prop {number} birthDate Das Geburtsdatum als UNIX-Timestamp (in Sekunden)
 * @prop {string} gender Das Geschlecht (`"male"` für männlich, `"female"` für
 *                       weiblich oder ein beliebiger anderer String)
 * @prop {number} weight Das Gewicht (in Kilogramm)
 * @prop {number} height Die Körpergröße (in Meter)
 */

/**
 * Management-Klasse zur Verwaltung der aktuellen Session.
 * Sobald sich erfolgreich eingeloggt wurde, wird ein CustomEvent vom Typ {@link USER_LOGIN}
 * auf dem `window.document` Objekt ausgelöst.
 */
export default class SessionManager {

    /**
     * Returnt die Instanz von SessionManager
     *
     * @return {SessionManager} Die SessionManager-Instanz
     */
    static getInstance() {
        // this bezieht sich hier auf die statische Klasse, und keine Instanz
        if (!this._instance) {
            // Konstruktor speichert die Instanz automatisch in der statischen
            // _instance Property ab
            return new SessionManager();
        }

        return this._instance;
    }

    /**
     * Erstellt eine neue SessionManager-Instanz.
     * Dieser Konstruktor darf nicht direkt aufgerufen werden, anstatt dessen
     * sollte man immer die statische {@link #getInstance} Methode verwenden.
     */
    constructor() {
        if (this.constructor._instance) {
            throw new Error(
                "SessionManager instance already exists, use the static getInstance() method",
            );
        }
        // Instanz für getInstance() setzen
        this.constructor._instance = this;

        // _user und _token sind anfänglich noch undefined wenn der Nutzer nicht
        // eingeloggt ist und müssen daher explizit auf null gesetzt werden um
        // den Specs der user und token Getter zu entsprechen
        if (!this.isLoggedIn) {
            /**
             * @private
             * @type {?User}
             */
            this._user = null;
            this._token = null;
        }
    }

    /**
     * Sendet eine POST Request ans Backend um ein Session Token zu bekommen
     *
     * @param {string} userName Der Benutzername
     * @param {string} pwd Das Passwort im Klartext
     * @return {Promise<User|null>} Eine Promise für die Nutzerdaten
     * @throws {BackendError} Sämtliche vom Backend zurückgegebenen Fehler,
     *     inklusive falscher Benutzername/Passwort
     */
    async login(userName, pwd) {
        const response = await postJSON(URL_USER_AUTH, {
            userName: userName,
            pwd: pwd,
        });

        this._handleUserDataReply(response.user, response.token);

        return response;
    }

    /**
     * Loggt den aktuell angemeldeten Nutzer aus.
     * Wenn aktuell kein Nutzer angemeldet ist hat dies keinen Effekt.
     */
    logout() {
        window.localStorage.setItem(LOCALSTORAGE_SESSION_TOKEN, "");
        window.localStorage.setItem(LOCALSTORAGE_USER, "");

        SessionManager._user = undefined;

        window.document.dispatchEvent(new CustomEvent(USER_LOGOUT));
    }

    /**
     * Erstellt einen neuen Account im Backend
     *
     * @param {SignupFormData} data Die Nutzerdaten aus den Eingabefeldern
     * @return {Promise<User>} Eine Promise für den neu erstellten Nutzer
     */
    async signup(data) {
        const response = await postJSON(URL_USER_SIGNUP, data);
        this._handleUserDataReply(response.user, response.token);

        return this._user;
    }

    /**
     * Ändert die Daten des eingeloggten Nutzers
     *
     * @param {UserChangeData} data Die neuen Nutzerdaten
     * @return {Promise<User>} Der veränderte Nutzer
     */
    async changeUserData(data) {
        const response = await this.putJSONAuth(API_BASEURL + "/user", data);
        this._handleUserDataReply(response.user, this.token, true);

        return this._user;
    }

    /**
     * Sendet eine HTTP GET Anfrage.
     * Wenn aktuell ein Nutzer eingeloggt ist wird das JWT automatisch mitgesendet.
     *
     * @param {string} url Die URL
     * @return {Promise<object>} Die Antwort
     */
    async getJSONAuth(url) {
        return await getJSON(url, this.token);
    }

    /**
     * Sendet eine HTTP POST Anfrage.
     * Wenn aktuell ein Nutzer eingeloggt ist wird das JWT automatisch mitgesendet.
     *
     * @param {string} url Die URL
     * @param {?object} data Der Request Body (optional)
     * @return {Promise<object>} Die Antwort
     */
    async postJSONAuth(url, data) {
        return await postJSON(url, data, this.token);
    }

    /**
     * Sendet eine HTTP PUT Anfrage.
     * Wenn aktuell ein Nutzer eingeloggt ist wird das JWT automatisch mitgesendet.
     *
     * @param {string} url Die URL
     * @param {?object} data Der Request Body (optional)
     * @return {Promise<object>} Die Antwort
     */
    async putJSONAuth(url, data) {
        return await putJSON(url, data, this.token);
    }

    /**
     * Dendet eine HTTP DELETE Anfrage.
     * Wenn aktuell ein Nutzer eingeloggt ist wird das JWT automatisch mitgesendet.
     *
     * @param {string} url Die URL
     * @param {?object} data Der Request Body (optional)
     * @return {Promise<object>} Die Antwort
     */
    async deleteJSONAuth(url, data) {
        return await deleteJSON(url, data, this.token);
    }

    /**
     * Speichert die Nutzerdaten und das Token im localStorage und feuert ein
     * Event um allen Komponenten zu signalisieren dass sich erfolgreich
     * eingeloggt wurde
     *
     * @param {object} userData Die Nutzerdaten als JSON Objekt
     * @param {string} token Das JSON Web Token
     * @param {?bool} noEvent Falls `true` wird kein Event gefeuert
     */
    _handleUserDataReply(userData, token, noEvent) {
        window.localStorage.setItem(LOCALSTORAGE_SESSION_TOKEN, token);
        window.localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));

        this._user = User.fromJSON(userData);

        if (!noEvent) {
            window.document.dispatchEvent(new CustomEvent(USER_LOGIN));
        }
    }

    /**
     * true wenn gerade ein Nutzer eingeloggt ist
     *
     * @readonly
     * @type {boolean}
     */
    get isLoggedIn() {
        return this.token && this.user;
    }

    /**
     * Das JWT für die aktuelle Sitzung
     *
     * @readonly
     * @type {string|null}
     */
    get token() {
        if(!this._token) {
            const item = window.localStorage.getItem(LOCALSTORAGE_SESSION_TOKEN);
            if (item) {
                this._token = item;
            }
        }

        return this._token;
    }

    /**
     * Die Instanz des aktuell eingeloggten Nutzers, oder `null`
     *
     * @readonly
     * @type {User|null}
     */
    get user() {
        if (!this._user) {
            const item = window.localStorage.getItem(LOCALSTORAGE_USER);
            if (item) {
                this._user = User.fromJSON(item);
            }
        }

        return this._user;
    }

}
