/* eslint-env es11 */

import React from "react";
import {
    Card,
    CardContent,
    Typography,
} from "@material-ui/core";
import { Bar } from "react-chartjs-2";

import EventListeningComponent from "../EventListeningComponent";
import SportRepository from "../../data/SportRepository";
import { SPORT_UPDATE } from "../../util/events";
import { COLOR_PRIMARY } from "../../theme";

const SECS_PER_DAY = 3600 * 24;
const SECS_PER_WEEK = SECS_PER_DAY * 7;

/**
 * Eine Card-Component die ein Diagramm der sportlichen Betätigungen innerhalb
 * der letzten 7 Tage anzeigt
 */
export default class SportStats extends EventListeningComponent {

    constructor(props) {
        super(props);

        this._sportRepo = SportRepository.getInstance();

        this.state = {
            errorMessage: "",
            weightedSums: [0, 0, 0, 0, 0, 0, 0],
            labels: this.rotateWeekdays(),
        };

        this.loadStats();
    }

    get events() {
        return [
            {
                name: SPORT_UPDATE,
                callback: this.loadStats,
            },
        ];
    }

    /**
     * Returnt ein Array mit den Namen aller 7 Wochentage, bei dem der heutige
     * Wochentag an letzter Stelle steht
     *
     * @return {string[]} Das Array mit den 7 Wochentagen
     */
    rotateWeekdays() {
        const offset = new Date().getDay();
        const weekdays = [
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag",
            "Sonntag",
        ];

        for (let i = 0; i < offset; i++) {
            weekdays.push(weekdays.shift());
        }

        return weekdays;
    }

    /**
     * Holt sich die gewichteten Summen aller sportlichen Aktivitäten aus dem
     * Repository und aktualisiert das Diagramm dementsprechend
     */
    async loadStats() {
        // das hier sind im Prinzip nur Zwischenergebnisse für ...
        const now = new Date();
        const unixNowUTC = Math.floor(now.getTime() / 1000);
        const unixNowLocal = unixNowUTC - (now.getTimezoneOffset() * 60);
        const secsSinceLocalMidnight = unixNowLocal % SECS_PER_DAY;

        // ... das hier
        const unix7DaysAgoAtLocalMidnight = unixNowUTC - secsSinceLocalMidnight - SECS_PER_WEEK;

        const weightedSums = [0, 0, 0, 0, 0, 0, 0]; // 7 Tage
        try {
            let currentStart = unix7DaysAgoAtLocalMidnight;

            for (let i = 0; i < 7; i++) {
                // Zeitrahmen vor dem ersten Holen erhöhen, weil wir theoretisch nur die vergangenen
                // 6 Tage brauchen (nachdem der heutige Tag auch mitzählt)
                currentStart += SECS_PER_DAY;

                weightedSums[i] = await this._sportRepo.getWeightedSumFromTo(
                    currentStart,
                    currentStart + SECS_PER_DAY - 1,
                );
            }

            this.setStateSafe({
                errorMessage: "",
                weightedSums: weightedSums,
            });
        } catch (err) {
            this.setStateSafe({ errorMessage: err.message });
        }
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        Aktivitäten letzte 7 Tage
                    </Typography>
                    <Typography color="error">
                        {this.state.errorMessage}
                    </Typography>
                    <Bar
                        data={{
                            labels: this.state.labels,
                            datasets: [{
                                label: "Aktivität",
                                data: this.state.weightedSums,
                                backgroundColor: COLOR_PRIMARY,
                            }],
                        }}
                    />
                </CardContent>
            </Card>
        );
    }

}
