/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import Draggable from 'react-draggable';
import H5ContextMenu from './H5ContextMenu';
import Page from '../elements/Page';
import './pageContainer.less';
import Sidebar from './Sidebar';
import AddImageDialog from '../dialog/addImageDialog';
import store from '../../../store';
import { alignElements, refreshAnimation } from '../../../actions/h5Actions';
import t from '../../i18n';

class PageContainer extends React.Component {
    showImage = () => {
        this.addImageModal.show();
    };
    refreshAnimation = () => {
        store.dispatch(refreshAnimation());
    };
    render() {
        const { currentPage, pages, focusId, selects } = this.props;
        return (
            <div className="pageContainer">
                <div className="phone">
                    <ContextMenuTrigger id="contextMenu" holdToDisplay={-1}>
                        <hr className="topLine" />
                        {
                            pages.map(
                                (page, index) => currentPage === index ? <Page key={page.id} page={page} focusId={focusId} showImage={this.showImage} selects={selects} /> : null,
                            )
                        }
                        <hr className="bottomLine" />
                    </ContextMenuTrigger>
                    <Sidebar />
                    <MultipleSelect selects={selects} />
                    <button onClick={this.refreshAnimation} className="refreshAnimation">预览页面</button>
                </div>
                <H5ContextMenu />
                <AddImageDialog ref={com => { this.addImageModal = com; }} focus={{ id: focusId }} />
            </div>
        );
    }
}

class MultipleSelect extends React.Component {
    alignCenter = () => {
        store.dispatch(alignElements('center'));
    };
    alignRight = () => {
        store.dispatch(alignElements('right'));
    };
    alignLeft = () => {
        store.dispatch(alignElements('left'));
    };
    alignTop = () => {
        store.dispatch(alignElements('top'));
    };
    alignMiddle = () => {
        store.dispatch(alignElements('middle'));
    };
    alignBottom = () => {
        store.dispatch(alignElements('bottom'));
    };
    alignHorizontal = () => {
        store.dispatch(alignElements('horizontal'));
    };
    alignVertical = () => {
        store.dispatch(alignElements('vertical'));
    };
    render() {
        if (this.props.selects.length === 0) {
            return null;
        }
        return (
            <Draggable>
                <div className="alignElement">
                    <h3>{t('align')}</h3>
                    <div className="flex_row_between">
                        <img src={require('./images/align_left.png')} alt="" onClick={this.alignLeft} />
                        <img src={require('./images/align_right.png')} alt="" onClick={this.alignRight} />
                        <img src={require('./images/align_center.png')} alt="" onClick={this.alignCenter} />
                        <img src={require('./images/align_top.png')} alt="" onClick={this.alignTop} />
                        <img src={require('./images/align_botton.png')} alt="" onClick={this.alignBottom} />
                        <img src={require('./images/align_middle.png')} alt="" onClick={this.alignMiddle} />
                        <img src={require('./images/align_horizontal.png')} alt="" onClick={this.alignHorizontal} />
                        <img src={require('./images/align_vertical.png')} alt="" onClick={this.alignVertical} />
                    </div>
                </div>
            </Draggable>
        );
    }
}

export default PageContainer;
