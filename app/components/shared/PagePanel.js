import React from 'react';
import { Panel } from 'react-bootstrap';

class PagePanel extends React.Component {
    render() {
        const titleStyle = { fontSize: '1.5em' };
        const title = (
            <span style={titleStyle}>{this.props.title}</span>
        );

        return (
            <Panel header={title}>
                {this.props.children}
            </Panel>
        );
    }
}

export default PagePanel;

