import React from 'react';

import Page from '../shared/Page';

/**
 *  Admin page panel container.
 */
class AdminPage extends React.Component {
    /**
     * Renders the admin panel.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <Page title="Admin Panelis">
                {this.props.children}
            </Page>
        );
    }
}

export default AdminPage;

