import React from 'react';

import NavigationBar from './NavigationBar';
import Footer from './Footer';

/**
 * App component that contains the main parts.
 */
class App extends React.Component {
    /**
     * Calls methods that should be run before the app components are initialized.
     *
     * @public
     * @param props
     */
    constructor(props) {
        super(props);

        this._configureToastr();
    }

    /**
     * Configures the message toast.
     *
     * Adds the close button tells it to close instantly when pressed.
     *
     * @private
     */
    _configureToastr() {
        toastr.options.closeButton = true;
        toastr.options.closeDuration = 0;
    }

    /**
     * Renders the navigation bar, all children components as the content, and the footer.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <div>
                <NavigationBar history={this.props.history} />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default App;