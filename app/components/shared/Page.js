import React from 'react';
import { Grid } from 'react-bootstrap';

/**
 * Re-usable page component.
 */
class Page extends React.Component {
    /**
     * Renders a page for the app with a fluid (i.e. 100% width) grid, h2 title.
     *
     * Renders the child components - normally page panels.
     *
     * @public
     * @returns {string} HTML markup for the component
     */
    render() {
        return (
            <Grid fluid={true}>
                <h2>{this.props.title}</h2>
                {this.props.children}
            </Grid>
        );
    }
}

export default Page;

