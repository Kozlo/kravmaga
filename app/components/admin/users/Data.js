import React from 'react';
import { Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import UserStore from '../../../stores/UserStore';

// other components
import UserEntry from './Entry';

class UserData extends React.Component {

    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    render() {
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Vārds</th>
                        <th>Uzvārds</th>
                        <th>E-pasts</th>
                        <th>Autorizācija</th>
                        <th>Statuss</th>
                        <th>Loma</th>
                        <th>Labot</th>
                        <th>Dzēst</th>
                    </tr>
                </thead>
                <tbody>
                {this.props.userList.map((user, index) => <UserEntry key={`UserEntry${index}`} user={user} index={index} />)}
                </tbody>
            </Table>
        );
    }

}

export default connectToStores(UserData);
