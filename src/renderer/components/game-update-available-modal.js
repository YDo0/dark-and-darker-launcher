const appConfig = require('application-config')('DarkAndDarkerLauncher');
const React = require('react');

const ModalOKCancel = require('./modal-ok-cancel');
const { dispatch } = require('../lib/dispatcher');

module.exports = class GameUpdateAvailableModal extends React.Component {
    render() {
        const state = this.props.state;
        return (
            <div className='game-update-available-modal'>
                <p>
                    <strong>
                        A new game version is available: v
                        {state.modal.version}
                    </strong>
                    <br/> Game download should start shortly!
                </p>
                {/* <p>
                    We have an auto-updater for Windows and Mac. We don't have
                    one for Linux yet, so you'll have to download the new
                    version manually.
                </p> */}
                <ModalOKCancel
                    okText='OK'
                    onOK={handleShow}
                />
            </div>
        );

        function handleShow() {
            dispatch('exitModal');
        }
    }
};
