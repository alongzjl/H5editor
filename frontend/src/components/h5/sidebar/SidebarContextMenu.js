/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { addPage, changePageEditable, delPage, copyPage } from '../../../actions/h5Actions';
import store from '../../../store';
import t from '../../i18n';
import PageModal from '../modal/PageModal';
import SaveTemplatePageDialog from '../dialog/SaveTemplatePageDialog';
import Noty from '../../common/noty/noty';
import './sidebarContextMenu.less';

export default class SidebarContextMenu extends React.Component {
    state = {
        page: null,
    };

    onNew = () => {
        store.dispatch(addPage(new PageModal().plainObject()));
    };

    onCopy = () => {
        store.dispatch(copyPage(this.state.page.id));
    };

    onDel = () => {
        if (this.props.pages.length === 1) {
            Noty.error(t('page_size_must_larger_than_1'));
        } else {
            store.dispatch(delPage(this.state.page.id));
        }
    };

    onSave2Template = () => {
        this.dialog.show();
    };

    onShow = e => {
        this.setState({
            page: e.detail.data,
        });
    };

    onRename = () => {
        store.dispatch(changePageEditable(this.state.page.id));
    };

    render() {
        return (
            <div>
                <ContextMenu id="sidebarContextMenu" onShow={this.onShow}>
                    <MenuItem onClick={this.onNew}>{t('page_new')}</MenuItem>
                    <MenuItem onClick={this.onCopy}>{t('page_copy')}</MenuItem>
                    <MenuItem onClick={this.onRename}>{t('page_rename')}</MenuItem>
                    <MenuItem onClick={this.onSave2Template}>{t('page_save_to_template')}</MenuItem>
                    <MenuItem onClick={this.onDel}>{t('delete')}</MenuItem>
                </ContextMenu>
                {
                    this.state.page && <SaveTemplatePageDialog page={this.state.page} ref={com => this.dialog = com} />
                }
            </div>
        );
    }
}
