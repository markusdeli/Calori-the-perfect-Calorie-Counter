/* eslint-env es11 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

/**
 * Ein Wrapper für die Button Component aus material-ui, die das Hinzufügen
 * eines Links erlaubt.
 */
export default class LinkButton extends Component {

    render() {
        return (
            <Button
                component={Link}
                to={this.props.to}
                variant={this.props.variant}
                color={this.props.color}
                style={this.props.style}
            >
                {this.props.children}
            </Button>
        );
    }

}

LinkButton.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.string,
    variant: PropTypes.oneOf([ "contained", "outlined", "text" ]),
    color: PropTypes.oneOf([ "default", "inherit", "primary", "secondary" ]),
    style: PropTypes.object,
};
