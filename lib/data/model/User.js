/* eslint-env node */
/* eslint-disable camelcase */

const AbstractModel = require("./AbstractModel");

/**
 * Data Model Klasse für einen Nutzer.
 * Jede Instanz dieser Klasse repräsentiert einen Datensatz in der Datenbank. Jede Property dieses
 * Models ist nach ihrem entsprechenden Spaltennamen in der SQLite-Datenbank benannt.
 */
class User extends AbstractModel {

    static fromJSON(json) {
        return new User(
            json.id,
            json.user_name,
            json.pwd,
            json.email,
            json.first_name,
            json.last_name,
            json.birth_date,
            json.weight,
            json.gender,
            json.height,
        );
    }

    /**
     * Erstellt ein neues User-Model.
     * Dies hat keinerlei Auswirkungen auf die Datenbank, das Objekt muss erst über das
     * UserRepository gespeichert werden.
     *
     * @param {number} id Die eindeutige ID
     * @param {string} user_name Der eindeutige Benutzername
     * @param {string} pwd Das gehashte Passwort
     * @param {string} email Die E-Mail Adresse
     * @param {string} first_name Der Vorname
     * @param {string} last_name Der Nachname
     * @param {number} birth_date Das Geburtsdatum als UNIX-Timestamp
     * @param {number} weight Das Gewicht in Kilogramm
     * @param {string} gender Das Geschlecht ("male" für männlich, "female" für weiblich)
     * @param {number} height Die Körpergröße in Meter
     */
    constructor(id, user_name, pwd, email, first_name, last_name, birth_date, weight, gender, height) {
        super();

        /** @private */
        this._id = id;
        /** @private */
        this._user_name = user_name;
        /** @private */
        this._pwd = pwd;
        /** @private */
        this._email = email;
        /** @private */
        this._first_name = first_name;
        /** @private */
        this._last_name = last_name;
        /** @private */
        this._birth_date = birth_date;
        /** @private */
        this._weight = weight;
        /** @private */
        this._gender = gender;
        /** @private */
        this._height = height;
    }

    /**
     * @inheritdoc
     * @override
     */
    toJSON() {
        return {
            userName: this._user_name,
            email: this._email,
            firstName: this._first_name,
            lastName: this._last_name,
            birthDate: this._birth_date,
            weight: this._weight,
            gender: this._gender,
            height: this._height,
        };
    }

    /**
     * Die eindeutige ID des Nutzers.
     * Dieser Wert ändert sich nie.
     *
     * @readonly
     * @type {number}
     */
    get id() {
        return this._id;
    }

    /**
     * Der eindeutige Benutzername des Nutzers.
     * Im Gegensatz zur ID kann dieser jederzeit geändert werden.
     *
     * @type {string}
     */
    get user_name() {
        return this._user_name;
    }

    set user_name(user_name) {
        this.addChangedField("user_name");
        return this._user_name = user_name;
    }

    /**
     * Das gehashte Passwort des Nutzers
     *
     * @type {string}
     */
    get pwd() {
        return this._pwd;
    }

    set pwd(pwd) {
        this.addChangedField("pwd");
        return this._pwd = pwd;
    }

    /**
     * Die E-Mail Adresse des Nutzers
     *
     * @type {string}
     */
    get email() {
        return this._email;
    }

    set email(email) {
        this.addChangedField("email");
        return this._email = email;
    }

    /**
     * Der Vorname des Nutzers
     *
     * @type {string}
     */
    get first_name() {
        return this._first_name;
    }

    set first_name(first_name) {
        this.addChangedField("first_name");
        return this._first_name = first_name;
    }

    /**
     * Der Nachname des Nutzers
     *
     * @type {string}
     */
    get last_name() {
        return this._last_name;
    }

    set last_name(last_name) {
        this.addChangedField("last_name");
        return this._last_name = last_name;
    }

    /**
     * Das Geburtsdatum des Nutzers als UNIX-Timestamp
     *
     * @type {number}
     */
    get birth_date() {
        return this._birth_date;
    }

    set birth_date(birth_date) {
        this.addChangedField("birth_date");
        return this._birth_date = birth_date;
    }

    /**
     * Das Gewicht des Nutzers in Kilogramm
     *
     * @type {number}
     */
    get weight() {
        return this._weight;
    }

    set weight(weight) {
        this.addChangedField("weight");
        return this._weight = weight;
    }

    /**
     * Das Geschlecht des Nutzers.
     * "male" für männlich, "female" für weiblich, oder ein beliebiger anderer
     * Wert für ein nonbinäres Geschlecht.
     *
     * @type {string}
     */
    get gender() {
        return this._gender;
    }

    set gender(gender) {
        this.addChangedField("gender");
        return this._gender = gender;
    }

    /**
     * Die Größe des Nutzers in Meter
     *
     * @type {number}
     */
    get height() {
        return this._height;
    }

    set height(height) {
        this.addChangedField("height");
        return this._height = height;
    }

}
module.exports = User;
