import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LessonData from './Data';
import LessonFilters from '../../shared/lessons/Filters';

/**
 * Lesson data and filter container component.
 */
class LessonsPanel extends React.Component {
    /**
     * Renders lesson data and filters components.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <PagePanel title="Nodarbību saraksts">
                <h4>Filtri</h4>
                <LessonFilters userLessonsOnly={true} />

                <h4>Dati</h4>
                <LessonData />
            </PagePanel>
        );
    }
}

export default LessonsPanel;
