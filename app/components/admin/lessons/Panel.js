import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LessonData from './Data';

class LessonsPanel extends React.Component {
    render() {
        return (
            <PagePanel title="Nodarbības">
                <LessonData />
            </PagePanel>
        );
    }
}

export default LessonsPanel;

