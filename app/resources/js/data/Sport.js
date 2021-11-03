/* eslint-env es11 */

export default class Sport {

    static get INTENSITY_LOW() {
        return 100;
    }

    static get INTENSITY_MEDIUM() {
        return 200;
    }

    static get INTENSITY_HIGH() {
        return 300;
    }

    /**
     * Erstellt eine neue Instanz dieser Klasse aus Daten vom Backend
     *
     * @param {object|string} _json Das JSON-Objekt vom Backend
     * @return {Sport} Die Instanz
     */
    static fromJSON(_json) {
        const json = (typeof _json === "string")
            ? JSON.parse(_json)
            : _json;

        return new Sport(
            json.id,
            json.date,
            json.duration,
            json.intensity,
        );
    }

    /**
     * Erstellt einen neuen Datensatz sportlicher Betätigung
     *
     * @param {number} id Die ID der Betätigung
     * @param {number} date Der Zeitpunkt der Betätigung als UNIX-Timestamp in Sekunden
     * @param {number} duration Die Dauer der Betätigung in Sekunden
     * @param {number} intensity Die Intensität der Betätigung
     */
    constructor(id, date, duration, intensity) {
        this._numberFormat = new Intl.NumberFormat();

        this.id = id;
        this.date = new Date(date * 1000 /* Millisekunden */);
        this.duration = duration;
        this.intensity = intensity;
    }

    /**
     * Returnt eine JSON-Repräsentation dieses Objekts
     *
     * @return {object}
     */
    toJSON() {
        return {
            id: this.id,
            date: this.date,
            duration: this.duration,
            intensity: this.intensity,
        };
    }

    /**
     * Das Datum der sportlichen Betätigung in menschenlesbarem Format
     *
     * @readonly
     * @type {string}
     */
    get UIDate() {
        return this.date.toLocaleDateString();
    }

    /**
     * Die Dauer der sportlichen betätigung in menschenlesbarem Format
     *
     * @readonly
     * @type {string}
     */
    get UIDuration() {
        const minutes = Math.ceil(this.duration / 60);
        const unit = minutes === 1 ? "Minute" : "Minuten";
        return `${this._numberFormat.format(minutes)} ${unit}`;
    }

    /**
     * Die Intensit#t der sportlichen Betätigung in menschenlesbarem Format
     *
     * @readonly
     * @type {string}
     */
    get UIIntensity() {
        if (this.intensity >= 300) {
            return "hoch";
        }
        if (this.intensity >= 200) {
            return "mittel";
        }
        return "niedrig";
    }

}
