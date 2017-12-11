import React from 'react';
import SkyLight from 'react-skylight';
import VideoModal from '../modal/VideoModal';
import Noty from '../../common/noty/noty';
import store from '../../../store';
import { addElements } from '../../../actions/h5Actions';
import './addVideoDialog.less';
import t from '../../i18n';

export default class AddVideoDialog extends React.Component {
    show() {
        this.videoModal.show();
    }
    addVideo = () => {
        if (!this.input.value || this.input.value.trim().indexOf('<iframe') !== 0) {
            Noty.error(t('video_url_error'));
            return;
        }
        store.dispatch(addElements(new VideoModal(this.input.value.trim()).plainObject()));
        this.videoModal.hide();
    };
    cancelClick = () => {
        this.videoModal.hide();
    };

    render() {
        return (
            <SkyLight hideOnOverlayClicked ref={com => { this.videoModal = com; }} title={t('video_add')}>
                <div>
                    <p className="pTop">{t('video_tip')}</p>
                    <input spellCheck="false" className="codeInpt" type="text" placeholder={t('video_code')} ref={input => this.input = input} />
                    <p className="Remarks">{t('video_support')}：
                        <a href="javascript:void(0)">QQ</a>、<a href="javascript:void(0)">Youtube</a>
                    </p>
                    <p className="positionP">
                        <button className="cancelVideo" onClick={this.cancelClick}>{t('cancel')}</button>
                        <button className="determineVideo" onClick={this.addVideo}>{t('confirm')}</button>
                    </p>
                </div>
            </SkyLight>
        );
    }
}
