// dependencies
import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, Button,
    ButtonToolbar, Image
} from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

// components
import ManageUser from '../../shared/users/ManageUser';
import UserFields from '../../shared/users/UserFields';
import PasswordChange from '../../shared/users/PasswordChange';

// utility methods and config
import { getGenderValue, createObject, isEmailValid, formatDateString } from '../../../utils/utils';
import { assets, userFieldNames } from '../../../utils/config';

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

    updateUser(user) {
        UserActions.clearUpdatableUser(user);
        UserActions.setIsUpdating(true);
    }

    initChangePassword(user) {
        UserActions.clearUpdatableUser(user);
        UserActions.setIsChangingPassword(true);
    }

    closeHandler() {
        UserActions.setIsUpdating(false);
    }

    submitHandler(event) {
        const { updatable } = this.props;

        event.preventDefault();

        // TODO: replace validation with react-validation
        if (!isEmailValid(updatable.email)) {
            return toastr.error('E-pasts ievadīts kļūdaini!');
        }

        const { token } = AuthStore.getState();
        const updatableProps = createObject(userFieldNames.general, updatable);

        UserActions.setIsRequesting(true);
        UserActions
            .updateUser(updatableProps, token)
            .done(() => {
                UserActions.setIsUpdating(false);
                UserActions.setIsRequesting(false);
            })
            .fail(() => UserActions.setIsRequesting(false));
    }

    render() {
        const { user, isUpdating } = this.props;
        const {
            given_name, family_name,
            email, phone,
            gender,
            birthdate, member_since
        } = this.props.user;
        const imgSrc = user.picture || assets.defaultImage;
        const genderValue = getGenderValue(gender);
        const birthdateValue = formatDateString(birthdate);
        const memberSinceValue = formatDateString(member_since);
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
                            <Image src={imgSrc} style={imageStyle} responsive />
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
                    <Row>
                        <Col xs={6}>
                            <dl>
                                <dt>Dzimšanas datums</dt>
                                <dd>{birthdateValue}</dd>
                            </dl>
                        </Col>
                        <Col xs={6}>
                            <dl>
                                <dt>Kluba biedrs kopš</dt>
                                <dd>{memberSinceValue}</dd>
                            </dl>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12}>
                    <ButtonToolbar>
                        <Button
                            style={btnStyle}
                            onClick={this.updateUser.bind(this, user)}>
                            Labot Info
                        </Button>
                        <Button
                            bsStyle="warning"
                            onClick={this.initChangePassword.bind(this, user)}>
                            Mainīt Paroli
                        </Button>
                    </ButtonToolbar>
                </Col>
                <ManageUser
                    shouldShow={isUpdating}
                    submitHandler={this.submitHandler.bind(this)}
                    closeHandler={this.closeHandler.bind(this)}>
                    <UserFields />
                </ManageUser>
                <PasswordChange />
            </Row>
        );
    }
}

export default connectToStores(ProfileData);
