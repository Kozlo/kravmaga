import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

/**
 * Footer data container.
 */
export default class Footer extends React.Component {
    /**
     * Renders a non-fluid grid with with app data in the footer.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const year = new Date().getFullYear();

        return (
            <footer>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h3 className='lead'><strong>SIA "Drošā distance"</strong> <strong>Visas tiesības pasargātas {year}</strong></h3>
                            <span>v1.2.0</span>
                        </Col>
                    </Row>
                </Grid>
            </footer>
        );
    }
}
