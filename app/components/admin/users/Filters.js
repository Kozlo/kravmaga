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
import { updateStoreList } from '../../../utils/utils';

/**
 * User filters data presentation component.
 */
class UserFilters extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Text filter changed event handler.
     *
     * Uses regex for filtering so that the user can filter data by a 'like' syntax.
     * Updates the filters in the store and makes a new request for data.
     *
     * @public
     * @param {string} prop Name of the property that changed
     * @param {Object} event Event object
     */
    handleTextFilterChange(prop, event) {
        const { filters } = this.props;

        filters[prop] = { $regex: event.target.value };
        UserActions.setFilters(filters);

        updateStoreList(UserStore, UserActions);
    }

    /**
     * Request config changed event handler.
     *
     * Updates the config in the store and makes a new request for data.
     *
     * @public
     * @param {string} prop Name of the property that changed
     * @param {Object} event Event object
     */
    handleConfigChange(prop, event) {
        const { config } = this.props;

        config[prop] = event.target.value;
        UserActions.setConfig(config);

        updateStoreList(UserStore, UserActions);
    }

    /**
     * Filter changed event handler.
     *
     * @public
     * @param {string} prop Name of the property that changed
     * @param {Object} event Event object
     */
    handleFilterChange(prop, event) {
        const { filters } = this.props;

        filters[prop] = event.target.value;
        UserActions.setFilters(filters);

        updateStoreList(UserStore, UserActions);
    }

    /**
     * Renders user data filters (and config) form.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { limit } = this.props.config;
        const { min, max } = filterConfig.users.count;

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
