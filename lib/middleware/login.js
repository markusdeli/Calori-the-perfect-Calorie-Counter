/* eslint-env node */

const jwtUtils = require("../util/jwt");

/**
 * Middleware-Ersteller für das Validieren des HTTP `Authorization` Headers.
 *
 * Überprüft ob der Header ein JWT mit gültiger Signatur enthält und, falls ja,
 * durchsucht die Datenbank nach dem Nutzer für den das Token ausgestellt wurde.
 * Falls der Nutzer gefunden wurde wird er dem `req`-Parameter als
 * `authenticatedUser`-Property angehängt.  Fehler jeglicher Art führen zur
 * sofortigen Ablehnung der Request.
 *
 * @param {import("../data/UserRepository")} userRepo Eine Instanz des UserRepositorys
 * @return Ein Middleware-Handler für Express
 */
module.exports = (userRepo) => async (req, res, next) => {
    if (typeof req.headers.authorization !== "string") {
        res.status(401).json({
            err: true,
            msg: "Kein Authorization-Header angegeben",
        });
        return;
    }

    const authHeader = req.headers.authorization.split(" ");
    if (authHeader[0] !== "Bearer") {
        res.status(401).json({
            err: true,
            msg: "Ungültiger Authorization-Typ",
        });
        return;
    }

    try {
        const userId = await jwtUtils.verify(authHeader[1]);
        const user = await userRepo.findById(userId);
        if (user === null) {
            res.status(401).json({
                err: true,
                msg: "Benutzeraccount existiert nicht",
            });
            return;
        }

        req.authenticatedUser = user;
        next();
        return;
    } catch (err) {
        next(err);
    }
};
