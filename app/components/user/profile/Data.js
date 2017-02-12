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

        UserActions.get(userId, token);
    }

    update(entry) {
        UserActions.clearUpdatable(entry);
        UserActions.setIsUpdating(true);
    }

    initChangePassword(entry) {
        UserActions.clearUpdatable(entry);
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
            .update(updatableProps, token)
            .done(() => {
                UserActions.setIsUpdating(false);
                UserActions.setIsRequesting(false);
            })
            .fail(() => UserActions.setIsRequesting(false));
    }

    render() {
        const { entry, isUpdating } = this.props;
        const {
            given_name, family_name,
            email, phone,
            gender, birthdate
        } = entry;
        const imgSrc = entry.picture || assets.defaultImage;
        const genderValue = getGenderValue(gender);
        const birthdateValue = formatDateString(birthdate);
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
                    </Row>
                </Col>
                <Col xs={12}>
                    <ButtonToolbar>
                        <Button
                            style={btnStyle}
                            onClick={this.update.bind(this, entry)}>
                            Labot Info
                        </Button>
                        <Button
                            bsStyle="warning"
                            onClick={this.initChangePassword.bind(this, entry)}>
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
                <PasswordChange checkPass={true} />
            </Row>
        );
    }
}

export default connectToStores(ProfileData);
