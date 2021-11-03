/* eslint-env es11 */

import React, { Component } from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from "@material-ui/core";

import AppTextField from "../AppTextField";
import MealRepository from "../../data/MealRepository";
import { showNotification, SEVERITY_SUCCESS } from "../../util/snackbar";
import LinkButton from "../wrapper/LinkButton";

/**
 * Component zum Hinzufügen neuer Mahlzeit-Typen
 */
export default class MealTypeAdder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: "",
            mealName: "",
            calories: "",
            carbs: "",
            proteins: "",
            fat: "",
        };

        this._mealRepo = MealRepository.getInstance();

        this.handleMealNameInputChange = this.handleMealNameInputChange.bind(this);
        this.handleCaloriesInputChange = this.handleCaloriesInputChange.bind(this);
        this.handleCarbsInputChange = this.handleCarbsInputChange.bind(this);
        this.handleProteinsInputChange = this.handleProteinsInputChange.bind(this);
        this.handleFatInputChange = this.handleFatInputChange.bind(this);
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    }

    handleMealNameInputChange(e) {
        e.persist();
        this.setState( () => ({ mealName: e.target.value }) );
    }

    handleCaloriesInputChange(e) {
        e.persist();

        this.setState(() => ({ calories: Number.parseFloat(e.target.value) }) );
    }

    handleCarbsInputChange(e) {
        e.persist();

        this.setState(() => ({ carbs: Number.parseFloat(e.target.value) }) );
    }

    handleProteinsInputChange(e) {
        e.persist();

        this.setState( () => ({ proteins: Number.parseFloat(e.target.value) }) );
    }

    handleFatInputChange(e) {
        e.persist();

        this.setState( () => ({ fat: Number.parseFloat(e.target.value) }) );
    }

    async handleSaveButtonClick() {
        try {
            await this._mealRepo.addMealType({
                name: this.state.mealName,
                calories: this.state.calories,
                // Umrechnung von g / 100g zu g / kg
                carbs: this.state.carbs * 10,
                proteins: this.state.proteins * 10,
                fat: this.state.fat * 10,
            });

            // Eingabefeld leeren
            this.setState(() => ({
                errorMessage: "",
                mealName: "",
                calories: "",
                carbs: "",
                proteins: "",
                fat: "",
            }));
            showNotification(SEVERITY_SUCCESS, "Gericht erstellt");
        } catch (err) {
            this.setState( () => ({ errorMessage: err.message }) );
        }
    }

    isInputValid() {
        return this.state.mealName.length > 0
            && this.state.calories >= 0
            && this.state.carbs >= 0
            && this.state.proteins >= 0
            && this.state.fat >= 0;
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        Neues Gericht erstellen
                    </Typography>
                    <Typography>Nährwertangaben pro Portion</Typography>
                    <AppTextField
                        label="Name"
                        value={this.state.mealName}
                        type="text"
                        onChange={this.handleMealNameInputChange}
                        fullWidth
                    />
                    <AppTextField
                        label="Kalorienzahl"
                        value={this.state.calories}
                        type="number"
                        onChange={this.handleCaloriesInputChange}
                        endAdornment="kcal"
                        fullWidth
                    />
                    <AppTextField
                        label="Kohlenhydrate"
                        value={this.state.carbs}
                        type="number"
                        onChange={this.handleCarbsInputChange}
                        endAdornment="g"
                        fullWidth
                    />
                    <AppTextField
                        label="Proteine"
                        value={this.state.proteins}
                        type="number"
                        onChange={this.handleProteinsInputChange}
                        endAdornment="g"
                        fullWidth
                    />
                    <AppTextField
                        label="Fett"
                        value={this.state.fat}
                        type="number"
                        onChange={this.handleFatInputChange}
                        endAdornment="g"
                        fullWidth
                    />
                    <Typography color="error">
                        {this.state.errorMessage}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        disabled={!this.isInputValid()}
                        onClick={this.handleSaveButtonClick}
                    >
                        Speichern
                    </Button>
                    <LinkButton to="/dash/meals">
                        Verwalten
                    </LinkButton>
                </CardActions>
            </Card>
        );
    }

}
