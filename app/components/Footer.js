import React from 'react';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer>
                <div className='container'>
                    <div className='row'>
                        <div className='col-xs-12'>
                            <h3 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h3>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;