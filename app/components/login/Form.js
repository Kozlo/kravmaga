import React from 'react';
import {
    Button, Row, Col, Glyphicon,
    FormGroup, FormControl,
    ControlLabel, HelpBlock
} from 'react-bootstrap'

import AuthActions from '../../actions/AuthActions';

/**
 * Login form data presentation component.
 */
class LoginForm extends React.Component {
    /**
     * Authenticates the user with the entered credentials.
     *
     * @public
     * @param {Object} event Submit event
     */
    handleSubmit(event) {
        event.preventDefault();

        const { email, password } = event.target;

        AuthActions.login(email.value, password.value);
    }

    /**
     * Renders the credentials controls.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <Row>
                <Col xs={12} md={6} mdPush={3} lg={4} lgPush={4}>
                    <h2>Krav Maga</h2>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup controlId="email">
                            <ControlLabel>E-pasts</ControlLabel>
                            <FormControl
                                type="email"
                                placeholder="E-pasts"
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Lietotāja e-pasts.</HelpBlock>
                        </FormGroup>
                        <FormGroup controlId="password">
                            <ControlLabel>Parole</ControlLabel>
                            <FormControl
                                type="password"
                                placeholder="Parole"
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Lietotāja parole.</HelpBlock>
                        </FormGroup>
                        <Button
                            type="submit"
                            bsSize="lg">
                            <Glyphicon glyph="log-in" /> Ienākt
                        </Button>
                    </form>
                </Col>
            </Row>
        );
    }
}

export default LoginForm;
