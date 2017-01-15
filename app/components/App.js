import React from 'react';

import Navbar from './Navbar';
import Footer from './Footer';

class App extends React.Component {

    constructor(props) {
        super(props);

        toastr.options.closeButton = true;
        toastr.options.closeDuration = 0;
    }

    render() {
        return (
            <div>
                <Navbar history={this.props.history} />
                {this.props.children}
                <Footer />
            </div>
        );
    }

}

export default App;