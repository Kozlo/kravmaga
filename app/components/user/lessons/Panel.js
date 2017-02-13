import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LessonsData from './Data';

class LessonsPanel extends React.Component {
    render() {
        return (
            <PagePanel title="Manas Nodarbības">
                <LessonsData />
            </PagePanel>
        );
    }
}

export default LessonsPanel;
