/* eslint-env es11 */

import SessionManager, { API_BASEURL } from "../util/SessionManager";
import { MEAL_UPDATE, USER_LOGIN, USER_LOGOUT } from "../util/events";
import db from "../util/db";
import Meal from "./Meal";
import MealType from "./MealType";

/**
 * @typedef {object} MealTypeData
 * @prop {!string} name Der Name des Gerichts
 * @prop {!number} calories Die Kalorienzahl des Gerichts
 */

/**
 * @typedef {object} MealData
 * @prop {!number} date Der Timestamp (in Sekunden) zu dem die Mahlzeit gegessen wurde
 * @prop {!number} typeId Die ID des Mahlzeit-Typs
 */

/**
 * Verwaltet den Cache der Mahlzeiten und Mahlzeit-Typen, und aktualisiert
 * diesen bei Bedarf automatisch mit Daten aus dem Backend.
 *
 * **Alle Timestamps sind in Sekunden anzugeben, nicht Millisekunden!**
 */
export default class MealRepository {

    /**
     * Returnt die Instanz dieser Klasse
     *
     * @return {MealRepository}
     */
    static getInstance() {
        if (!this._instance) {
            this._instance = new MealRepository();
            this._instance.refreshIfEmpty();
        }

        return this._instance;
    }

    constructor() {
        if (this.constructor._instance) {
            throw new Error("Repositories dürfen nur über getInstance() instanziiert werden");
        }

        /**
         * @private
         * @type {SessionManager}
         */
        this._sessionManager = SessionManager.getInstance();

        window.document.addEventListener(USER_LOGIN, () => this.refresh());
        window.document.addEventListener(USER_LOGOUT, () => this.clear());
    }

    /**
     * Leert den Cache und holt alle Daten neu vom Backend
     *
     * @return {Promise<void>}
     */
    async refresh() {
        if (!this._sessionManager.isLoggedIn) {
            throw new Error("Nicht eingeloggt");
        }

        // Datenbank-Cache leeren und parallel alle Mahlzeiten/Gerichte neu holen
        let response;
        const getResponse = async () => {
            response = await this._sessionManager.getJSONAuth(API_BASEURL + "/meal");
        };

        await Promise.all([
            // hier keine awaits weil wir die Promise brauchen
            db.meals.clear(),
            db.mealTypes.clear(),
            getResponse(),
        ]);

        if (response.mealTypes.length > 0) {
            await db.mealTypes.bulkPut(response.mealTypes);
        }

        for (const meal of response.meals) {
            if (typeof meal.typeId === "number") {
                const mealType = await db.mealTypes.get(meal.typeId);
                if (mealType === null) {
                    continue;
                }

                meal.name = mealType.name;
                meal.calories = mealType.calories;
                meal.carbs = mealType.carbs;
                meal.proteins = mealType.proteins;
                meal.fat = mealType.fat;
            }

            await db.meals.put(meal);
        }

        window.document.dispatchEvent(new CustomEvent(MEAL_UPDATE));
    }

    /**
     * Holt alle Daten neu vom Backend falls der Mahlzeiten und/oder der Mahlzeit-Typen
     * Cache leer ist
     *
     * @return {Promise<void>}
     */
    async refreshIfEmpty() {
        let mealsEmpty, mealTypesEmpty;

        await Promise.all([
            async () => mealsEmpty = await db.meals.count() === 0,
            async () => mealTypesEmpty = await db.mealTypes.count() === 0,
        ]);

        if (mealsEmpty || mealTypesEmpty) {
            await this.refresh();
        }
    }

    /**
     * Leert den lokalen Cache
     *
     * @return {Promise<void>}
     */
    async clear() {
        await Promise.all([
            db.meals.clear(),
            db.mealTypes.clear(),
        ]);
    }

    /**
     * Fügt eine neue Art von Mahlzeit im Backend und im Cache hinzu
     *
     * @param {MealTypeData} typeData Die Daten des neu hinzuzufügenden Gerichts
     * @return {Promise<MealType>} Der neu erstellte Mahlzeit-Typ
     */
    async addMealType(typeData) {
        const newTypeResponse = await this._sessionManager.postJSONAuth(
            API_BASEURL + "/meal/type",
            typeData,
        );
        const newType = MealType.fromJSON(newTypeResponse.mealType);
        await db.mealTypes.add(newTypeResponse.mealType);
        window.document.dispatchEvent(new CustomEvent(MEAL_UPDATE));
        return newType;
    }

