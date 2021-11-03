/* eslint-env es11 */

/**
 * Clientseitiges Datenmodell für Mahlzeiten.
 * Alle Properties mit dem Präfix `UI` repräsentieren die Daten in einem menschenlesbaren Format
 * und sind daher zur Ausgabe auf der Benutzeroberfläche geeignet (**jedoch nicht HTML-escaped!**).
 */
export default class Meal {

    static fromJSON(_json) {
        const json = (typeof _json === "string")
            ? JSON.parse(_json)
            : _json;

        return new Meal(
            json.id,
            json.name,
            json.date,
            json.calories,
            json.carbs,
            json.proteins,
            json.fat,
        );
    }

    /**
     * Erstellt eine neue Mahlzeit
     *
     * @param {!number} id Die ID
     * @param {!string} name Der Name der Mahlzeit
     * @param {!number} date Der UNIX Timestamp (in Sekunden) wann die Mahlzeit
     *     gegessen wurde
     * @param {!number} calories Die Kalorienzahl pro Portion
     * @param {!number} carbs Der Anteil an Kohlenhydraten in Gramm pro Portion
     * @param {!number} proteins Der Anteil an Proteinen in Gramm pro Portion
     * @param {!number} fat Der Anteil an Fett in Gramm pro Portion
     */
    constructor(id, name, date, calories, carbs, proteins, fat) {
        /**
         * @type {?number}
         */
        this.id = id;
        /**
         * @type {!string}
         */
        this.name = name;
        /**
         * @type {!Date}
         */
        this.date = new Date(date * 1000 /* Millisekunden */);
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
     * Der Name des Gerichts für die Anzeige auf der UI
     *
     * @type {string}
     */
    get UIName() {
        return this.name;
    }

    /**
     * Der Zeitpunkt zu dem diese Mahlzeit aufgenommen wurde als formatierter Datestring
     *
     * @type {string}
     */
    get UIDate() {
        return this.date.toLocaleDateString();
    }

    /**
     * Die Kalorienzahl des Gerichts für die Anzeige auf der UI
     *
     * @type {string}
     */
    get UICalories() {
        return `${this.calories} kcal`;
    }

    /**
     * Der Gehalt an Kohlenhydraten zur Ausgabe auf der UI
     *
     * @type {!string}
     */
    get UICarbs() {
        return `${this.carbs} g`;
    }

    /**
     * Der Gehalt an Proteinen zur Ausgabe auf der UI
     *
     * @type {!string}
     */
    get UIProteins() {
        return `${this.proteins} g`;
    }

    /**
     * Der Gehalt an Fett zur Ausgabe auf der UI
     *
     * @type {!string}
     */
    get UIFat() {
        return `${this.fat} g`;
    }

}
