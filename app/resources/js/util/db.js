/* eslint-env es11 */

import Dexie from "dexie";

/**
 * Der clientseitige Datenbank-Cache für Nutzerdaten
 *
 * @type {Dexie}
 */
const db = new Dexie("appDb");
db.version(1).stores({
    mealTypes: "id,calories",
    meals: "id,typeId,date",
    sports: "id,date",
});
db.open();

export default db;
