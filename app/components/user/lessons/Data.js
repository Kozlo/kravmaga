// dependencies
import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import GroupStore from '../../../stores/GroupStore';
import LessonActions from '../../../actions/LessonActions';
import GroupActions from '../../../actions/GroupActions';

// components
import LessonEntry from './Entry';

class LessonData extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    componentDidMount() {
        const { token } = AuthStore.getState();

        // TODO: get groupIds where the user is in
        // TODO: get list of lessons based on the group IDs
        LessonActions.getList(token);
        GroupActions.getList(token, LessonActions.groupsReceived)
            .then(() => {
                console.log('shit', this.props.groups);
            });
    }

    renderList(entry, index) {

        return (
            <LessonEntry
                key={`LessonEntry${index}`}
                index={index}
                entry={entry}/>
        );
    }

    render() {
        const { list } = this.props;
        const columns = ['#', 'Datums', 'Grupa', 'Lokācija', 'Komentārs'];

        return (
            <Row>
                <Col xs={12}>
                    <Table responsive>
                        <thead>
                            <tr>{columns.map((col, index) => <th key={`LessonTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                        {list.map((entry, index) => this.renderList(entry, index) )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
    }
}

export default connectToStores(LessonData);
