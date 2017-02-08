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

class LessonData extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    componentDidMount() {
        const { token } = AuthStore.getState();

        LessonActions.getList(token);

        GroupActions.getList(token, LessonActions.groupsReceived);
    }

    closeHandler(isUpdating) {
        if (isUpdating) {
            LessonActions.setIsUpdating(false);
        } else {
            LessonActions.setIsCreating(false);
        }
    }

    submitHandler(isUpdating, updatable, event) {
        const { token } = AuthStore.getState();

        event.preventDefault();

        // TODO: replace validation with react-validation
        const mandatoryFields = ['date', 'group', 'location'];

        for (let i = 0; i < mandatoryFields.length; i++) {
            if (!updatable[mandatoryFields[i]]) {
                return toastr.error('Lūdzu aizpildiet visus obligātos laukus!');
            }
        }

        LessonActions.setIsRequesting(true);

        if (isUpdating) {
            this.update(updatable, token);
        } else {
            this.create(updatable, token);
        }
    }

    initCreate() {
        LessonActions.clearUpdatable({});
        LessonActions.setIsCreating(true);
    }

    update(updatable, token) {
        LessonActions.update(updatable, token)
            .done(() => {
                LessonActions.setIsRequesting(false);
                LessonActions.setIsUpdating(false);
            })
            .fail(() => LessonActions.setIsRequesting(false));
    }

    create(updatable, token) {
        LessonActions.create(updatable, token)
            .done(() => {
                LessonActions.setIsCreating(false);
                LessonActions.setIsRequesting(false);
            })
            .fail(() => LessonActions.setIsRequesting(false));
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
        const {
            list, updatable,
            isUpdating, isCreating
        } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Datums', 'Grupa', 'Lokācija', 'Pieteikušo skaits', 'Komentārs', 'Darbības'];

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
