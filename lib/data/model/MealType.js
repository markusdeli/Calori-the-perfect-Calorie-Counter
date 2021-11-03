/* eslint-env node */

const AbstractModel = require("./AbstractModel");

/**
 * Repräsentiert einen Mahlzeit-Typ
 */
class MealType extends AbstractModel {

    static fromJSON(json) {
        return new MealType(
            json.id,
            json.user_id,
            json.name,
            json.calories,
            json.carbs,
            json.proteins,
            json.fat,
        );
    }

    /**
     * Erstelle einen neuen Mahlzeit-Typen
     *
     * @param {number} id Die ID (-1 für neu zu erstellende Datensätze)
     * @param {!number} user_id Die Nutzer-ID
     * @param {!string} name Der Anzeigename
     * @param {!number} calories Die Kalorienzahl pro Portion
     * @param {!number} carbs Der Anteil an Kohlenhydraten in Gramm pro Portion
     * @param {!number} proteins Der Anteil an Proteinen in Gramm pro Portion
     * @param {!number} fat Der Anteil an Fett in Gramm pro Portion
     */
    constructor(id, user_id, name, calories, carbs, proteins, fat) {
        super();

        /** @private */
        this._id = id;
        /** @private */
        this._user_id = user_id;
        /** @private */
        this._name = name;
        /** @private */
        this._calories = calories;
        /** @private */
        this._carbs = carbs;
        /** @private */
        this._proteins = proteins;
        /** @private */
        this._fat = fat;
    }

    /**
     * Returnt diesen Datensatz als ein JSON Objekt das an den Client geschickt werden kann
     *
     * @return {object}
     */
    toJSON() {
        return {
            id: this._id,
            userId: this._user_id,
            name: this._name,
            calories: this._calories,
            carbs: this._carbs,
            proteins: this._proteins,
            fat: this._fat,
        };
    }

    /**
     * Die eindeutige ID dieses MealTypes
     *
     * @type {number}
     * @readonly
     */
    get id() {
        return this._id;
    }

    /**
     * Die eindeutige ID des Nutzers der diesen MealType erstellt hat
     *
     * @type {number}
     * @readonly
     */
    get user_id() {
        return this._user_id;
    }

    /**
     * Der Name der Mahlzeit
     *
     * @type {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Die Kilocalorien pro Portion
     *
     * @type {number}
     */
    get calories() {
        return this._calories;
    }

    /**
     * Die Menge an Kohlenhydraten in Gramm pro Portion
     *
     * @type {number}
     */
    get carbs() {
        return this._carbs;
    }

    /**
     * Die Menge an Proteinen in Gramm pro Portion
     *
     * @type {number}
     */
    get proteins() {
        return this._proteins;
    }

    /**
     * Die Menge an Fett in Gramm pro Portion
     *
     * @type {number}
     */
    get fat() {
        return this._fat;
    }

    set name(name) {
        this.addChangedField("name");
        return this._name = name;
    }

    set calories(calories) {
        this.addChangedField("calories");
        return this._calories = calories;
    }

    set carbs(carbs) {
        this.addChangedField("carbs");
        return this._carbs = carbs;
    }

    set proteins(proteins) {
        this.addChangedField("proteins");
        return this._proteins = proteins;
    }

    set fat(fat) {
        this.addChangedField("fat");
        return this._fat = fat;
    }

}
module.exports = MealType;
