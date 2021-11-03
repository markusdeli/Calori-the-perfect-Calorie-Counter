/* eslint-env es11 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@material-ui/core";

/**
 * Wrapper-Klasse zur Integration der Link-Component aus react-router-dom mit
 * der aus material-ui
 *
 * @prop {string} to Das Ziel des Links
 * @prop {boolean} noStyle Falls `true` werden keine Modifikationen am Style
 *     vorgenommen
 */
export default class AppLink extends Component {

    render() {
        return (
            <MuiLink
                color={this.props.noStyle ? "inherit" : "secondary"}
                component={RouterLink}
                underline={this.props.noStyle ? "none" : "hover"}
                to={this.props.to}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </MuiLink>
        );
    }

}

AppLink.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    to: PropTypes.string,
    noStyle: PropTypes.bool,
    onClick: PropTypes.func,
};
