import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import AuthStore from '../stores/AuthStore';
import UserStore from '../stores/UserStore';

import UserActions from '../actions/UserActions';

import { objectIsEmpty } from '../utils/utils';

class Profile extends React.Component {
    static getStores() {
        return [AuthStore, UserStore];
    }

    static getPropsFromStores() {
        return {
            auth: AuthStore.getState(),
            user: UserStore.getState()
        };
    }

    componentDidMount() {
        const { user } = this.props.user;
        const { authUserId, token } = this.props.auth;

        return UserActions.checkForUser(user, authUserId, token);
    }

    render() {
        const { user } = this.props.user;
        const gender = user.gender == 'male' ? 'Vīrietis' : (user.gender == 'female' ? 'Sieviete' : '');
        const imageStyle = { float: 'left',  margin: '0 15px 15px 0', maxWidth: '130px' };
        const btnStyle = { float: 'right', marginRight: '10px' };

        return (
            <div className='container'>
                <div className="panel panel-default krav-maga-panel" >
                    <div className="panel-heading">
                        <h3>Mans profils</h3>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-12 col-sm-5">
                                <img src={user.picture} alt="User Image" style={imageStyle} />
                                <dl>
                                    <dt>Vārds, Uzvārds</dt>
                                    <dd>{user.firstName} {user.lastName}</dd>
                                </dl>
                            </div>

                            <div className="col-xs-6 col-sm-4">
                                <dl>
                                    <dt>E-pasts</dt>
                                    <dd>{user.email}</dd>
                                </dl>
                            </div>
                            <div className="col-xs-6 col-sm-3">
                                <dl>
                                    <dt>Dzimums</dt>
                                    <dd>{gender}</dd>
                                </dl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <button type="button" className="btn btn-default" style={btnStyle} data-toggle="modal" data-target="#myModal">Labot Info</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/*TODO: move the modal to a separate component*/}
                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">Labot Profile Informāciju</h4>
                            </div>
                            <div className="modal-body">
                                <p>Notiek izstrādes process&hellip;</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Aizvērt</button>
                                <button type="button" className="btn btn-primary">Saglabāt izmaiņas</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default connectToStores(Profile);
