/* eslint-env node */

const jwtUtils = require("../../util/jwt");
const pwdUtils = require("../../util/pwd");

const AbstractRoute = require("../AbstractRoute");

class AuthRoute extends AbstractRoute {

    /**
     * Instanziiert die Auth-Route
     *
     * @param {import("../../AppServer")} server Die AppServer Instanz
     */
    constructor(server) {
        super("auth", server);

        /**
         * @type {import("../../data/UserRepository")}
         * @private
         */
        this._userRepo = server.getRepo("user");
    }

    async post(req, res, next) {
        const body = req.body;

        if (typeof body !== "object" || typeof body.userName !== "string" || typeof body.pwd !== "string") {
            res.status(400).json({
                err: true,
                msg: "Nutzername und/oder Passwort wurden nicht übermittelt",
            });
            return;
        }

        const userName = body.userName;
        const pwd = body.pwd;

        try {
            /** @type {import("../../data/model/User")} */
            const user = await this._userRepo.findByName(userName);
            if (user === null) {
                res.status(200).json({
                    err: true,
                    msg: "Benutzername und/oder Passwort falsch",
                });
                return;
            }

            // Sicherstellen dass der Return-Wert ein boolean ist
            if (await pwdUtils.verify(pwd, user.pwd) !== true) {
                res.status(200).json({
                    err: true,
                    msg: "Benutzername und/oder Passwort falsch",
                });
                return;
            }

            res.status(200).json({
                err: false,
                token: await jwtUtils.sign(user.id),
                user: user.toJSON(),
            });
            return;
        } catch (err) {
            next(err);
        }
    }

}
module.exports = AuthRoute;
