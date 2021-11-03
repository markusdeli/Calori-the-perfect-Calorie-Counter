/* eslint-env node */

const bcrypt = require("bcrypt");

/** Die Anzahl der Hashing-Runden für bcrypt */
const BCRYPT_ROUNDS = 10;

/**
 * Hasht das angegebene Passwort mit bcrypt
 *
 * @param {string} pwd Das Passwort
 * @return {Promise<string>} Das gehashte Passwort
 */
async function hash(pwd) {
    return await bcrypt.hash(pwd, BCRYPT_ROUNDS);
}
module.exports.hash = hash;

/**
 * Überprüft ob ein Passwort mit dem gehashten Passwort aus der Datenbank übereinstimmt
 *
 * @param {string} pwd Das Passwort im Klartext
 * @param {string} hash Das gehashte Passwort aus der Datenbank
 * @return {Promise<boolean>} `true` falls das Passwort mit dem Hash übereinstimmt
 */
async function verify(pwd, hash) {
    return await bcrypt.compare(pwd, hash);
}
module.exports.verify = verify;
