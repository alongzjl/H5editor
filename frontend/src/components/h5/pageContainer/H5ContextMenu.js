/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { ContextMenu, MenuItem, SubMenu } from 'react-contextmenu';
import { copyElement, delElement, moveUpElement, moveDownElement, moveUpMostElement, moveDownMostElement } from '../../../actions/h5Actions';
import store from '../../../store';
import './pageContainer.less';
import './menu.less';
import t from '../../i18n';

class H5ContextMenu extends React.Component {
    onCopy = () => {
        store.dispatch(copyElement());
    };

    onDel = () => {
        store.dispatch(delElement());
    };

    onUp = () => {
        store.dispatch(moveUpElement());
    };

    onUpMost = () => {
        store.dispatch(moveUpMostElement());
    };

    onDown = () => {
        store.dispatch(moveDownElement());
    };

    onDownMost = () => {
        store.dispatch(moveDownMostElement());
    };
    render() {
        return (
            <ContextMenu id="contextMenu" onShow={this.onShow}>
                <MenuItem onClick={this.onCopy}>{t('copy')}</MenuItem>
                <MenuItem onClick={this.onDel}>{t('delete')}</MenuItem>
                <SubMenu title={t('element_zindex')}>
                    <MenuItem>
                        <div className="flex_row_between flex_vertical_middle">
                            <img onClick={this.onUp} src={require('./images/move up.png')} />
                            <img onClick={this.onDown} src={require('./images/move down.png')} />
                            <img onClick={this.onUpMost} src={require('./images/top.png')} />
                            <img onClick={this.onDownMost} src={require('./images/bottom.png')} />
                        </div>
                    </MenuItem>
                </SubMenu>
            </ContextMenu>
        );
    }
}

export default H5ContextMenu;
