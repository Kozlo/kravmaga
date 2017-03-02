// dependencies
import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';
import GroupActions from '../../../actions/GroupActions';

// components
import LessonEntry from './Entry';

/**
 * Lesson data presentation component.
 */
class LessonData extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    /**
     * Requests the data.
     *
     * @public
     */
    componentDidMount() {
        this._requestData();
    }

    /**
     * Resets lesson filters.
     *
     * @public
     */
    componentWillUnmount() {
        LessonActions.resetFilters();
    }

    /**
     * Lesson entry renderer.
     *
     * @public
     * @param {string} entry Entry data to visualize
     * @param {number} index Entry array index
     * @returns {string} HTML markup
     */
    renderList(entry, index) {
        return (
            <LessonEntry
                key={`LessonEntry${index}`}
                index={index}
                entry={entry}/>
        );
    }

    /**
     * Requests group and lesson lists.
     *
     * @private
     */
    _requestData() {
        const { token, userId } = AuthStore.getState();
        const { filters, sorters, config } = this.props;

        GroupActions.getUserGroupList(token, userId);
        LessonActions.getUserLessonList(token, userId, filters, sorters, config);
    }

    /**
     * Renders lesson data in a table.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { list } = this.props;
        const columns = ['#', 'Sākums', 'Beigas', 'Grupa', 'Lokācija', 'Komentārs'];

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
