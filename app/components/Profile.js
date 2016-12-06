import React from 'react';

export default class Profile extends React.Component {
    // TODO: add store change listeners here
    componentWillMount() {
        // TODO: retrieve profile info here (in back-end always check if user is blocked or not)
    }

    render() {
        return (
            <div className='container'>
                <h3 className='text-center'>Šis ir Tavs profils!</h3>
            </div>
        );
    }
}
