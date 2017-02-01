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
import { getGroupMemberCount } from '../../../utils/utils';


class GroupData extends React.Component {
    static getStores() {
        return [GroupStore];
    }

    static getPropsFromStores() {
        return GroupStore.getState();
    }

    componentDidMount() {
        const { token } = AuthStore.getState();

        // TODO: add back when the API is done
        // GroupActions.getGroupList(token);
    }

    closeHandler(isUpdating) {
        if (isUpdating) {
            GroupActions.setIsUpdating(false);
        } else {
            GroupActions.setIsCreating(false);
        }
    }

    submitHandler(isUpdating, updatable, event) {
        const { token } = AuthStore.getState();

        event.preventDefault();

        // TODO: replace validation with react-validation
        if (!updatable.name) {
            return toastr.error('Grupas nosaukums ievadīts kļūdaini');
        }

        GroupActions.setIsRequesting(true);

        if (isUpdating) {
            this.updateGroup(updatable, token);
        } else {
            this.createGroup(updatable, token);
        }
    }

    initCreateGroup() {
        GroupActions.clearUpdatableGroup({});
        GroupActions.setIsCreating(true);
    }

    updateGroup(updatable, token) {
        GroupActions.updateGroup(updatable, token)
            .done(() => {
                GroupActions.setIsRequesting(false);
                GroupActions.setIsUpdating(false);
            })
            .fail(() => GroupActions.setIsRequesting(false));
    }

    createGroup(updatable, token) {
        GroupActions.createGroup(updatable, token)
            .done(() => {
                GroupActions.setIsCreating(false);
                GroupActions.setIsRequesting(false);
            })
            .fail(() => GroupActions.setIsRequesting(false));
    }

    renderGroupList(group, index, groupMembers) {
        const memberCount = getGroupMemberCount(group._id, groupMembers);

        return (
            <GroupEntry
                key={`GroupEntry${index}`}
                index={index}
                group={group}
                memberCount={memberCount} />
        );
    }

    render() {
        const {
            groupList, groupMembers,
            isUpdating, isCreating,
            updatable
        } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Nosaukums', 'Dalībnieku skaits', 'Darbības'];
        return (
            <Row>
                <Col xs={12}>
                    <Button
                        bsStyle="success"
                        onClick={this.initCreateGroup.bind(this)}>
                        Izveidot
                    </Button>
                </Col>
                <Col xs={12}>
                    <Table responsive>
                        <thead>
                            <tr>{columns.map((col, index) => <th key={`GroupTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                            {groupList.map((group, index) => this.renderGroupList(group, index, groupMembers) )}
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
