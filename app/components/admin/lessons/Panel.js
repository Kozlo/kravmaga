import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LessonData from './Data';
import LessonFilters from '../../shared/lessons/Filters';

/**
 * Lesson data and filter container component.
 */
class LessonsPanel extends React.Component {
    /**
     * Renders lesson data components.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <PagePanel title="Nodarbības">
                <h4>Filtri</h4>
                <LessonFilters />

                <h4>Dati</h4>
                <LessonData />
            </PagePanel>
        );
    }
}

export default LessonsPanel;

