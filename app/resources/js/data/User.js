/* eslint-env es2020 */

/**
 * Clientseitiges Datenmodell für Nutzer.
 * Alle Properties mit dem Präfix `UI` repräsentieren die Daten in einem menschenlesbaren Format
 * und sind daher zur Ausgabe auf der Benutzeroberfläche geeignet (**jedoch nicht HTML-escaped!**).
 */
export default class User {

    /**
     * Erstellt eine Instanz dieser Klasse aus Daten vom Backend oder den localStorage
     *
     * @param {string|object} _json Die JSON-Daten, oder ihre String-Repräsentation
     * @return {User|null} Die User-Instanz, oder `null` wenn die Daten ungültig sind
     */
    static fromJSON(_json) {
        const json = (typeof _json === "string")
            ? JSON.parse(_json)
            : _json;

        return new User(
            json.id,
            json.userName,
            json.email,
            json.firstName,
            json.lastName,
            new Date(json.birthDate * 1000 /* millisekunden */),
            json.weight,
            json.gender,
            json.height,
        );
    }

    /**
     * Nur für internen Gebrauch, immer die statische {@link #fromJSON} verwenden!
     *
     * @private
     * @param {number} id Die Nutzer-ID
     * @param {string} userName Der Nutzername
     * @param {string} email Die E-Mail
     * @param {string} firstName Der Vorname
     * @param {string} lastName Der Nachname
     * @param {Date} birthDate Das Geburtsdatum in UTC als ein Date-Objekt
     * @param {number} weight Das Gewicht in Kilogramm
     * @param {string} gender Das Geschlecht ("male" für männlich, "female" für weiblich)
     * @param {number} height Die Größe in Meter
     */
    constructor(id, userName, email, firstName, lastName, birthDate, weight, gender, height) {
        /** @private */
        this._numberFormat = new Intl.NumberFormat();

        this.id = id;
        this.userName = userName;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        /**
         * Das Geburtsdatum in UTC als ein Date-Objekt.
         *
         * @type {Date}
         * @private
         */
        this.birthDate = birthDate;
        this.weight = weight;
        this.gender = gender;
        this.height = height;
    }

    /**
     * Gibt eine JSON-repräsentation dieses Nutzers zur Kommunikation mit dem Backend oder Speichern
     * im localStorage zurück
     */
    toJSON() {
        return {
            id: this.id,
            userName: this.userName,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: Math.floor(this.birthDate.getTime() / 1000 /* millisekunden */),
            weight: this.weight,
            gender: this.gender,
            height: this.height,
        };
    }

    get UIUserName() {
        return this.userName;
    }

    get UIEmail() {
        return this.email;
    }

    get UIFirstName() {
        return this.firstName;
    }

    get UILastName() {
        return this.lastName;
    }

    get UIFullName() {
        return this.firstName + " " + this.lastName;
    }

    get UIBirthDate() {
        // Zeitzone explizit auf UTC setzen um sicherzustellen dass der Tag nicht über-/unterläuft
        return this.birthDate.toLocaleDateString(undefined, { timeZone: "UTC" });
    }

    get UIWeight() {
        return this._numberFormat.format(this.weight) + " kg";
    }

    get UIGender() {
        switch (this.gender) {
            case "male":
                return "Männlich";
            case "female":
                return "Weiblich";
            default:
                return this.gender;
        }
    }

    get UIHeight() {
        return this._numberFormat.format(this.height) + " m";
    }

}
