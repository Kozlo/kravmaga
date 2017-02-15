// dependencies
import React from 'react';
import {
    Row, Col,
    FormGroup, ControlLabel,
    FormControl,
    HelpBlock
} from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

// components

// utils & config
import { filterConfig, maxInputLength } from '../../../utils/config';

class UserFilters extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    handleTextFilterChange(prop, event) {
        const { filters } = this.props;

        filters[prop] = { $regex: event.target.value };
        UserActions.setFilters(filters);

        this._requestUserLessons();
    }

    handleConfigChange(prop, event) {
        const { config } = this.props;

        config[prop] = event.target.value;
        UserActions.setConfig(config);

        this._requestUserLessons();
    }

    handleFilterChange(prop, event) {
        const { filters } = this.props;

        filters[prop] = event.target.value;
        UserActions.setFilters(filters);

        this._requestUserLessons();
    }

    _requestUserLessons() {
        const { token } = AuthStore.getState();
        const { filters, sorters, config } = this.props;

        UserActions.getList(token, UserActions.listReceived, filters, sorters, config);
    }

    render() {
        const { limit } = this.props.config;
        const { min, max } = filterConfig.users.count;

        // TODO: for now add given_name, family_name, statuss filters, and limit
        return (
            <Row>
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Vārds</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Vārds"
                            maxLength={maxInputLength.regularField}
                            onChange={this.handleTextFilterChange.bind(this, 'given_name')}
                        />
                    </FormGroup>
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Uzvārds</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Uzvārds"
                            maxLength={maxInputLength.regularField}
                            onChange={this.handleTextFilterChange.bind(this, 'family_name')}
                        />
                    </FormGroup>
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Statuss</ControlLabel>
                        <FormControl
                            componentClass="select"
                            placeholder="Statuss"
                            onChange={this.handleFilterChange.bind(this, 'admin_fields.is_blocked')}>
                            <option value="">Visi</option>
                            <option value={false}>Aktīvs</option>
                            <option value={true}>Bloķēts</option>
                        </FormControl>
                        <FormControl.Feedback />
                        <HelpBlock>Vai lietotājs ir aktīvs vai bloķēts?</HelpBlock>
                    </FormGroup>
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Lieotāju skaits</ControlLabel>
                        <FormControl
                            type="number"
                            placeholder="Lietotāju skaits"
                            min={min}
                            max={max}
                            value={limit}
                            onChange={this.handleConfigChange.bind(this, 'limit')}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Cik lietotājus rādīt (maks.)?</HelpBlock>
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}

export default connectToStores(UserFilters);
