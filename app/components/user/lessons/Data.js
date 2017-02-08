// dependencies
import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';

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
        const { token, userId } = AuthStore.getState();

        LessonActions.getUserLessonList(token, userId);
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
