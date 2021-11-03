/* eslint-env node */

const AbstractModel = require("./AbstractModel");

/**
 * Repräsentiert eine einmalige sportliche Betätigung über einen bestimmten
 * Zeitraum
 */
class Sport extends AbstractModel {

    static fromJSON(_json) {
        const json = (typeof _json === "string")
            ? JSON.parse(_json)
            : _json;

        return new Sport(
            json.id,
            json.user_id,
            json.date,
            json.duration,
            json.intensity,
        );
    }

    /**
     * Erstellt einen neuen Datensatz
     *
     * @param {number} id Die ID
     * @param {number} user_id Die Nutzer-ID
     * @param {number} date Der UNIX-Timestamp (in Sekunden) zu dem die Betätigung ausgeführt wurde
     * @param {number} duration Die Dauer der Betätigung in Sekunden
     * @param {number} intensity Die Intensität
     */
    constructor(id, user_id, date, duration, intensity) {
        super();

        this._id = id;
        this._user_id = user_id;
        this._date = date;
        this._duration = duration;
        this._intensity = intensity;
    }

    toJSON() {
        return {
            id: this._id,
            userId: this._user_id,
            date: this._date,
            duration: this._duration,
            intensity: this._intensity,
        };
    }

    /**
     * Die eindeutige ID.
     *
     * @readonly
     * @type {number}
     */
    get id() {
        return this._id;
    }

    /**
     * Die ID des Nutzers
     *
     * @readonly
     * @type {number}
     */
    get user_id() {
        return this._user_id;
    }

    /**
     * Der UNIX-Timestamp in Sekunden, zu dem die Betätigung stattgefunden hat
     *
     * @type {number}
     */
    get date() {
        return this._date;
    }

    /**
     * Die Dauer der Betätigung in Sekunden
     *
     * @type {number}
     */
    get duration() {
        return this._duration;
    }

    /**
     * Die Intensität der Betätigung in Sekunden
     *
     * @type {number}
     */
    get intensity() {
        return this._intensity;
    }

    set date(date) {
        this.addChangedField("date");
        return this._date = date;
    }

    set duration(duration) {
        this.addChangedField("duration");
        return this._duration = duration;
    }

    set intensity(intensity) {
        this.addChangedField("intensity");
        return this._intensity = intensity;
    }

}
module.exports = Sport;
