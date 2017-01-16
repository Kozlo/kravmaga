import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Row, Col, Button } from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';

import UserActions from '../../../actions/UserActions';

import ManageProfile from './Manage';

class ProfileData extends React.Component {

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
        const { userId, token } = this.props.auth;

        return UserActions.checkForUser(user, userId, token);
    }

    updateProfile(user) {
        const { _id, given_name, family_name, email, gender, picture } = user;
        const updatableUser = { _id, given_name, family_name, email, gender, picture };

        UserActions.setUpdatableUser(updatableUser);
    }

    render() {
        const { user } = this.props.user;
        const { gender, given_name, family_name, picture, email } = user;
        const genderValue = gender == 'male' ? 'Vīrietis' : (gender == 'female' ? 'Sieviete' : '');
        const imageStyle = { float: 'left',  margin: '0 15px 15px 0', maxWidth: '130px' };
        const btnStyle = { float: 'right', marginRight: '10px' };

        return (
            <Row>
                <Col xs={12}>
                    <Row>
                        <Col xs={12} sm={5}>
                            <img src={picture} alt="User Image" style={imageStyle} />
                            <dl>
                                <dt>Vārds, Uzvārds</dt>
                                <dd>{given_name} {family_name}</dd>
                            </dl>
                        </Col>
                        <Col xs={6} sm={4}>
                            <dl>
                                <dt>E-pasts</dt>
                                <dd>{email}</dd>
                            </dl>
                        </Col>
                        <Col xs={6} sm={3}>
                            <dl>
                                <dt>Dzimums</dt>
                                <dd>{genderValue}</dd>
                            </dl>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12}>
                    <Button type="button"
                            className="btn btn-default"
                            style={btnStyle}
                            data-toggle="modal"
                            data-target="#profileModal"
                            onClick={this.updateProfile.bind(this, user)}>Labot Info</Button>

                </Col>
                <ManageProfile />
            </Row>
        );
    }

}

export default connectToStores(ProfileData);