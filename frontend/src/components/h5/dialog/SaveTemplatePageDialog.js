import React from 'react';
import SkyLight from 'react-skylight';
import Page from '../elements/Page';
import noty from '../../common/noty/noty';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import t from '../../i18n';
import './saveTemplateDialog.less';
import './saveTemplatePageDialog.less';

export default class SaveTemplateDialog extends React.Component {
    state = {
        name: '',
    };
    show = () => {
        this.previewModal.show();
    };
    hide = () => {
        this.previewModal.hide();
    };
    saveTemplate = () => {
        if (!this.state.name) {
            noty.error(t('page_name_error'));
            return;
        }
        Fetch.postJSON(API_URL.template.save, { name: this.state.name, pages: JSON.stringify([this.props.page]), published: false }).then(() => {
            noty.success(t('save_success'));
            this.hide();
        });
    };
    changeName = e => {
        this.setState({
            name: e.target.value,
        });
    };
    render() {
        const previewDialog = {
            height: 'auto',
            minHeight: '480px',
            width: '720px',
            margin: '0 auto',
            boxShadow: '0 4px 10px 0 ',
            borderRadius: '6px',
            left: 0,
            right: 0,
            top: '100px',
        };
        return (
            <SkyLight
                dialogStyles={previewDialog}
                hideOnOverlayClicked
                ref={com => { this.previewModal = com; }}
                title=""
            >
                <div className="saveTemplateDialog saveTemplatePageDialog">
                    <div className="flex_row_between">
                        <div>
                            <div className="pages">
                                <div className="preview"><Page page={this.props.page} viewing /></div>
                            </div>
                            <div className="pageNum">{this.props.page.title}</div>
                        </div>
                        <div className="content">
                            <h4>{t('page_save_to_template')}</h4>
                            <div><input placeholder={t('page_name')} onChange={this.changeName} value={this.state.name} /></div>
                            <button onClick={this.saveTemplate}>{t('save')}</button>
                        </div>
                    </div>
                </div>
            </SkyLight>
        );
    }
}
