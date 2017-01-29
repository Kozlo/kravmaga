// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

// components
import UserEntry from './Entry';
import ManageUser from '../../shared/users/ManageUser';
import UserFields from '../../shared/users/UserFields';
import AdminUserFields from '../../shared/users/AdminUserFields';

// utils
import { isEmailValid } from '../../../utils/utils';

class UserData extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    componentDidMount() {
        const { filters } = this.props;
        const { token } = AuthStore.getState();

        UserActions.getUserList(filters, token);
    }

    closeHandler(isUpdating) {
        if (isUpdating) {
            UserActions.setIsUpdating(false);
        } else {
            UserActions.setIsCreating(false);
        }
    }

    submitHandler(isUpdating, updatable, event) {
        const { token } = AuthStore.getState();

        event.preventDefault();

        // TODO: replace validation with react-validation
        if (!isEmailValid(updatable.email)) {
            return toastr.error('E-pasts ievadīts kļūdaini!');
        }

        UserActions.setIsRequesting(true);

        if (isUpdating) {
            this.updateUser(updatable, token);
        } else {
            this.createUser(updatable, token);
        }
    }

    initCreateUser() {
        UserActions.clearUpdatableUser({});
        UserActions.setIsCreating(true);
    }

    updateUser(updatable, token) {
        UserActions.updateUser(updatable, token)
            .done(() => {
                UserActions.setIsRequesting(false);
                UserActions.setIsUpdating(false);
            })
            .fail(() => UserActions.setIsRequesting(false));
    }

    createUser(updatable, token) {
        UserActions.createUser(updatable, token)
            .done(() => {
                UserActions.setIsCreating(false);
                UserActions.setIsRequesting(false);
            })
            .fail(() => UserActions.setIsRequesting(false));
    }

    render() {
        const { userList, isUpdating, isCreating, updatable } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Bilde', 'Vārds', 'Uzvārds', 'E-pasts', 'Telefons', 'Statuss', 'Loma', 'Darbības'];

        return (
            <Row>
                <Col xs={12}>
                    <Button
                        bsStyle="success"
                        onClick={this.initCreateUser.bind(this)}>
                        Izveidot
                    </Button>
                </Col>
                <Col xs={12}>
                    <Table responsive>
                        <thead>
                            <tr>{columns.map((col, index) => <th key={`UserTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                            {userList.map((user, index) => <UserEntry key={`UserEntry${index}`} index={index} user={user} />)}
                        </tbody>
                    </Table>
                </Col>
                <ManageUser
                    shouldShow={shouldShow}
                    closeHandler={this.closeHandler.bind(this, isUpdating)}
                    submitHandler={this.submitHandler.bind(this, isUpdating, updatable)}>
                    <UserFields />
                    <AdminUserFields />
                </ManageUser>
            </Row>
        );
    }
}

export default connectToStores(UserData);
