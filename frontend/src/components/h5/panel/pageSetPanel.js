import React from 'react';
import 'rc-slider/assets/index.css';
import CropperDialog from '../dialog/cropperDialog';
import AddImageDialog from '../dialog/addImageDialog';
import './pageSetPanel.less';
import t from '../../i18n';

export default class PageSetPanel extends React.Component {
    showCropper = () => {
        this.cropperModal.show();
    };
    showAddImage = () => {
        this.addImageModal.show();
    };
    render() {
        const hasBack = this.props.focus.style.backgroundImage !== undefined;
        return (
            <div className="pagesetPanel flex_row_around">
                {
                    hasBack ? <button onClick={this.showCropper}>{t('image_clip')}</button> : null
                }
                <button onClick={this.showAddImage}>{hasBack ? t('background_change') : t('background_add')}</button>
                <CropperDialog ref={com => { this.cropperModal = com; }} type="backImage" focus={this.props.focus} />
                <AddImageDialog ref={com => { this.addImageModal = com; }} focus={this.props.focus} type="backImage" />
            </div>
        );
    }
}
