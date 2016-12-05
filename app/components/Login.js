import React from 'react';
//import connectToStores from 'alt-utils/lib/connectToStores';
import ExecutionEnvironment from 'exenv';
import { Button } from 'react-bootstrap'

import AuthStore from '../stores/AuthStore';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = AuthStore.getState();
    }

    componentDidMount() {
        AuthStore.listen(this.onChange.bind(this));
    }

    componentWillUnmount() {
        AuthStore.unlisten(this.onChange.bind(this));
    }

    onChange(state) {
        this.setState(state);
    }

    initLock() {
        if (!ExecutionEnvironment.canUseDOM) {
            return
        }

        // initialize
        const lock = new Auth0Lock('Mr8dVDOpvKRoMPH6rj0hHnHYNJJcV5Cf', 'kozlo.eu.auth0.com', {
            auth: {
                redirectUrl: `${window.location.origin}/profile`,
                responseType: 'token'
            }
        });

        lock.on('authenticated', function(authResult) {
            console.log(authResult);
            // debugger;
        });

        lock.show();
    }

    render() {
        return (
            <div className='container'>
                <div className='text-center'>
                    <h2>Krav Maga</h2>
                    <Button className="btn btn-default btn-lg" onClick={this.initLock.bind(this)}>
                        <span className="glyphicon glyphicon-log-in"></span> Ienākt/Reģistrēties
                    </Button>
                </div>
            </div>
        );
    }
}

export default Login;
