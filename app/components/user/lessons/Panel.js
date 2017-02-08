import React from 'react';

import LessonsData from './Data';

class LessonsPanel extends React.Component {
    render() {
        return (
            <div className="panel panel-default krav-maga-panel" >
                <div className="panel-heading">
                    <h3>Manas nodarbības</h3>
                </div>
                <div className="panel-body">
                    <LessonsData />
                </div>
            </div>
        );
    }
}

export default LessonsPanel;
