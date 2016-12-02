import React from 'react';
import UserStore from '../stores/UserStore'
import UserActions from '../actions/UserActions';

class Home extends React.Component {

    constructor(props) {
        super(props);
        // TODO: if a component uses 2 stores - are they handled in the same way? can I use 2 stores at all?
        this.state = UserStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        UserStore.listen(this.onChange);
        // TODO: if the user is logged in, redirect to the profile/admin page
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        return (
            <div className='container'>
                <h3 className='text-center'>Welcome! Please log in!</h3>
                {/* TODO: add Auth0 login form here */}
            </div>
        );
    }
}

export default Home;
