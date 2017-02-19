import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    FormControl, ControlLabel
} from 'react-bootstrap';

import LocationStore from '../../../stores/LocationStore';
import LocationActions from '../../../actions/LocationActions';

import { maxInputLength } from '../../../utils/config';

class LocationFields extends React.Component {
    static getStores() {
        return [LocationStore];
    }

    static getPropsFromStores() {
        return LocationStore.getState();
    }

    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        LocationActions.setUpdatable(updatable);
    }

    render() {
        const { updatable } = this.props;
        const { name } = updatable;

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Nosaukums</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Nosaukums"
                                maxLength={maxInputLength.regularField}
                                value={name}
                                onChange={this.handleChange.bind(this, 'name')}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(LocationFields);
