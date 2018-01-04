import React from 'react';
import SkyLight from 'react-skylight';
import Cropper from 'react-cropper';
import ImageCompressor from '@xkeshi/image-compressor';
import 'cropperjs/dist/cropper.css';
import store from '../../../store';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import { changeImage, changePageStyle } from '../../../actions/h5Actions';
import './cropperDialog.less';
import t from '../../i18n';
import disableScroll from './disableScroll';
import commonCss from '../commonCssNav';


export default class CropperDialog extends React.Component {
    state = {
        ratio: '1/1',
    };
    show = () => {
        this.cropperModal.show();
    };
    handleOk = () => {
        this.cropper.getCroppedCanvas().toBlob(blob => {
            const _this = this;
            new ImageCompressor(blob, {
                quality: 0.6,
                success(result) {
                    const formData = new FormData();
                    formData.append('image', result);
                    Fetch.postFile(API_URL.image.crop, { body: formData }).then(imageSrc => {
                        if (_this.props.type === 'image') {
                            store.dispatch(changeImage(imageSrc));
                        } else if (_this.props.type === 'backImage') {
                            store.dispatch(changePageStyle({
                                backgroundImage: `url(${API_URL.upload + imageSrc})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '100%',
                            }));
                        }
                        _this.handleCancel();
                    });
                },
                error(e) {
                    console.log(e.message);
                },
            });
        });
    };
    handleCancel = () => {
        this.cropperModal.hide();
    };
    render() {
        let image = this.props.focus.src;
        if (this.props.type === 'backImage') {
            image = this.props.focus.style.backgroundImage ? this.props.focus.style.backgroundImage.substring(4, this.props.focus.style.backgroundImage.length - 1) : '';
        } else {
            image = API_URL.upload + image;
        }
        return (
            <div className="cropDialog">
                <SkyLight
                    hideOnOverlayClicked
                    dialogStyles={commonCss.dialogStyles}
                    titleStyle={commonCss.titleStyle}
                    closeButtonStyle={commonCss.closeButtonStyle}
                    ref={com => { this.cropperModal = com; }}
                    title={t('image_clip')}
                    {...disableScroll()}
                >
                    <div>
                        {
                            image ? <Cropper
                                ref={com => this.cropper = com}
                                src={image}
                                style={{ height: 380,marginTop:20 }}
                                guides={false}
                            /> : null
                        }
                    </div>
                    <div className="cropFooter">
                        <button onClick={this.handleOk}>{t('confirm')}</button>
                    </div>
                </SkyLight>
            </div>
        );
    }
}
