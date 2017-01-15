import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

import UserEntry from './Entry';

class UserData extends React.Component {

    static getStores() {
        return [AuthStore, UserStore];
    }

    static getPropsFromStores() {
        return {
            auth: AuthStore.getState(),
            user: UserStore.getState()
        };
    }

    componentDidMount() {
        const { token } = this.props.auth;
        const { filters } = this.props.user;

        UserActions.getUserList(filters, token);
    }

    render() {
        const { userList } = this.props.user;

        return (
            <Row>
                <Col xs={12}>
                    <h4>Dati</h4>
                </Col>
                <Col xs={12}>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Vārds</th>
                                <th>Uzvārds</th>
                                <th>E-pasts</th>
                                <th>Dzimums</th>
                                <th>Autorizācija</th>
                                <th>Statuss</th>
                                <th>Loma</th>
                                <th>Labot</th>
                                <th>Dzēst</th>
                            </tr>
                        </thead>
                        <tbody>
                        {userList.map((user, index) => <UserEntry key={`UserEntry${index}`} user={user} index={index} />)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
    }

}

export default connectToStores(UserData);
