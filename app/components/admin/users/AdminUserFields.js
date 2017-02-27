import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup, Glyphicon
    InputGroup, FormControl,
    ControlLabel, HelpBlock
} from 'react-bootstrap';

import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import { initDateTimePicker } from '../../../utils/utils';

/**
 * User admin field data presentation component.
 *
 * These fields are only editable by users with admin privileges.
 */
class UserFields extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Initiates member_since field date picker.
     *
     * @public
     */
    componentDidMount() {
        const { updatable } = this.props;
        const { member_since } = updatable.admin_fields;
        const dateChangeHandler = this._handleAdminDateFieldChange.bind(this, 'member_since', updatable);

        initDateTimePicker('#member_since', dateChangeHandler, member_since);
    }

    /**
     * Field value changes handler.
     *
     * @public
     * @param {*} prop Property value
     * @param {Object} event Event object
     */
    handleChange(prop, event) {
        const { updatable } = this.props;
        const { admin_fields } = updatable;

        admin_fields[prop] = event.target.value;

        UserActions.setUpdatable(updatable);
    }

    /**
     * Admin date field date value change handler.
     *
     * Uses the passed entry actions to set the updatable.
     *
     * @private
     * @param {string} prop Property name to udpate
     * @param {Object} updatable Updatable entry
     * @param {Date} date New date value
     */
    _handleAdminDateFieldChange(prop, updatable, date) {
        date = date && date !== 'false' ? date : '';

        updatable.admin_fields[prop] = date;

        UserActions.setUpdatable(updatable);
    }

    /**
     * Renders admin field forms.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { role, is_blocked } = this.props.updatable.admin_fields;

        return (
            <Row>
                <Col xs={12}>
                    <FormGroup>
                        <ControlLabel>Statuss</ControlLabel>
                        <FormControl
                                componentClass="select"
                                placeholder="Statuss"
                                onChange={this.handleChange.bind(this, 'is_blocked')}
                                value={is_blocked}>
                            <option value={false}>Aktīvs</option>
                            <option value={true}>Bloķēts</option>
                        </FormControl>
                        <FormControl.Feedback />
                        <HelpBlock>Vai lietotājs ir aktīvs vai bloķēts?</HelpBlock>
                    </FormGroup>
                </Col>
                <Col xs={12}>
                    <FormGroup>
                        <ControlLabel>Loma</ControlLabel>
                        <select className="form-control"
                                onChange={this.handleChange.bind(this, 'role')}
                                value={role}>
                            <option value="user">Lietotājs</option>
                            <option value="admin">Admins</option>
                        </select>
                        <FormControl.Feedback />
                        <HelpBlock>Vai lietotājs ir admins?</HelpBlock>
                    </FormGroup>
                </Col>
                <Col xs={12}>
                    <FormGroup>
                        <ControlLabel>Kluba biedrs kopš</ControlLabel>
                        <InputGroup id='member_since'>
                            <FormControl
                                type="text"
                                placeholder="Datums"
                            />
                            <InputGroup.Addon>
                                <Glyphicon glyph="calendar" />
                            </InputGroup.Addon>
                        </InputGroup>
                        <HelpBlock>Datums no kura lietotājs ir kluba biedrs.</HelpBlock>
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}

export default connectToStores(UserFields);
