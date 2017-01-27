import React from 'react';
import { Button, Modal } from 'react-bootstrap';

/**
 * Modal with a form used for data (e.g. user, lesson, expense) creation and update.
 *
 * @property {boolean} shouldShow Flag showing if the popup should be shown
 * @property {string} title Title of the popup
 * @property {Function} closeHandler Function to call when the popup closes
 * @property {Function} submitHandler Function to call when the form is submitted
 * @property {boolean} isDisabled Flag showing if the submit button should be enabled.
 */
class DataModal extends React.Component {
    render() {
        const {
            shouldShow,
            title,
            closeHandler,
            submitHandler,
            isDisabled,
        } = this.props;

        return (
            <Modal show={shouldShow} onHide={closeHandler}>
                <form onSubmit={submitHandler}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.children}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={closeHandler}>Aizvērt</Button>
                        <Button
                            type={isDisabled ? 'button' : 'submit'}
                            bsStyle="primary"
                            disabled={isDisabled}>
                            {isDisabled ? 'Saglabā...' : 'Saglabāt'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default DataModal;
