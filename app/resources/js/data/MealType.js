/* eslint-env es11 */

/**
 * Clientseitiges Datenmodell für Mahlzeit-Typen.
 * Alle Properties mit dem Präfix `UI` repräsentieren die Daten in einem menschenlesbaren Format
 * und sind daher zur Ausgabe auf der Benutzeroberfläche geeignet (**jedoch nicht HTML-escaped!**).
 */
export default class MealType {

    /**
     * Parst ein JSON-Objekt vom Backend in eine Instanz dieser Klasse
     *
     * @param {object|string} _json Die JSON-Daten vom Backend
     */
    static fromJSON(_json) {
        const json = (typeof _json === "string")
            ? JSON.parse(_json)
            : _json;

        return new MealType(
            json.id,
            json.name,
            json.calories,
            json.carbs,
            json.proteins,
            json.fat,
        );
    }

    /**
     * Erstellt einen neuen Mahlzeit-Typ
     *
     * @param {!number} id Die ID
     * @param {!string} name Der Name
     * @param {!number} calories Die Kalorienzahl
     * @param {!number} carbs Der Anteil an Kohlenhydraten in Gramm pro Portion
     * @param {!number} proteins Der Anteil an Proteinen in Gramm pro Portion
     * @param {!number} fat Der Anteil an Fett in Gramm pro Portion
     */
    constructor(id, name, calories, carbs, proteins, fat) {
        /** @private */
        this._numberFormat = new Intl.NumberFormat();

        /**
         * @type {!number}
         */
        this.id = id;
        /**
         * @type {!string}
         */
        this.name = name;
        /**
         * @type {!number}
         */
        this.calories = calories;
        /**
         * @type {!number}
         */
        this.carbs = carbs;
        /**
         * @type {!number}
         */
        this.proteins = proteins;
        /**
         * @type {!number}
         */
        this.fat = fat;
    }

    /**
     * Returnt eine JSON-Rerpräsentation dieses Mahlzeit-Typs zur Übermittlung
     * ans Backend
     *
     * @return {object} Dieses Objekt als JSON
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            calories: this.calories,
            carbs: this.carbs,
            proteins: this.proteins,
            fat: this.fat,
        };
    }

    /**
     * Der Name des Gerichts für die Anzeige auf der UI
     *
     * @type {!string}
     */
    get UIName() {
        return this.name;
    }

    /**
     * Das Datum zu dem die Mahlzeit gegesen wurde zur Ausgabe auf der UI
     *
     * @type {!string}
     */
    get UIDate() {
        return this.date.toLocaleString();
    }

    /**
     * Die Kalorienzahl pro Portion für die Anzeige auf der UI
     *
     * @type {!string}
     */
    get UICalories() {
        return this._numberFormat.format(this.calories) + " kcal";
    }

    /**
     * Die Kalorienzahl pro Portion für die Anzeige auf der UI
     *
     * @type {!string}
     */
    get UICarbs() {
        return this._numberFormat.format(this.carbs) + " g";
    }

    /**
     * Die Kalorienzahl pro Portion für die Anzeige auf der UI
     *
     * @type {!string}
     */
    get UIProteins() {
        return this._numberFormat.format(this.proteins) + " g";
    }

    /**
     * Die Kalorienzahl pro Portion für die Anzeige auf der UI
     *
     * @type {!string}
     */
    get UIFat() {
        return this._numberFormat.format(this.fat) + " g";
    }

}
