// dependencies
import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Row, Col, Media, Image } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

// components
import ProfileActions from './Actions';

// utility methods and config
import {
    getGenderValue, formatDateString,
    getStatusValue, getRoleValue
} from '../../../utils/utils';
import { assets } from '../../../utils/config';

/**
 * User information presentation component.
 *
 * Contains checks to see if the data should only be viewed or also updated.
 */
class ProfileData extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Retrieves the user whose profile is begin viewed.
     *
     * @public
     */
    componentDidMount() {
        const { token, userId } = AuthStore.getState();
        const { viewableUserId = userId } = this.props;

        UserActions.get(viewableUserId, token);
    }

    /**
     * Renders the user profile panel data.
     *
     * If the component is not read-only, renders user profile actions.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { entry, viewableUserId } = this.props;
        const {
            given_name, family_name,
            email, phone,
            gender, birthdate,
            admin_fields = {}
        } = entry;
        const {
            role, is_blocked, member_since
        } = admin_fields;

        const roleValue = getRoleValue(role);
        const status = getStatusValue(is_blocked);
        const memberSinceValue = formatDateString(member_since);

        const imgSrc = entry.picture || assets.defaultImage;
        const genderValue = getGenderValue(gender);
        const birthdateValue = formatDateString(birthdate);
        const isViewOnly = viewableUserId !== undefined;
        const imageStyle = { float: 'left', width: '130px', margin: '0 10px 10px 0' };

        return (
            <Row>
                <Col xs={12}>
                    <Media>
                        <Media.Left>
                            <Image src={imgSrc} style={imageStyle} alt="Lietotāja profils" />
                        </Media.Left>
                        <Media.Body>
                            <Media.Heading>{given_name} {family_name}</Media.Heading>
                            <Row>
                                <Col xs={12} sm={6}>
                                    <p><b>E-pasts:</b> {email}</p>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <p><b>Telefona nr:</b> {phone}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={6}>
                                    <p><b>Dzimums:</b> {genderValue}</p>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <p><b>Dzimšanas diena:</b> {birthdateValue}</p>
                                </Col>
                            </Row>
                            {
                                isViewOnly &&
                                <Row>
                                    <Col xs={12} sm={6}>
                                        <p><b>Loma:</b> {roleValue}</p>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <p><b>Statuss:</b> {status}</p>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <p><b>Kluba biedrs kopš:</b> {memberSinceValue}</p>
                                    </Col>
                                </Row>
                            }
                        </Media.Body>
                    </Media>
                </Col>
                {
                    !isViewOnly &&
                    <Col xs={12}>
                        <ProfileActions />
                    </Col>
                }
            </Row>
        );
    }
}

export default connectToStores(ProfileData);
