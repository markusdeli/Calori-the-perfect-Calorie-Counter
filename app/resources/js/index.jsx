/* eslint-env es11 */

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import {
    AppBar,
    Button,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Snackbar,
    ThemeProvider,
    Typography,
} from "@material-ui/core";
import {
    AccountCircle as AccountCircleIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    Menu as MenuIcon,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

import theme, { COLOR_TEXT_PRIMARY } from "./theme";

import AppLink from "./components/wrapper/AppLink";
import LoginPopup from "./components/login/LoginPopup";
import EventListeningComponent from "./components/EventListeningComponent";

import NotFoundPage from "./pages/NotFoundPage";
import IndexPage from "./pages/IndexPage";
import DashPage from "./pages/DashPage";
import MealManagePage from "./pages/MealManagePage";
import UserPage from "./pages/UserPage";
import SignupPage from "./pages/SignupPage";
import SessionManager from "./util/SessionManager";
import {
    OPEN_LOGIN_DIALOG,
    USER_LOGIN,
    USER_LOGOUT,
    SHOW_NOTIFICATION,
} from "./util/events";

/**
 * Die Haupt-Component der App.
 * Wird in index.html geladen.
 */
class MainApp extends EventListeningComponent {

    constructor(props) {
        super(props);

        this._sessionManager = SessionManager.getInstance();
        this.state = {
            isLoggedIn: this._sessionManager.isLoggedIn,
            isDrawerOpen: false,
            isSnackbarOpen: false,
            snackbarContent: "",
            snackbarSeverity: "info",
        };

        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    get events() {
        return [
            {
                name: USER_LOGIN,
                callback: () => this.setState( () => ({ isLoggedIn: true }) ),
            },
            {
                name: USER_LOGOUT,
                callback: () => this.setState( () => ({ isLoggedIn: false }) ),
            },
            {
                name: SHOW_NOTIFICATION,
                callback: e => this.setState(() => ({
                    isSnackbarOpen: true,
                    snackbarContent: e.detail.message,
                    snackbarSeverity: e.detail.severity,
                })),
            },
        ];
    }

    /**
     * Callback zum Öffnen des Drawers
     */
    handleDrawerOpen() {
        this.setState( () => ({ isDrawerOpen: true }) );
    }

    /**
     * Callback zum Schließen des Drawers
     */
    handleDrawerClose() {
        this.setState( () => ({ isDrawerOpen: false }) );
    }

    /**
     * onClick Callback für den Login/Logout Button im Header oben rechts
     */
    handleLoginClick() {
        if (this.state.isLoggedIn) {
            this._sessionManager.logout();
        } else {
            window.document.dispatchEvent(new CustomEvent(OPEN_LOGIN_DIALOG));
            this.setState( () => ({ isDrawerOpen: false }) );
        }
    }

    /**
     * Callback wenn die Snackbar geschlossen wird
     * @param {Event} e
     * @param {string} reason
     */
    handleSnackbarClose(e, reason) {
        if (reason !== "clickaway") {
            this.setState( () => ({ isSnackbarOpen: false }) );
        }
    }

    render() {
        const HEADER_HEIGHT = window.innerWidth >= 600 ? "64px" : "56px";

        return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <AppBar position="fixed" color="inherit">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Menü öffnen"
                            onClick={this.handleDrawerOpen}
                            edge="start"
                        >
                            <MenuIcon/>
                        </IconButton>

                        {/* flexGrow schiebt den Login Button ganz nach rechts */}
                        <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
                            <AppLink
                                to={this.state.isLoggedIn ? "/dash" : "/"}
                                noStyle
                            >
                                Calori
                            </AppLink>
                        </Typography>

                        <Hidden xsDown implementation="css">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleLoginClick}
                            >
                                {this.state.isLoggedIn ? "Abmelden" : "Anmelden"}
                            </Button>
                        </Hidden>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={this.state.isDrawerOpen}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                            height: HEADER_HEIGHT,
                        }}
                    >
                        <IconButton color="inherit" onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>

                    <Divider/>

                    {this.state.isLoggedIn ? (
                        <List>
                            <ListItem button component={Link} to="/dash">
                                <ListItemIcon>
                                    <DashboardIcon style={{ color: COLOR_TEXT_PRIMARY }}/>
                                </ListItemIcon>
                                <ListItemText>Dashboard</ListItemText>
                            </ListItem>
                            <ListItem button component={Link} to="/user">
                                <ListItemIcon>
                                    <AccountCircleIcon style={{ color: COLOR_TEXT_PRIMARY }}/>
                                </ListItemIcon>
                                <ListItemText>Mein Account</ListItemText>
                            </ListItem>
                        </List>
                    ) : (
                        <List>
                            <ListItem button onClick={this.handleLoginClick}>
                                <ListItemIcon>
                                    <AccountCircleIcon style={{ color: COLOR_TEXT_PRIMARY }}/>
                                </ListItemIcon>
                                <ListItemText>Anmelden</ListItemText>
                            </ListItem>
                        </List>
                    )}
                </Drawer>

                <main id="main-content" style={{ marginTop: HEADER_HEIGHT }}>
                    <Switch>
                        <Route
                            path="/"
                            exact
                            component={this.state.isLoggedIn ? DashPage : IndexPage}
                        />
                        <Route exact path="/dash" component={DashPage}/>
                        <Route exact path="/dash/meals" component={MealManagePage}/>
                        <Route path="/signup" component={SignupPage}/>
                        <Route path="/user" component={UserPage}/>
                        <Route component={NotFoundPage}/>
                    </Switch>
                </main>

                <LoginPopup />

                <Snackbar
                    open={this.state.isSnackbarOpen}
                    autoHideDuration={4000}
                    onClose={this.handleSnackbarClose}
                >
                    <Alert
                        variant="filled"
                        onClose={this.handleSnackbarClose}
                        severity={this.state.snackbarSeverity}
                    >
                        {this.state.snackbarContent}
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </BrowserRouter>
        );
    }

}

const mainAppElement = document.getElementById("main-app");
ReactDOM.render(<MainApp/>, mainAppElement);
