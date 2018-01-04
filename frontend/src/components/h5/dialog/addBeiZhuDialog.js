import React from 'react';
import { SkyLightStateless } from 'react-skylight';
import { connect } from 'react-redux';
import store from '../../../store';
import { addElements, changeNote } from '../../../actions/h5Actions';
import { hideNoteModal } from '../../../actions/uiActions';
import NoteModal from '../modal/NoteModal';
import noty from '../../common/noty/noty';
import './addBeiZhuDialog.less';
import t from '../../i18n';
import disableScroll from './disableScroll';
import commonCss from '../commonCssNav';

class AddBeiZhuDialog extends React.Component {
    constructor(props) {
        super();
        this.state = {
            note: props.focus.name === 'NoteModal' ? this.props.focus : { text: '' },
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            note: nextProps.focus&&nextProps.focus.name === 'NoteModal' ? nextProps.focus : { text: '' },
        });
    }
    hide = () => {
        store.dispatch(hideNoteModal(true));
    };
    change = e => {
        if (e.target.value.length > 300) {
            noty.error(t('note_length_larger_than_300'));
            return;
        }
        this.setState({
            note: Object.assign({}, this.state.note, { text: e.target.value }),
        });
    };
    save = () => {
        if (this.state.note.id) {
            store.dispatch(changeNote(this.state.note));
        } else {
            store.dispatch(addElements(new NoteModal(this.state.note.text).plainObject()));
        }
        this.hide();
    };
    render() {
        const note = this.state.note;
        return (
            <SkyLightStateless
                dialogStyles={{ ...commonCss.dialogStyles, paddingBottom: '40px' }}
                titleStyle={commonCss.titleStyle}
                closeButtonStyle={commonCss.closeButtonStyle}
                onCloseClicked={this.hide}
                onOverlayClicked={this.hide}
                isVisible={!this.props.hidden}
                title={t('note_title')}
                {...disableScroll()}
            >
                <textarea className="bei_zhu" placeholder={t('note_placeholder')} onChange={this.change} value={note.text} />
                <p className="last_beiZhu">{note.text.length}/300</p>
                <ul className="audioBtn beiZhu_btn">
                    <li onClick={this.save}>{t('confirm')}</li>
                </ul>
            </SkyLightStateless>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        focus: store.h5State.present.focus,
        hidden: store.uiState.noteModalHidden,
    };
};

export default connect(mapStateToProps)(AddBeiZhuDialog);
