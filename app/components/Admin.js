import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import AuthStore from '../stores/AuthStore';

class Admin extends React.Component {
    static getStores() {
        return [AuthStore];
    }

    static getPropsFromStores() {
        return {
            auth: AuthStore.getState()
        };
    }

    render() {
        return (
            <div className='container'>
                <h2>Admin Panelis</h2>
                <div className="panel panel-default krav-maga-panel" >
                    <div className="panel-heading">
                        <h3>Lietotāji</h3>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-12 col-sm-5">
                                <p>Izstrādē: lietotāju saraksts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connectToStores(Admin);

