/* eslint-env node */

const AbstractRoute = require("./AbstractRoute");

const MealRoute = require("./meal/MealRoute");
const SportRoute = require("./sport/SportRoute");
const UserRoute = require("./user/UserRoute");

/**
 * Die Hauptroute für alle API-Endpoints.
 * Diese Klasse lädt alle API-Routen und fügt die ihrem router hinzu. Der {@link AppServer} fügt
 * diesen dann zu Express unter der URL `/api` hinzu.
 */
class ApiRoute extends AbstractRoute {

    /**
     * @inheritdoc
     * @override
     */
    constructor(server) {
        super("api", server);
    }

    /**
     * @inheritdoc
     * @override
     */
    get children() {
        return [
            new MealRoute(this.server),
            new SportRoute(this.server),
            new UserRoute(this.server),
        ];
    }

    /**
     * @inheritdoc
     * @override
     */
    addEndpoints() {
        this.router.get("/", (req, res) => {
            res.status(200).json({
                msg: "it works!",
            });
        });

        this.router.use("/meal", new MealRoute(this.server).router);
        this.router.use("/sport", new SportRoute(this.server).router);
        this.router.use("/user", new UserRoute(this.server).router);
    }

}
module.exports = ApiRoute;
