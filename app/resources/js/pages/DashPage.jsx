/* eslint-env es11 */

import React from "react";
import { Redirect } from "react-router-dom";
import { Button, Typography, Hidden, Grid } from "@material-ui/core";

import { USER_LOGOUT, USER_LOGIN } from "../util/events";
import EventListeningComponent from "../components/EventListeningComponent";
import AppGrid from "../components/wrapper/AppGrid";
import SessionManager from "../util/SessionManager";
import CalorieStats from "../components/dash/CalorieStats";
import NutriStats from "../components/dash/NutriStats";
import SportStats from "../components/dash/SportStats";
import MealAdder from "../components/dash/MealAdder";
import MealTypeAdder from "../components/dash/MealTypeAdder";
import SportAdder from "../components/dash/SportAdder";

/**
 * Page-Component für das Dashboard
 */
export default class DashPage extends EventListeningComponent {

    constructor(props) {
        super(props);

        this.handleLogoutClick = this.handleLogoutClick.bind(this);

        this._sessionManager = SessionManager.getInstance();

        this.state = {
            shouldRedirectToIndex: !this._sessionManager.isLoggedIn,
        };
    }

    get events() {
        return [
            {
                name: USER_LOGIN,
                callback: () => this.setStateSafe({ shouldRedirectToIndex: false }),
            },
            {
                name: USER_LOGOUT,
                callback: () => this.setStateSafe({ shouldRedirectToIndex: true }),
            },
        ];
    }

    handleLogoutClick() {
        this._sessionManager.logout();
    }

    render() {
        if (this.state.shouldRedirectToIndex) {
            return <Redirect to="/"/>;
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h2">Dashboard</Typography>
                    <Hidden smUp implementation="css">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleLogoutClick}
                        >
                            ABMELDEN
                        </Button>
                    </Hidden>
                </Grid>

                <AppGrid item>
                    <CalorieStats/>
                </AppGrid>
                <AppGrid item>
                    <NutriStats/>
                </AppGrid>
                <AppGrid item>
                    <SportStats/>
                </AppGrid>
                <AppGrid item>
                    <MealAdder/>
                </AppGrid>
                <AppGrid item>
                    <SportAdder/>
                </AppGrid>
                <AppGrid item>
                    <MealTypeAdder/>
                </AppGrid>
            </Grid>
        );
    }

}
