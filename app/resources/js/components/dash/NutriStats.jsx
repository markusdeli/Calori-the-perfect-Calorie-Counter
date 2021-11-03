/* eslint-env es11 */

import React from "react";
import {
    Card,
    CardContent,
    Typography,
} from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";

import { MEAL_UPDATE } from "../../util/events";
import EventListeningComponent from "../EventListeningComponent";
import MealRepository from "../../data/MealRepository";
import { COLOR_PRIMARY, COLOR_PRIMARY_LIGHT, COLOR_PRIMARY_DARK } from "../../theme";

export default class NutriState extends EventListeningComponent {

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: "",
            carbs: 0,
            proteins: 0,
            fat: 0,
        };

        this._mealRepo = MealRepository.getInstance();

        this.fetchData();
    }

    get events() {
        return [
            {
                name: MEAL_UPDATE,
                callback: this.fetchData,
            },
        ];
    }

    async fetchData() {
        const now = new Date();
        const unixNowUTC = Math.floor(now.getTime() / 1000);
        const unixNowLocal = unixNowUTC - now.getTimezoneOffset() * 60;
        const secondsSinceLocalMidnight = unixNowLocal % (3600 * 24);
        const unixLocalMidnight = unixNowUTC - secondsSinceLocalMidnight;

        try {
            const mealsThisDay = await this._mealRepo.getMealsSince(unixLocalMidnight);
            let carbSum = 0;
            let proteinSum = 0;
            let fatSum = 0;

            for (const meal of mealsThisDay) {
                carbSum += meal.carbs;
                proteinSum += meal.proteins;
                fatSum += meal.fat;
            }

            this.setStateSafe({
                errorMessage: "",
                carbs: carbSum,
                proteins: proteinSum,
                fat: fatSum,
            });
        } catch (err) {
            this.setStateSafe({
                errorMessage: err.message,
            });
        }
    }

    render() {
        const data = {
            labels: [
                "Kohlenhydrate",
                "Proteine",
                "Fett",
            ],
            datasets: [{
                data: [
                    this.state.carbs,
                    this.state.proteins,
                    this.state.fat,
                ],
                backgroundColor: [
                    COLOR_PRIMARY_LIGHT,
                    COLOR_PRIMARY,
                    COLOR_PRIMARY_DARK,
                ],
            }],
        };

        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        Nährstoffe heute
                    </Typography>
                    <Typography color="error">
                        {this.state.errorMessage}
                    </Typography>
                    <Doughnut data={data}/>
                </CardContent>
            </Card>
        );
    }

}
