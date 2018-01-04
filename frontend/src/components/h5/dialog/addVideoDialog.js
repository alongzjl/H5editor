import React from 'react';
import SkyLight from 'react-skylight';
import VideoModal from '../modal/VideoModal';
import Noty from '../../common/noty/noty';
import store from '../../../store';
import { addElements } from '../../../actions/h5Actions';
import './addVideoDialog.less';
import t from '../../i18n';
import disableScroll from './disableScroll';
import commonCss from '../commonCssNav';


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
            <div>
                <SkyLight
                    dialogStyles={{ ...commonCss.dialogStyles, paddingBottom: '40px' }}
                    titleStyle={commonCss.titleStyle}
                    closeButtonStyle={commonCss.closeButtonStyle}
                    hideOnOverlayClicked
                    ref={com => { this.videoModal = com; }}
                    title={t('video_add')}
                    {...disableScroll()}
                >
                    <div>
                        <p className="pTop">{t('video_tip')}             <a href="javascript:void(0)" onClick={() => { this.videoDangerModal.show(); }}>如何使用</a></p>
                        <input spellCheck="false" className="codeInpt" type="text" placeholder={t('video_code')} ref={input => this.input = input} />
                        <p className="Remarks">{t('video_support')}：
                            <a href="javascript:void(0)">{t('video_qq')}</a>、<a href="javascript:void(0)">{t('video_youtube')}</a>、<a href="javascript:void(0)">{t('video_youku')}</a>、<a href="javascript:void(0)">{t('video_tudou')}</a> ...
	                    </p>
                        <p className="positionP">
                            <button className="cancelVideo" onClick={this.cancelClick}>{t('cancel')}</button>
                            <button className="determineVideo" onClick={this.addVideo}>{t('confirm')}</button>
                        </p>
                    </div>
                </SkyLight>
                <VideoDanger ref={com => { this.videoDangerModal = com; }} />
            </div>
        );
    }
}

class VideoDanger extends React.Component {
    show() {
        this.videoModalDanger.show();
    }

    render() {
        return (
            <SkyLight
                dialogStyles={{ ...commonCss.dialogStyles, top: '10%', textAlign: 'center', background: '#ffffff' ,height:'80%'}}
                titleStyle={commonCss.titleStyle}
                closeButtonStyle={commonCss.closeButtonStyle}
                hideOnOverlayClicked
                ref={com => { this.videoModalDanger = com; }}
            >
            	<div style={{height:'90%',overflowY:'auto'}}><img src={require('./images/video_danger.png')} /></div>
            </SkyLight> 
        );
    }
}
