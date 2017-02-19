import React from 'react';

import PagePanel from '../../shared/PagePanel';
import LocationData from './Data';

class LocationsPanel extends React.Component {
    render() {
        return (
            <PagePanel title="Lokācijas">
                <LocationData />
            </PagePanel>
        );
    }
}

export default LocationsPanel;

