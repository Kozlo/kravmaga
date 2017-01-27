import React from 'react';
import {
    Button, Row, Col, Glyphicon,
    FormGroup, FormControl,
    ControlLabel, HelpBlock
} from 'react-bootstrap'

import AuthActions from '../../actions/AuthActions';

class LoginForm extends React.Component {
    handleSubmit(event) {
        const { email, password } = event.target;

        event.preventDefault();

        AuthActions.login(email.value, password.value);
    }

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
