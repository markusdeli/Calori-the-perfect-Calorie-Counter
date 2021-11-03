/* eslint-env es11 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import {
    GRID_SIZE_XS,
    GRID_SIZE_SM,
    GRID_SIZE_MD,
    GRID_SIZE_LG,
    GRID_SIZE_XL,
} from "../../theme";

/**
 * Wrapper Component für das Grid Element aus material-ui mit den default-Werten
 * für Breakpoints aus theme.js
 */
export default class AppGrid extends Component {

    render() {
        return (
            <Grid
                alignContent={this.props.alignContent}
                alignItems={this.props.alignItems}
                container={this.props.container}
                direction={this.props.direction}
                item={this.props.item}
                justify={this.props.justify}
                lg={this.props.item ? GRID_SIZE_LG : false}
                md={this.props.item ? GRID_SIZE_MD : false}
                sm={this.props.item ? GRID_SIZE_SM : false}
                spacing={this.props.spacing}
                wrap={this.props.wrap}
                xl={this.props.item ? GRID_SIZE_XL : false}
                xs={this.props.item ? GRID_SIZE_XS : false}
                zeroMinWidth={this.props.zeroMinWidth}
            >
                {this.props.children}
            </Grid>
        );
    }
}

AppGrid.propTypes = {
    alignContent: PropTypes.oneOf([
        "stretch",
        "center",
        "flex-start",
        "flex-end",
        "space-between",
        "space-around",
    ]),
    alignItems: PropTypes.oneOf([
        "flex-start",
        "center",
        "flex-end",
        "stretch",
        "baseline",
    ]),
    children: PropTypes.node,
    container: PropTypes.bool,
    direction: PropTypes.oneOf([
        "row",
        "row-reverse",
        "column",
        "column-reverse",
    ]),
    item: PropTypes.bool,
    justify: PropTypes.oneOf([
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
        "space-evenly",
    ]),
    spacing: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    wrap: PropTypes.oneOf([
        "nowrap",
        "wrap",
        "wrap-reverse",
    ]),
    zeroMinWidth: PropTypes.bool,
};
