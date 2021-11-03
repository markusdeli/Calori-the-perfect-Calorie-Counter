/* eslint-env es11 */

import db from "../util/db";
import SessionManager, { API_BASEURL } from "../util/SessionManager";
import Sport from "./Sport";
import { SPORT_UPDATE, USER_LOGIN, USER_LOGOUT } from "../util/events";

/**
 * @typedef {object} SportData
 * @prop {number} date Der Zeitpunkt der Betätigung als UNIX-Timestamp in Sekunden
 * @prop {number} duration Die Dauer der Betätigung in Sekunden
 * @prop {number} intensity Die Intensität der Betätigung
 */

/**
 * Clientseitige Repository-Implementierung für sportliche Betätigungen.
 * Arbeitet mit einem IndexedDB-Cache.
 */
export default class SportRepository {

    static getInstance() {
        if (!this._instance) {
            this._instance = new SportRepository();
            this._instance.refreshIfEmpty();
        }

        return this._instance;
    }

    constructor() {
        if (SportRepository._instance) {
            throw new Error(
                "Use the static getInstance() method for obtaining the instance of this class",
            );
        }

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

        let response;
        const getResponse = async () => {
            response = await this._sessionManager.getJSONAuth(API_BASEURL + "/sport");
        };

        await Promise.all([
            // Kein await
            db.sports.clear(),
            getResponse(),
        ]);

        if (response.sports.length > 0) {
            await db.sports.bulkPut(response.sports);
        }

        window.document.dispatchEvent(new CustomEvent(SPORT_UPDATE));
    }

    /**
     * Holt alle Daten neu vom Backend falls der Cache leer ist
     *
     * @return {Promise<void>}
     */
    async refreshIfEmpty() {
        if (await db.sports.count() === 0) {
            await this.refresh();
        }
    }

    /**
     * Leert den lokalen Cache
     *
     * @return {Promise<void>}
     */
    async clear() {
        await db.sports.clear();
    }

    /**
     * Fügt eine einzelne neue sportliche Betätigung im Backend und Cache hinzu
     *
     * @param {MealData} data Die Daten der neu hinzuzufügenden Betätigung
     * @return {Promise<Sport>} Die neu erstellte Betätigung
     */
    async addSport(sportData) {
        const newSportResponse = await this._sessionManager.postJSONAuth(
            API_BASEURL + "/sport",
            sportData,
        );
        await db.sports.add(newSportResponse.sport);
        window.document.dispatchEvent(new CustomEvent(SPORT_UPDATE));
        return Sport.fromJSON(newSportResponse.sport);
    }

    /**
     * Gibt alle sportlichen Betätigungen in einem bestimmten Zeitraum zurück
     *
     * @param {!number} minTimestamp Der Start-Timestamp des ausgewählten Zeitraums
     * @param {!number} maxTimestamp Der End-Timestamp des ausgewählten Zeitraums
     * @return {Promise<Sport[]>} Alle Betätigungen im gewählten Zeitraum
     */
    async getAllFromTo(minTimestamp, maxTimestamp) {
        const sports = [];

        await db.sports
            .where("date")
            .between(minTimestamp, maxTimestamp)
            .each(item => sports.push(Sport.fromJSON(item)));

        return sports;
    }

    /**
     * Erstelle eine gweichtete Summe aller sportlichen Betätigungen im angegebenen Zeitraum,
     * indem die Dauer jeder einzelnen Betätigung mit deren Intensität multipliziert und
     * dann alles zusammen addiert wird. Die tatsächliche Implementierung garantiert ausschließlich
     * ein einheitliches Verhältnis der Werte zueinander, nicht die Einheitlichkeit absoluter Werte.
     *
     * @param {!number} minTimestamp Der Start-Timestamp des ausgewählten Zeitraums
     * @param {!number} maxTimestamp Der End-Timestamp des ausgewählten Zeitraums
     * @return {Promise<number>} Die gewichtete Summe aller sportlichen Betätigungen
     *     im angegebenen Zeitraum
     */
    async getWeightedSumFromTo(minTimestamp, maxTimestamp) {
        let weightedSum = 0;

        await db.sports
            .where("date")
            .between(minTimestamp, maxTimestamp)
            .each(item =>
                weightedSum += (item.duration / 60) * item.intensity);

        return weightedSum;
    }

}
