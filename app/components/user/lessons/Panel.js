import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LessonData from './Data';
import LessonFilters from '../../shared/lessons/Filters';

class LessonsPanel extends React.Component {
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
