import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    FormControl, ControlLabel, HelpBlock
} from 'react-bootstrap';

import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

class UserFields extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
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
            </Row>
        );
    }
}

export default connectToStores(UserFields);
