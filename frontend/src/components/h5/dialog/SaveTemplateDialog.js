import React from 'react';
import SkyLight from 'react-skylight';
import Page from '../elements/Page';
import noty from '../../common/noty/noty';
import store from '../../../store';
import { changeTemplate } from '../../../actions/h5Actions';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import t from '../../i18n';
import './saveTemplateDialog.less';
import disableScroll from './disableScroll';
import commonCss from '../commonCssNav';

export default class SaveTemplateDialog extends React.Component {
    state = {
        name: '',
    };
    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.templateName,
        });
    }
    show = () => {
        this.previewModal.show();
    };
    hide = () => {
        this.previewModal.hide();
    };
    saveTemplate = () => {
        if (!this.state.name) {
            noty.error(t('template_name_error'));
            return;
        }
        Fetch.postJSON(API_URL.template.save, { id: this.props.templateId, name: this.state.name, pages: JSON.stringify(this.props.pages), published: false, public: !!this.props.isPublic }).then(data => {
            noty.success(t('save_success'));
            store.dispatch(changeTemplate(data, this.state.name));
            this.hide();
        });
    };
    changeName = e => {
        this.setState({
            name: e.target.value,
        });
    };
    render() {
        return (
            <SkyLight
                dialogStyles={{ ...commonCss.dialogStyles, width: '720px' }}
                titleStyle={commonCss.titleStyle}
                closeButtonStyle={commonCss.closeButtonStyle}
                hideOnOverlayClicked
                ref={com => { this.previewModal = com; }}
                title=""
                {...disableScroll()}
            >
                <div className="saveTemplateDialog">
                    <div className="flex_row_between">
                        <div>
                            <div className="flex_row_start pages">
                                {
                                    this.props.pages.slice(0, 5).map(page => <div key={page.id}><div className="preview"><Page page={page} viewing /></div></div>)
                                }
                                {
                                    this.props.pages.length > 5 && <div><img src={require('./images/morepage.png')} /></div>
                                }
                            </div>
                            <div className="pageNum">{t('page_total')} {this.props.pages.length} {t('page_no2')}</div>
                        </div>
                        <div className="content">
                            <h4>{t('template_save')}</h4>
                            <div><input placeholder={t('template_name')} onChange={this.changeName} value={this.state.name} /></div>
                            <button onClick={this.saveTemplate}>{t('save')}</button>
                        </div>
                    </div>
                </div>
            </SkyLight>
        );
    }
}
