import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Button, Row, Col, FormGroup, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap'

import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit() {

    }

    login() {

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
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl
                                        type="email"
                                        placeholder="E-pasts"
                                        value={this.state.email}
                                        onChange={this.handleChange.bind(this)}
                                    />
                                    <FormControl.Feedback />
                                    <HelpBlock>Lietotāja parole.</HelpBlock>
                                </FormGroup>
                                <FormGroup controlId="password">
                                    <ControlLabel>Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        placeholder="Parole"
                                        value={this.state.password}
                                        onChange={this.handleChange.bind(this)}
                                    />
                                    <FormControl.Feedback />
                                    <HelpBlock>Lietotāja e-pasts.</HelpBlock>
                                </FormGroup>
                                <Button className="btn btn-default btn-lg" onClick={this.login.bind(this)}>
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
