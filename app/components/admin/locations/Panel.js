import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LocationData from './Data';

/**
 * Location data container component.
 */
class LocationsPanel extends React.Component {
    /**
     * Renders location data components.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <PagePanel title="Lokācijas">
                <p>Pre-definēti lokāciju nosaukumi, kas nav tieši sasaistīti ar nodarbībām.</p>
                <LocationData />
            </PagePanel>
        );
    }
}

export default LocationsPanel;

