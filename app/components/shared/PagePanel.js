import React from 'react';
import { Panel } from 'react-bootstrap';

/**
 * A re-usable panel used within the app's pages.
 */
class PagePanel extends React.Component {
    /**
     * Renders a panel with the specified title and within it all the component's children.
     *
     * @public
     * @returns {string} HTML markup for the component
     */
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

