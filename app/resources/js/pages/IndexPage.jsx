/* eslint-env es11 */

import React, { Component } from "react";
import { Button, Card, CardContent, Typography, Hidden } from "@material-ui/core";
import { Bar, Doughnut } from "react-chartjs-2";

import { OPEN_LOGIN_DIALOG } from "../util/events";
import { COLOR_PRIMARY, COLOR_PRIMARY_LIGHT, COLOR_PRIMARY_DARK } from "../theme";

/**
 * Page-Component für die Startseite
 */
export default class IndexPage extends Component {

    handleLoginClick() {
        window.document.dispatchEvent(new CustomEvent(OPEN_LOGIN_DIALOG));
    }

    render() {
        return (
            <div className="page-narrow">
                <Typography variant="h2">Calori</Typography>

                <Typography paragraph variant="body1">
                    Der <i>Calori</i> wird nie müde, der <i>Calori</i> schläft
                    nie ein, der <i>Calori</i> ist immer vor dir wach und
                    behütet dich schweißfrei.
                </Typography>

                <Hidden smUp implementation="css">
                    <div style={{ margin: "20px 0", display: "flex" }}>
                        <div style={{ flexGrow: 1 }}/>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleLoginClick}
                        >
                            ANMELDEN
                        </Button>
                        <div style={{ flexGrow: 1 }}/>
                    </div>
                </Hidden>

                <Typography variant="h3" style={{ marginTop: "32px" }}>
                    Kalorien erfassen
                </Typography>
                <Typography paragraph>
                    Erstelle eigene Gerichte, erfasse deine Mahlzeiten und
                    behalte den Überblick über deinen Kalorienhaushalt
                </Typography>
                <Card>
                    <CardContent>
                        <Bar
                            data={{
                                labels: [
                                    "Montag",
                                    "Dienstag",
                                    "Mittwoch",
                                    "Donnerstag",
                                    "Freitag",
                                    "Samstag",
                                    "Sonntag",
                                ],
                                datasets: [{
                                    label: "Kalorienzahl",
                                    data: [
                                        1700,
                                        1600,
                                        1850,
                                        1650,
                                        1900,
                                        1575,
                                        1750,
                                    ],
                                    backgroundColor: COLOR_PRIMARY,
                                }],
                            }}
                        />
                    </CardContent>
                </Card>

                <Typography variant="h3" style={{ marginTop: "32px" }}>
                    Trainieren
                </Typography>
                <Typography paragraph>
                    Tracke deine Trainingserfolge und vergleiche sie mit den
                    vorherigen Tagen
                </Typography>
                <Card>
                    <CardContent>
                        <Bar
                            data={{
                                labels: [
                                    "Montag",
                                    "Dienstag",
                                    "Mittwoch",
                                    "Donnerstag",
                                    "Freitag",
                                    "Samstag",
                                    "Sonntag",
                                ],
                                datasets: [{
                                    label: "Aktivität",
                                    data: [
                                        6423,
                                        9456,
                                        4326,
                                        7564,
                                        7864,
                                        6543,
                                        7256,
                                    ],
                                    backgroundColor: COLOR_PRIMARY,
                                }],
                            }}
                        />
                    </CardContent>
                </Card>

                <Typography variant="h3" style={{ marginTop: "32px" }}>
                    Gesünder leben
                </Typography>
                <Typography paragraph>
                    Behalte dein Verhältnis aus den drei essenziellen Nährstoffen
                    im Auge und führe ein gesünderes Leben
                </Typography>
                <Card>
                    <CardContent>
                        <Doughnut
                            data={{
                                labels: [
                                    "Kohlenhydrate",
                                    "Proteine",
                                    "Fett",
                                ],
                                datasets: [{
                                    data: [
                                        300,
                                        150,
                                        500,
                                    ],
                                    backgroundColor: [
                                        COLOR_PRIMARY_LIGHT,
                                        COLOR_PRIMARY,
                                        COLOR_PRIMARY_DARK,
                                    ],
                                }],
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

}
