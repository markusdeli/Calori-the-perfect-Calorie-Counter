/* eslint-env node */

const AbstractModel = require("./AbstractModel");
const MealType = require("./MealType");

/**
 * Datenmodell für Mahlzeiten.
 * Bevor ein Nutzer Mahlzeiten hinzufügen kann, muss er einen neuen Typ dafür
 * erstellen. In diesem wird der Name und die Kalorienzahl gespeichert, womit
 * Beliebig viele identische Mahlzeiten zu unterschiedlichen Zeiten hinzugefügt
 * werden können. In den einzelnen Mahlzeiten muss dann nur noch das Datum des
 * Verspeisens gespeichert werden, wodurch Redundanz minimiert wird.
 * Die Berechnung der Gesamtzahl an zugenommenen Kalorien wird dann clientseitig
 * erledigt, was die Auslastung des Backends weiter reduziert.
 */
class Meal extends AbstractModel {

    static fromJSON(json) {
        return new Meal(
            json.id,
            json.type_id,
            json.user_id,
            json.date,
        );
    }

    constructor(id, type_id, user_id, date) {
        super();

        this._id = id;
        this._type_id = type_id;
        this._user_id = user_id;
        this._date = date;
    }

    /**
     * @inheritdoc
     * @override
     * @param {?MealType} mealType Falls angegeben, werden zusätzlich noch Name
     *     und Kalorienzahl der Mahlzeit mit ins JSON aufgenommen
     */
    toJSON(mealType) {
        const json = {
            id: this._id,
            typeId: this._type_id,
            userId: this._user_id,
            date: this._date,
        };

        if (mealType instanceof MealType) {
            json.name = mealType.name;
            json.calories = mealType.calories;
            json.carbs = mealType.carbs;
            json.proteins = mealType.proteins;
            json.fat = mealType.fat;
        }

        return json;
    }

    /**
     * Die eindeutige ID dieser Mahlzeit
     *
     * @readonly
     * @type {number}
     */
    get id() {
        return this._id;
    }

    /**
     * Der Typ dieser Mahlzeit
     *
     * @readonly
     * @type {number}
     */
    get type_id() {
        return this._type_id;
    }

    /**
     * Die ID des Nutzers dem diese Mahlzeit gehört.
     * Dies ließe sich zwar auch über den MealType herausfinden, allerdings
     * würde das die Last auf der Datenbank signifikant erhöhen.
     *
     * @readonly
     * @type {number}
     */
    get user_id() {
        return this._user_id;
    }

    /**
     * Der UNIX-Timestamp (in sekunden) zu dem diese Mahlzeit gegessen wurde
     *
     * @readonly
     * @type {number}
     */
    get date() {
        return this._date;
    }

}
module.exports = Meal;
