import React from 'react';
import { Row, Col } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

// other components
import ManageUser from './Manage';
import UserData from './Data';

class UserPanel extends React.Component {
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
        return (
            <div className="panel panel-default krav-maga-panel" >
                <div className="panel-heading">
                    <h3>Lietotāji</h3>
                </div>
                <div className="panel-body">
                    <Row>
                        <Col xs={12}>
                            <h4>Dati</h4>
                        </Col>
                        <Col xs={12}>
                            <UserData />
                        </Col>
                    </Row>
                </div>

                <ManageUser />

            </div>
        );
    }

}

export default connectToStores(UserPanel);

