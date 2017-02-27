// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';
import GroupActions from '../../../actions/GroupActions';

// components
import LessonEntry from './Entry';
import ManageLesson from './ManageLesson';
import LessonFields from './LessonFields';

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
     * Requests lesson data.
     *
     * @public
     */
    componentDidMount() {
        this._requestData();
    }

    /**
     * Modal closed event handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if the lesson is being updated
     */
    closeHandler(isUpdating) {
        if (isUpdating) {
            LessonActions.setIsUpdating(false);
        } else {
            LessonActions.setIsCreating(false);
        }
    }

    /**
     * Lesson edit form submit handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if the lesson is being updated
     * @param {Object} updatable Updatable lesson
     * @param {Object} event Event object
     * @returns {*}
     */
    submitHandler(isUpdating, updatable, event) {
        event.preventDefault();

        const { token } = AuthStore.getState();
        const mandatoryFields = ['start', 'end', 'group', 'location'];

        for (let i = 0; i < mandatoryFields.length; i++) {
            if (!updatable[mandatoryFields[i]]) {
                return toastr.error('Lūdzu aizpildiet visus obligātos laukus!');
            }
        }

        const { start , end} = updatable;

        if (new Date(start) >=  new Date(end)) {
            return toastr.error('Beigu datumam un laikam jābūt mazāka par sākuma datumu un laiku!');
        }

        LessonActions.setIsRequesting(true);

        if (isUpdating) {
            this.update(updatable, token);
        } else {
            this.create(updatable, token);
        }
    }

    /**
     * Initiates lesson creation modal.
     *
     * @public
     */
    initCreate() {
        LessonActions.clearUpdatable({});
        LessonActions.setIsCreating(true);
    }

    /**
     * Updates and existing lesson.
     *
     * @public
     * @param {Object} updatable Updatable lesson
     * @param {string} token Authorization token
     */
    update(updatable, token) {
        LessonActions.update(updatable, token)
            .done(() => this._onRequestDone(LessonActions.setIsUpdating))
            .fail(() => this._onRequestFailed());
    }

    /**
     * Creates a new lesson.
     *
     * @public
     * @param {Object} updatable Updatable object
     * @param {string} token Authorization token
     */
    create(updatable, token) {
        LessonActions.create(updatable, token)
            .done(() => this._onRequestDone(LessonActions.setIsCreating))
            .fail(() => this._onRequestFailed());
    }

    /**
     * Renders a lesson entry.
     *
     * @public
     * @param {Object} entry Entry object
     * @param {number} index Entry index
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
     * Requests lessons with the applied filters and config,
     * as well as group info, which is used for displaying groups names.
     *
     * @private
     */
    _requestData() {
        const { token } = AuthStore.getState();
        const { filters, sorters, config } = this.props;

        LessonActions.getList(token, LessonActions.listReceived, filters, sorters, config);
        GroupActions.getList(token, LessonActions.groupsReceived);
    }

    /**
     * Request success handler.
     * Calls request success action with false - setIsUpdating or setIsCreating for update and create respectively.
     *
     * Also calls the method to request new data in order to apply the filters, sorters, config properly.
     *
     * @param {Function} action Lesson action to call on success
     * @private
     */
    _onRequestDone(action) {
        action(false);
        LessonActions.setIsRequesting(false);

        this._requestData();
    }

    /**
     * Request failed handler.
     *
     * @private
     */
    _onRequestFailed() {
        LessonActions.setIsRequesting(false)
    }

    /**
     * Renders lesson data in a table format.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const {
            list, updatable,
            isUpdating, isCreating
        } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Sākums', 'Beigas', 'Grupa', 'Lokācija', 'Ieradīsies', 'Komentārs', 'Darbības'];

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
                            <tr>{columns.map((col, index) => <th key={`LessonTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                        {list.map((entry, index) => this.renderList(entry, index) )}
                        </tbody>
                    </Table>
                </Col>
                <ManageLesson
                    shouldShow={shouldShow}
                    closeHandler={this.closeHandler.bind(this, isUpdating)}
                    submitHandler={this.submitHandler.bind(this, isUpdating, updatable)}>
                    <LessonFields />
                </ManageLesson>
            </Row>
        );
    }
}

export default connectToStores(LessonData);
