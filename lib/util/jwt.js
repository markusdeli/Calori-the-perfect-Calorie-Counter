/* eslint-env node */

const jwt = require("jsonwebtoken");

/**
 * Das Default-Secret zum Signieren von JWTs wenn die JWT_SECRET
 * Umgebungsvariable nicht angegeben wurde
 */
const JWT_SECRET_FALLBACK = "testtest";

/**
 * Das Secret mit dem JWTs signiert werden
 *
 * @type {string}
 */
const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_FALLBACK;

// sicherstellen dass im production Modus ein sicheres Secret verwendet wird
if (process.env.NODE_ENV !== "development" && JWT_SECRET === JWT_SECRET_FALLBACK) {
    console.error("Production mode is active, but JWT_SECRET is not specified");
    process.exit(1);
}

/**
 * Erstellt ein signiertes JSON Web Token für den angegebenen Nutzer
 *
 * @param {number} userId Die ID des Nutzers für den das Token ausgestellt werden soll
 * @return {Promise<string>} Das JSON Web Token
 */
function sign(userId) {
    return new Promise((resolve, reject) => {
        const data = {
            id: userId,
        };

        jwt.sign(data, JWT_SECRET, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}
module.exports.sign = sign;

/**
 * Überprüft ob ein JSON Web Token eine gültige Signatur hat und falls ja, returnt die ID
 * des Nutzers für den das Token ausgestellt wurde
 *
 * @param {string} token Das JSON Web Token
 * @return {Promise<number>} Die ID des Nutzers
 */
function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.id);
            }
        });
    });
}
module.exports.verify = verify;
