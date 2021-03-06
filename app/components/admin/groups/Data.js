// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import GroupStore from '../../../stores/GroupStore';
import GroupActions from '../../../actions/GroupActions';

// components
import GroupEntry from './Entry';
import ManageGroup from './ManageGroup';
import GroupFields from './GroupFields';

// utils/config
import { getGroupMemberCount } from '../../../utils/utils';

/**
 * Group data presentation component.
 */
class GroupData extends React.Component {
    static getStores() {
        return [GroupStore];
    }

    static getPropsFromStores() {
        return GroupStore.getState();
    }

    /**
     * Retrieves all group list.
     *
     * @public
     */
    componentDidMount() {
        const { token } = AuthStore.getState();

        GroupActions.getList(token);
    }

    /**
     * Group modal closed handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if the user is being updated.
     */
    closeHandler(isUpdating) {
        if (isUpdating) {
            GroupActions.setIsUpdating(false);
        } else {
            GroupActions.setIsCreating(false);
        }
    }

    /**
     * User modal submit handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if the user is being updated.
     * @param {Object} updatable Updatable user
     * @param {Object} event Event object
     * @returns {*}
     */
    submitHandler(isUpdating, updatable, event) {
        event.preventDefault();

        const { token } = AuthStore.getState();

        if (!updatable.name) {
            return toastr.error('Grupas nosaukums ievadīts kļūdaini');
        }

        GroupActions.setIsRequesting(true);

        if (isUpdating) {
            this.update(updatable, token);
        } else {
            this.create(updatable, token);
        }
    }

    /**
     * Initiates the group creation modal.
     *
     * @public
     */
    initCreate() {
        GroupActions.clearUpdatable({});
        GroupActions.setIsCreating(true);
    }

    /**
     * Sends an update request to the back-end.
     *
     * Sets the members to null as an empty array won't be sent.
     *
     * @public
     * @param {Object} updatable Updatable entry
     * @param {string} token Authentication token
     */
    update(updatable, token) {
        if (updatable.members.length === 0) {
            updatable.members = null;
        }

        GroupActions.update(updatable, token)
            .done(() => this._onGroupUpdated())
            .fail(() => GroupActions.setIsRequesting(false));
    }

    /**
     * Creates new group creation.
     *
     * @public
     * @param {Object} updatable Updatable object
     * @param {string} token Authorization token
     */
    create(updatable, token) {
        GroupActions.create(updatable, token)
            .done(() => this._onGroupCreated())
            .fail(() => GroupActions.setIsRequesting(false));
    }

    /**
     * Renders a group entry.
     *
     * @public
     * @param {Object} entry Entry object
     * @param {number} index Group entry index
     * @param {Object[]} members Group members (users)
     * @returns {string} HTML markup
     */
    renderList(entry, index, members) {
        const memberCount = getGroupMemberCount(entry._id, members);

        return (
            <GroupEntry
                key={`GroupEntry${index}`}
                index={index}
                entry={entry}
                memberCount={memberCount} />
        );
    }

    /**
     * Updates lesson store in case group members have been changes.
     * Sets the requesting and updating flags to false.
     *
     * @private
     */
    _onGroupUpdated() {
        GroupActions.setIsUpdating(false);
        GroupActions.setIsRequesting(false);
    }

    /**
     * Sets the creating and requesting flags to false.
     *
     * @private
     */
    _onGroupCreated() {
        GroupActions.setIsCreating(false);
        GroupActions.setIsRequesting(false);
    }

    /**
     * Renders group data in a table format.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const {
            list, members, updatable,
            isUpdating, isCreating
        } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Nosaukums', 'Dalībnieki', 'Darbības'];

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
                            <tr>{columns.map((col, index) => <th key={`GroupTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                        {list.map((entry, index) => this.renderList(entry, index, members) )}
                        </tbody>
                    </Table>
                </Col>
                <ManageGroup
                    shouldShow={shouldShow}
                    closeHandler={this.closeHandler.bind(this, isUpdating)}
                    submitHandler={this.submitHandler.bind(this, isUpdating, updatable)}>
                    <GroupFields />
                </ManageGroup>
            </Row>
        );
    }
}

export default connectToStores(GroupData);
