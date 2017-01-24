import React from 'react';
import {
    Button, Row, Col,
    FormGroup, FormControl,
    ControlLabel, HelpBlock
} from 'react-bootstrap'

import AuthActions from '../actions/AuthActions';

class Login extends React.Component {
    handleSubmit(event) {
        const { email, password } = event.target;

        event.preventDefault();

        AuthActions.login(email.value, password.value);
    }

    render() {
        return (
            <div className='container'>
                <div className='text-center'>
                    <h2>Krav Maga</h2>
                    <Row>
                        <Col xs={12} md={6} mdPush={3} lg={4} lgPush={4}>
                            <form id="registrationForm" onSubmit={this.handleSubmit.bind(this)}>
                                <FormGroup controlId="email">
                                    <ControlLabel>E-pasts</ControlLabel>
                                    <FormControl
                                        type="email"
                                        placeholder="E-pasts"
                                    />
                                    <FormControl.Feedback />
                                    <HelpBlock>Lietotāja parole.</HelpBlock>
                                </FormGroup>
                                <FormGroup controlId="password">
                                    <ControlLabel>Parole</ControlLabel>
                                    <FormControl
                                        type="password"
                                        placeholder="Parole"
                                    />
                                    <FormControl.Feedback />
                                    <HelpBlock>Lietotāja e-pasts.</HelpBlock>
                                </FormGroup>
                                <Button type="submit" className="btn btn-default btn-lg">
                                    <span className="glyphicon glyphicon-log-in"></span> Ienākt
                                </Button>
                            </form>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Login;
