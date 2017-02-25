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
import { filterConfig, maxInputLength } from '../../../utils/config';
import { initDateTimePicker } from '../../../utils/utils';

/**
 * Re-usable component for filtering lessons.
 *
 * Used on both the admin panel and in user lessons panel.
 */
class LessonFilters extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    /**
     * Initiates the start time date/time picker.
     *
     * @public
     */
    componentDidMount() {
        const { $gte } = this.props.filters.start;
        const startChangeHandler = this._handleDateChange.bind(this);

        initDateTimePicker('#startFilter', startChangeHandler, $gte);
    }

    /**
     * Request config value changed handler.
     *
     * Makes a new request when a change is made to reflect the change in the data.
     *
     * @public
     * @param {*} prop Changed property
     * @param {Object} event Change event
     */
    handleConfigChange(prop, event) {
        const { config } = this.props;
        const value = parseInt(event.target.value, 10);

        config[prop] = value;
        LessonActions.setConfig(config);

        this._requestUserLessons();
    }

    /**
     * Text filter value changed handler.
     *
     * Makes a new request when a change is made to reflect the change in the data.
     *
     * @public
     * @param {*} prop Changed property
     * @param {Object} event Change event
     */
    handleTextFilterChange(prop, event) {
        const { filters } = this.props;

        filters[prop] = { $regex: event.target.value };
        LessonActions.setFilters(filters);

        this._requestUserLessons();
    }

    /**
     * Date filter value changed handler.
     *
     * Makes a new request when a change is made to reflect the change in the data.
     *
     * @private
     * @param {*} date The new date value
     */
    _handleDateChange(date) {
        const { filters } = this.props;

        date = date && date !== 'false' ? date : '';
        filters.start = { '$gte': date };
        LessonActions.setFilters(filters);

        this._requestUserLessons();
    }

    /**
     * Requests user lessons.
     *
     * If user lesson only flag is true, the lessons for the current user are fetched.
     * Otherwise all lessons are fetched (based on current filter, sorted, config).
     *
     * @private
     */
    _requestUserLessons() {
        const { token, userId } = AuthStore.getState();
        const { filters, sorters, config, userLessonsOnly } = this.props;

        if (userLessonsOnly) {
            LessonActions.getUserLessonList(token, userId, filters, sorters, config);
        } else {
            LessonActions.getList(token, LessonActions.listReceived, filters, sorters, config);
        }
    }

    /**
     * Renders a form controls with filters use for lessons.
     *
     * @public
     * @returns {string} HTML markup for the component
     */
    render() {
        const { limit } = this.props.config;
        const { min, max } = filterConfig.lessons.count;

        return (
            <Row>
                <Col xs={12} sm={6} lg={3}>
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
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Lokācija</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Location"
                            maxLength={maxInputLength.regularField}
                            onChange={this.handleTextFilterChange.bind(this, 'location')}
                        />
                        <HelpBlock>Vieta, kur nodarbība notiks.</HelpBlock>
                    </FormGroup>
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Nodabību skaits</ControlLabel>
                        <FormControl
                            type="number"
                            placeholder="Nodarbību skaits"
                            min={min}
                            max={max}
                            value={limit}
                            onChange={this.handleConfigChange.bind(this, 'limit')}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Cik nodarbības rādīt (maks.)?</HelpBlock>
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}

export default connectToStores(LessonFilters);
