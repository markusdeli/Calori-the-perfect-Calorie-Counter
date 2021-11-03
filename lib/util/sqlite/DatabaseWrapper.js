/* eslint-env node */

const sqlite3 = require("sqlite3");
const StatementWrapper = require("./StatementWrapper");

/**
 * Speichert Informationen über die Sperre von einer einzelnen Tabelle
 *
 * @typedef {object} TableMutex
 * @prop {boolean} locked `true` falls die Tabelle gerade gesperrt ist
 * @prop {function[]} queue Ein Array aus `resolve` Callbacks von Promises, die
 *     auf die Entsperrung der Tabelle warten. Beim Entsperren wird der erste
 *     Callback aus diesem Array entfernt und ausgeführt, wodurch die zugehörige
 *     Promise resolved wird. Sind keine weiteren Elemente vorhanden, wird die
 *     `locked` Property wieder auf `false` gesetzt.
 */

/**
 * Wrapper für die sqlite3.Database-Klasse mit Unterstützung für Promises.
 * Das sqlite3-promise Paket auf npm ist zuletzt vor 3 Jahren aktualisiert worden, daher dieser
 * selbstgeschriebene Wrapper.
 * Die APIs funktionieren, bis auf die durch den Promise-Mechanismus ersetzten Callbacks, genauso
 * wie das Original: {@link https://github.com/mapbox/node-sqlite3/wiki/API#database}
 */
class DatabaseWrapper {

    constructor(filename) {
        this._db = new sqlite3.Database(filename);

        /**
         * Key-Value-Speicher für Locks auf einzelne Tabellen.
         * Der Tabellenname ist der Schlüssel, die Werte sind ein Array aus
         * resolve-Callbacks für Promises. Wenn versucht wird eine bereits
         * gesperrte Tabelle erneut zu sperren, wird der resolve-Callback der
         * von {@link #lockTable} zurückgegebenen Promise ans Ende des Arrays
         * eingefügt. Die Funktion {@link #unlockTable} prüft dann ob in dieser
         * Warteschlange noch ausstehende Anfragen sind, und falls ja, führt
         * die Callback-Funktion auf Index 0 (also die die schon am längsten
         * gewartet hat) aus.
         * Locking ist generell nur bei `INSERT`-Operationen notwendig und
         * sollte aus Performancegründen auch nur für solche verwendet werden.
         *
         * @private
         * @type {Object.<string, TableMutex>}
         */
        this._tableMutexes = {};
    }

    /**
     * Sperrt die angegebene Tabelle zur exklusiven Verwendung.
     *
     * Jede INSERT-Operation muss diese Funktion aufrufen. Für alle anderen
     * Operationen ist dies unnötig, da der Lock nur verwendet wird um
     * sicherzustellen dass die `last_insert_rowid()` SQLite-Funktion auch die
     * korrekte ID zurück gibt (ansonsten ist SQLite sowieso Threadsicher).
     * Nach Fertigstellung der Operation muss die {@link #unlockTable} Funktion
     * aufgerufen werden um die Tabelle wieder freizugeben, ansonsten wird ein
     * künstlicher Deadlock erzeugt.
     *
     * @param {!string} name Der Name der SQLite-Tabelle
     * @return {Promise<void>} Eine Promise die resolved wird sobald der
     *     exklusive Lock gesichert wurde
     */
    lockTable(name) {
        return new Promise(resolve => {
            const mutex = this._tableMutexes[name];

            if (mutex) {
                if (mutex.locked) {
                    // Tabelle gesperrt, wir fügen uns zur Warteschlange hinzu
                    mutex.queue.push(resolve);
                } else {
                    // Keine Sperre, Promise kann direkt resolved werden
                    mutex.locked = true;
                    resolve();
                }
            } else {
                // Für diese wurde noch nie ein Lock erstellt,
                // also ist sie definitiv nicht gesperrt
                this._tableMutexes[name] = {
                    locked: true,
                    queue: [],
                };
                resolve();
            }
        });
    }

    /**
     * Gibt eine zuvor mit {@link #lockTable} gesperrte Datenbank wieder frei
     *
     * @param {string} name Der Name der Tabelle
     */
    unlockTable(name) {
        const mutex = this._tableMutexes[name];
        if (!mutex) {
            // Das sollte niemals eintreffen, weil es bedeutet dass lockTable()
            // nicht aufgerufen wurde
            return;
        }

        const nextOperation = mutex.queue.unshift();
        if (nextOperation) {
            // Es sind noch andere Lock-Anfragen vorhanden, die Tabelle bleibt
            // gesperrt aber wechselt ihren Besitzer zum nächsten anfragenden
            setTimeout(() => nextOperation());
        } else {
            // Keine weiteren Anfragen, die Tabelle ist wieder für alle verfügbar
            mutex.locked = false;
        }
    }

    close() {
        return new Promise((resolve, reject) => {
            this._db.close(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    configure(option, value) {
        this._db.configure(option, value);
    }

    exec(sql) {
        return new Promise((resolve, reject) => {
            this._db.exec(sql, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(err);
                }
            });
        });
    }

    get(sql, ...params) {
        return new Promise((resolve, reject) => {
            this._db.get(sql, ...params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * Erstellt ein neues Prepared Statement auf dieser Datenbank
     *
     * @param {string} sql Das SQL-Statement mit Parametern (`?`)
     * @param  {...any} params Optionale Parameter für das Statement
     * @return {Promise<StatementWrapper>} Eine Promise für das Prepared Statement
     */
    prepare(sql, ...params) {
        return new Promise((resolve, reject) => {
            const stmt = this._db.prepare(sql, ...params, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new StatementWrapper(stmt));
                }
            });
        });
    }

    run(sql, ...params) {
        return new Promise((resolve, reject) => {
            this._db.run(sql, ...params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

}
module.exports = DatabaseWrapper;
