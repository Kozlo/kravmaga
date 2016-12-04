import React from 'react';
import ExecutionEnvironment from 'exenv';

import AuthActions from '../actions/AuthActions';

import Navbar from './Navbar';
import Footer from './Footer';

class App extends React.Component {

    componentWillMount() {
        if (!ExecutionEnvironment.canUseDOM) {
            return;
        }

        const idToken = this.getHashValue('id_token');
        if (idToken) {
            AuthActions.loginUser(idToken);
        }
    }

    getHashValue(key) {
        let matches = location.hash.match(new RegExp(key+'=([^&]*)'));
        return matches ? matches[1] : null;
    }


    render() {
        return (
            <div>
                <Navbar history={this.props.history} />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default App;