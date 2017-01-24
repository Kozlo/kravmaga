import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Row, Col, Button } from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import ManageProfile from './Manage';
import { getGenderValue } from '../../../utils/utils';
import { userFields, assets } from '../../../utils/config';

class ProfileData extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    componentDidMount() {
        const { userId, token } = AuthStore.getState();

        UserActions.getUser(userId, token);
    }

    updateProfile(user) {
        const updatableUser = { };

        userFields.general.forEach(fieldName => updatableUser[fieldName] = user[fieldName] || '');

        UserActions.setUpdatableUser(updatableUser);
    }

    render() {
        const { user } = this.props;
        const { gender, given_name, family_name, phone, email } = user;
        const imgSrc = user.picture || assets.defaultImage;
        const genderValue = getGenderValue(gender);
        const imageStyle = {
            float: 'left',
            margin: '0 15px 15px 0',
            maxWidth: '130px'
        };
        const btnStyle = {
            float: 'right',
            marginRight: '10px'
        };

        return (
            <Row>
                <Col xs={12}>
                    <Row>
                        <Col xs={12} sm={5}>
                            <img src={imgSrc} alt="User Image" style={imageStyle} />
                            <dl>
                                <dt>Vārds, Uzvārds</dt>
                                <dd>{given_name} {family_name}</dd>
                            </dl>
                        </Col>
                        <Col xs={6} sm={3}>
                            <dl>
                                <dt>E-pasts</dt>
                                <dd>{email}</dd>
                            </dl>
                        </Col>
                        <Col xs={6} sm={2}>
                            <dl>
                                <dt>Telefona nr.</dt>
                                <dd>{phone}</dd>
                            </dl>
                        </Col>
                        <Col xs={6} sm={2}>
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
