import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';
import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';

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

    // TODO: add store change listeners here
    componentDidMount() {
        const { auth, user } = this.props;

        const request = {
            url: '/get-profile',
            method: 'POST',
            data: { user_id: auth.profile.user_id },
            headers: { 'Authorization': `Bearer ${auth.token}` },
            statusCode: {
                200: user => {
                    console.log('User received successfully: ', user);
                    UserActions.userReceived(user);
                },
                401: res => {
                    console.error(res);
                    toastr.error('Autorizācijas kļūda - mēģiniet vēlreiz!');
                    AuthActions.logoutUser();
                },
                403: res => {
                    console.error(res);
                    toastr.error('Lietotājs bloķēts - Sazinieties ar administratoru!');
                    AuthActions.logoutUser();
                },
                500: res => {
                    console.error(res);
                    toastr.error('Servera kļūda - mēģiniet vēlreiz!');
                    AuthActions.logoutUser();
                }
            }
        };
        $.ajax(request)
            .done(data => {
                console.log('User received: ', data);
            })
            .fail(e => {
                // skip the error codes that have been handled
                const handledStatuses = Object.keys(request.statusCode);
                const indexOfStatus = handledStatuses.indexOf(e.status.toString());
                if (indexOfStatus !== -1) return;

                console.error(e);
                toastr.error('Autorizācija neveiksmīga - neparadzēta kļūda!');
            });
    }

    render() {
        const { user } = this.props.user;
        const gender = user.gender == 'male' ? 'Vīrietis' : (user.gender == 'female' ? 'Sieviete' : '');
        const panelStyle = { maxWidth: '720px', margin: 'auto' };
        const imageStyle = { float: 'left',  margin: '0 15px 15px 0', maxWidth: '130px' };
        const btnStyle = { float: 'right', marginRight: '10px' };

        return (
            <div className='container'>
                <div className="panel panel-default" style={panelStyle}>
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
