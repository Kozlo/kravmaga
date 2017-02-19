// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LocationStore from '../../../stores/LocationStore';
import LocationActions from '../../../actions/LocationActions';

// components
import LocationEntry from './Entry';
import ManageLocation from './ManageLocation';
import LocationFields from './LocationFields';

class LocationsData extends React.Component {
    static getStores() {
        return [LocationStore];
    }

    static getPropsFromStores() {
        return LocationStore.getState();
    }

    componentDidMount() {
        const { token } = AuthStore.getState();

        LocationActions.getList(token);
    }

    closeHandler(isUpdating) {
        if (isUpdating) {
            LocationActions.setIsUpdating(false);
        } else {
            LocationActions.setIsCreating(false);
        }
    }

    submitHandler(isUpdating, updatable, event) {
        event.preventDefault();

        const { token } = AuthStore.getState();

        if (!updatable.name) {
            return toastr.error('Grupas nosaukums ievadīts kļūdaini');
        }

        LocationActions.setIsRequesting(true);

        if (isUpdating) {
            this.update(updatable, token);
        } else {
            this.create(updatable, token);
        }
    }

    initCreate() {
        LocationActions.clearUpdatable({});
        LocationActions.setIsCreating(true);
    }

    /**
     * Sends an update request to the back-end.
     *
     * @param {Object} updatable Updatable entry
     * @param {string} token Authentication token
     */
    update(updatable, token) {
        LocationActions.update(updatable, token)
            .done(() => {
                LocationActions.setIsRequesting(false);
                LocationActions.setIsUpdating(false);
            })
            .fail(() => LocationActions.setIsRequesting(false));
    }

    create(updatable, token) {
        LocationActions.create(updatable, token)
            .done(() => {
                LocationActions.setIsCreating(false);
                LocationActions.setIsRequesting(false);
            })
            .fail(() => LocationActions.setIsRequesting(false));
    }

    renderList(entry, index) {
        return (
            <LocationEntry
                key={`LocationEntry${index}`}
                index={index}
                entry={entry} />
        );
    }

    render() {
        const {
            list, updatable,
            isUpdating, isCreating
        } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Nosaukums', 'Darbības'];

        return (
            <Row>
                <Col xs={12}>
                    <Button
                        bsStyle="success"
                        onClick={this.initCreate.bind(this)}>
                        Izveidot
                    </Button>
                </Col>
                <Col xs={12}>
                    <Table responsive>
                        <thead>
                            <tr>{columns.map((col, index) => <th key={`LocationTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                        {list.map((entry, index) => this.renderList(entry, index) )}
                        </tbody>
                    </Table>
                </Col>
                <ManageLocation
                    shouldShow={shouldShow}
                    closeHandler={this.closeHandler.bind(this, isUpdating)}
                    submitHandler={this.submitHandler.bind(this, isUpdating, updatable)}>
                    <LocationFields />
                </ManageLocation>
            </Row>
        );
    }
}

export default connectToStores(LocationsData);
