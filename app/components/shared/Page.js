import React from 'react';
import { Grid } from 'react-bootstrap';

class Page extends React.Component {
    render() {
        return (
            <Grid>
                <h2>{this.props.title}</h2>
                {this.props.children}
            </Grid>
        );
    }
}

export default Page;

