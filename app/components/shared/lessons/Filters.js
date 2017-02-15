// dependencies
import React from 'react';
import {
    Row, Col, Glyphicon,
    FormGroup, ControlLabel,
    FormControl, InputGroup,
    HelpBlock
} from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';

// components

// utils & config
import { filterConfig } from '../../../utils/config';
import { initDateTimePicker } from '../../../utils/utils';

class LessonFilters extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    componentDidMount() {
        const { $gte } = this.props.filters.start;
        const startChangeHandler = this._handleDateChange.bind(this);

        initDateTimePicker('#startFilter', startChangeHandler, $gte);
    }

    handleLimitChange(event) {
        const limit = event.target.value;

        LessonActions.setLimit(limit);

        this._requestUserLessons();
    }

    _requestUserLessons() {
        const { token, userId } = AuthStore.getState();
        const { filters, sorters, limit, userLessonsOnly } = this.props;

        if (userLessonsOnly) {
            LessonActions.getUserLessonList(token, userId, filters, sorters, limit);
        } else {
            LessonActions.getList(token, LessonActions.listReceived, filters, limit);
        }
    }

    _handleDateChange(date) {
        const { filters } = this.props;

        date = date && date !== 'false' ? date : '';
        filters.start = { '$gte': date };
        LessonActions.setFilters(filters);

        this._requestUserLessons();
    }

    render() {
        const { limit } = this.props;
        const { min, max } = filterConfig.lessons.count;

        return (
            <Row>
                <Col xs={12} sm={6}>
                    <FormGroup>
                        <ControlLabel>Nodarbību sākuma datums</ControlLabel>
                        <InputGroup id='startFilter'>
                            <FormControl
                                type="text"
                                placeholder="Nodarbības sākuma datums"
                            />
                            <InputGroup.Addon>
                                <Glyphicon glyph="calendar" />
                            </InputGroup.Addon>
                        </InputGroup>
                        <HelpBlock>No kura datuma rādīt nodarbības.</HelpBlock>
                    </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                    <FormGroup>
                        <ControlLabel>Nodabību skaits</ControlLabel>
                        <FormControl
                            type="number"
                            placeholder="Nodarbību skaits"
                            min={min}
                            max={max}
                            value={limit}
                            onChange={this.handleLimitChange.bind(this)}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Cik nodarbības rādīt (max)?</HelpBlock>
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}

export default connectToStores(LessonFilters);
