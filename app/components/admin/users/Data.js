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
import PasswordChange from '../../shared/users/PasswordChange';

// utils and config
import { isEmailValid, prefixAdminFields } from '../../../utils/utils';
import { generalConfig } from '../../../utils/config';

class UserData extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    componentDidMount() {
        const { token } = AuthStore.getState();

        UserActions.getList(token);
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
            this.update(updatable, token);
        } else {
            this.create(updatable, token);
        }
    }

    initCreate() {
        const { defaultUserRole } = generalConfig;
        const newUser = {
            admin_fields: {
                role: defaultUserRole,
                is_blocked: false
            }
        };

        UserActions.clearUpdatable(newUser);
        UserActions.setIsCreating(true);
    }

    update(updatable, token) {
        const props = prefixAdminFields(updatable);

        UserActions.update(props, token)
            .done(() => {
                UserActions.setIsRequesting(false);
                UserActions.setIsUpdating(false);
            })
            .fail(() => UserActions.setIsRequesting(false));
    }

    create(updatable, token) {
        const props = prefixAdminFields(updatable);

        UserActions.create(props, token)
            .done(() => {
                UserActions.setIsCreating(false);
                UserActions.setIsRequesting(false);
            })
            .fail(() => UserActions.setIsRequesting(false));
    }

    render() {
        const { list, isUpdating, isCreating, updatable } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Bilde', 'Vārds', 'Uzvārds', 'E-pasts', 'Telefons', 'Dzimšanas datums', 'Dzimums', 'Kluba biedrs kopš', 'Statuss', 'Loma', 'Darbības'];

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
                            <tr>{columns.map((col, index) => <th key={`UserTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                            {list.map((user, index) => <UserEntry key={`UserEntry${index}`} index={index} user={user} />)}
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
                <PasswordChange checkPass={false} />
            </Row>
        );
    }
}

export default connectToStores(UserData);
