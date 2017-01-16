import React from 'react';

export default class Footer extends React.Component {
    render() {
        const year = new Date().getFullYear();

        return (
            <footer>
                <div className='container'>
                    <div className='row'>
                        <div className='col-xs-12'>
                            <h3 className='lead'><strong>SIA "Drošā distance"</strong> <strong>Visas tiesības pasargātas {year}</strong></h3>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
