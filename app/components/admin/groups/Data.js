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


class GroupData extends React.Component {
    static getStores() {
        return [GroupStore];
    }

    static getPropsFromStores() {
        return GroupStore.getState();
    }

    componentDidMount() {
        const { filters } = this.props;
        const { token } = AuthStore.getState();

        GroupActions.getGroupList(filters, token);
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

    render() {
        const { userList, isUpdating, isCreating, updatable } = this.props;
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
                            {groupList.map((user, index) => <UserEntry key={`GroupEntry${index}`} index={index} group={group} />)}
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
