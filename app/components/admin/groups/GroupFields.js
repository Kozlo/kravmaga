import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    FormControl, ControlLabel
} from 'react-bootstrap';

import GroupStore from '../../../stores/GroupStore';
import GroupActions from '../../../actions/GroupActions';

class GroupFields extends React.Component {
    static getStores() {
        return [GroupStore];
    }

    static getPropsFromStores() {
        return GroupStore.getState();
    }

    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        GroupActions.setUpdatableGroup(updatable);
    }

    render() {
        const { updatable/*, groupMembers*/ } = this.props;
        const { name } = updatable;
        // const members = groupMembers[updatable._id];

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Nosaukums</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Nosaukums"
                                value={name}
                                onChange={this.handleChange.bind(this, 'name')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Grupas biedri</ControlLabel>
                            {/*TODO: Add some bootstrap pills with the users and an ability to add more users*/}
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(GroupFields);
