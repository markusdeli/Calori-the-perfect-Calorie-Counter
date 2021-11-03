/* eslint-env es11 */

import React, { Component } from "react";
import { Typography } from "@material-ui/core";

import AppLink from "../components/wrapper/AppLink";

/**
 * Page Component zum Anzeigen der 404 Not Found Fehlermeldung wenn eine
 * ungültige Route angefragt wurde
 */
export default class NotFoundPage extends Component {

    render() {
        return (
            <div className="page-narrow">
                <Typography variant="h2">404 Not Found</Typography>

                <Typography paragraph>
                    Diese Seite konnte leider nicht gefunden werden.
                </Typography>

                <AppLink to="/">Zurück zur Startseite</AppLink>
            </div>
        );
    }

}
