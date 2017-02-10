import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    InputGroup, FormControl,
    ControlLabel, HelpBlock,
    Glyphicon
} from 'react-bootstrap';

import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import { initDateTimePicker, handleDateChange } from '../../../utils/utils';

class UserFields extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    componentDidMount() {
        const { updatable } = this.props;
        const { member_since } = updatable;
        const dateChangeHandler = handleDateChange.bind(this, 'birthdate', UserActions, updatable);

        initDateTimePicker('#memberSince', dateChangeHandler, member_since);
    }

    handleChange(prop, event) {
        const { updatable } = this.props;
        const { admin_fields } = updatable;

        admin_fields[prop] = event.target.value;

        UserActions.setUpdatable(updatable);
    }

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
                        <InputGroup id='memberSince'>
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
