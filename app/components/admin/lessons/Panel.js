import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LessonData from './Data';
import LessonFilters from '../../shared/lessons/Filters';

class LessonsPanel extends React.Component {
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