    /**
     * Fügt eine einzelne neue Mahlzeit im Backend ind im Cache hinzu
     *
     * @param {MealData} data Die Daten der neu hinzuzufügenden Mahlzeit
     * @return {Promise<Meal>} Die neu erstellte Mahlzeit
     */
    async addMeal(data) {
        const newMealResponse =
            await this._sessionManager.postJSONAuth(API_BASEURL + "/meal", data);
        await db.meals.add(newMealResponse.meal);
        window.document.dispatchEvent(new CustomEvent(MEAL_UPDATE));
        return Meal.fromJSON(newMealResponse.meal);
    }

    /**
     * Löscht einen Mahlzeit-Typen und alle eingetragenen Mahlzeiten die diesen
     * Typ haben aus dem Cache und der serverseitigen Datenbank
     *
     * @param {MealType} mealType Der Mahlzeit-Typ der gelöscht werden soll
     * @return {Promise<void>}
     */
    async deleteMealType(mealType) {
        await Promise.all([
            this._sessionManager.deleteJSONAuth(
                API_BASEURL + "/meal/type",
                { id: mealType.id },
            ),
            db.meals.where("typeId").equals(mealType.id).delete(),
            db.mealTypes.where("id").equals(mealType.id).delete(),
        ]);

        window.document.dispatchEvent(new CustomEvent(MEAL_UPDATE));
    }

    /**
     * Returnt ein Array mit allen Mahlzeit-Typen
     *
     * @return {Promise<MealType[]>} Das Array
     */
    async getMealTypes() {
        const types = [];

        await db.mealTypes.each(item => types.push(MealType.fromJSON(item)));

        return types;
    }

    /**
     * Returnt ein Array mit allen Mahlzeit-Typen, absteigend nach Kalorienzahl sortiert
     *
     * @return {Promise<MealType[]>} Das Array
     */
    async getSortedMealTypes() {
        const types = [];

        await db.mealTypes
            .orderBy("calories")
            .reverse()
            .each(item => types.push(MealType.fromJSON(item)));

        return types;
    }

    /**
     * Gibt alle Mahlzeiten die ab einem bestimmten Zeitpunkt gegessen wurden
     * zurück
     *
     * @param {!number} minTimestamp Der früheste Timestamp (in Sekunden) der
     *     Mahlzeiten
     * @return {Promise<Meal[]>} Ein Array mit allen Mahlzeiten seit dem Timestamp
     */
    async getMealsSince(minTimestamp) {
        const meals = [];

        await db.meals
            .where("date")
            .aboveOrEqual(minTimestamp)
            .each(item => meals.push(Meal.fromJSON(item)));

        return meals;
    }

    /**
     * Gibt alle zugenommenen Mahlzeiten in einem bestimmten Zeitraum zurück
     *
     * @param {!number} minTimestamp Der Start-Timestamp des ausgewählten Zeitraums
     * @param {!number} maxTimestamp Der End-Timestamp des ausgewählten Zeitraums
     * @return {Promise<Meal[]>} Alle Mahlzeiten im gewählten Zeitraum
     */
    async getMealsFromTo(minTimestamp, maxTimestamp) {
        const meals = [];

        await db.meals
            .where("date")
            .between(minTimestamp, maxTimestamp)
            .each(item => meals.push(Meal.fromJSON(item)));

        return meals;
    }

    /**
     *
     * @param {!number} minTimestamp Der Start-Timestamp des ausgewählten Zeitraums
     * @param {!number} maxTimestamp Der End-Timestamp des ausgewählten Zeitraums
     */
    async getCaloriesFromTo(minTimestamp, maxTimestamp) {
        let sum = 0;

        await db.meals
            .where("date")
            .between(minTimestamp, maxTimestamp)
            .each(item => sum += item.calories);

        return sum;
    }

}
