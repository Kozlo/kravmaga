import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LocationData from './Data';

class LocationsPanel extends React.Component {
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

