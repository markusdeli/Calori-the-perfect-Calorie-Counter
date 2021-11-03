/* eslint-env node */

/**
 * Wrapper für die sqlite3.Statement-Klasse mit Unterstützung für Promises.
 * Das sqlite3-promise Paket auf npm ist zuletzt vor 3 Jahren aktualisiert worden, daher dieser
 * selbstgeschriebene Wrapper.
 * Die APIs funktionieren, bis auf die durch den Promise-Mechanismus ersetzten Callbacks, genauso
 * wie das Original: {@link https://github.com/mapbox/node-sqlite3/wiki/API#statement}
 */
class StatementWrapper {

    /**
     * Wird nur intern verwendet, Statemens sollten ausschließlich über
     * {@link import("./DatabaseWrapper")#prepare} erstellt werden
     *
     * @param stmt Die ursprüngliche Instanz des sqlite3-Statements
     */
    constructor(stmt) {
        this._stmt = stmt;
    }

    /**
     * Führt das Statement mit den angegebenen Parametern aus und returnt alle
     * von der Operation zurückgegebenen Datensätze
     *
     * @param  {...any} params Binding-Parameter in der Reihenfolge in der sie
     *     im originalen Query-String erscheinen.  Sollte über {@link #bind}
     *     gemacht werden.
     * @return {Promise<Array<any>>} Ein Array mit allen Datensätzen
     */
    all(...params) {
        return new Promise((resolve, reject) => {
            this._stmt.all(...params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Bindet die Parameter (`?`) im SQL-Statement auf die angegebenen Werte
     *
     * @param  {...any} params Die Binding-Parameter in der Reihenfolge in der sie im Statement stehen
     */
    bind(...params) {
        return new Promise((resolve, reject) => {
            this._stmt.bind(...params, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Beendet das Statement wenn es nicht mehr verwendet wird.
     * Theoretisch optional, sollte aber immer gemacht werden.
     */
    finalize() {
        return new Promise(resolve => {
            this._stmt.finalize(() => resolve());
        });
    }

    /**
     * Führt das Statement auf der Datenbank aus und gibt den ersten Datensatz
     * des Resultats zurück
     *
     * @param {...any} params Alle Binding-Parameter für dieses Statement. Sollte im Idealfall nicht
     *     angegeben werden müssen, anstattdessen sollte die {@link #bind} Methode verwendet werden.
     * @return {Promise} Eine Promise für die erste zurückgegebene SQL-Row
     */
    get(...params) {
        return new Promise((resolve, reject) => {
            this._stmt.get(...params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * Führt das Statement auf der Datenbank aus
     *
     * @param {...any} params Alle Binding-Parameter für dieses Statement. Sollte im Idealfall nicht
     *     angegeben werden müssen, anstattdessen sollte die {@link #bind} Methode verwendet werden.
     * @return {Promise} Eine Promise für die zurückgegebene(n) SQL-Row(s)
     */
    run(...params) {
        return new Promise((resolve, reject) => {
            this._stmt.run(...params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

}
module.exports = StatementWrapper;
