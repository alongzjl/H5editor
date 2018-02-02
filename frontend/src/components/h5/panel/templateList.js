import React from 'react';
import Noty from 'noty';
import 'noty/lib/noty.css';
import store from '../../../store';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import Page from '../elements/Page';
import { replacePage } from '../../../actions/h5Actions';
import t from '../../i18n';

/**
 * @param index
 * @param template 可能是模板，也可能是模板页，要看当前是不是显示更多
 * @param onShowMore
 * @returns {XML}
 * @constructor
 */
function TemplatePage({ index, template, onShowMore }) {
    let pages = [];
    try {
        pages = template.pages ? JSON.parse(template.pages) : [template];
    } catch (e) {
        console.log(template);
    }
    const showNote = () => {
        if (pages.length === 1) {
            const n = new Noty({
                text: t('page_override'),
                layout: 'center',
                type: 'alert',
                modal: true,
                buttons: [
                    Noty.button(t('confirm'), 'noty-confirm', () => {
                        store.dispatch(replacePage(pages[0]));
                        n.close();
                    }),

                    Noty.button(t('cancel'), 'noty-cancel', () => {
                        n.close();
                    }),
                ],
            }).show();
        } else { // 显示更多模板页
            onShowMore(pages);
        }
    };
    return (
        <div className={`templatePage ${index % 3 === 0 ? 'rowStart' : ''}`}>
            <div className="preview" onClick={showNote}>
            	<div className="prewView"></div>
                <Page page={pages[0]} viewing />
            </div>
        </div>
    );
}

class TemplateList extends React.Component {
    state = {
        templates: [],
        total: 1,
        page: 1,
        showMore: false,
    };
    componentDidMount() {
    	this.props.token ? sessionStorage.setItem('access_token', this.props.token) : null ;
        this.loadData();
    }  
    loadData = () => {
        Fetch.get(`${API_URL.template.list}?page=${this.state.page}&pageSize=999&isPublic=${this.props.isPublic}`).then(data => {
            this.setState({
                templates: data.content,
                total: data.totalElements,
                showMore: false,
            });
        });
    };
    changePage = page => {
        this.setState({
            page,
        }, this.loadData);
    };
    showMore = pages => {
        this.setState({
            templates: pages,
            showMore: true,
        });
    };
    back = () => {
        this.loadData();
    };
    render() {
        return (
            <div className="templateList">
                <div className="flex_row_start">
                    {
                        this.state.templates.map((template, index) => <TemplatePage key={template.id} index={index} template={template} onShowMore={this.showMore} />)
                    }
                </div>
                {
                    this.state.showMore && <button onClick={this.back} className="back">{t('back')}</button>
                }
            </div>
        );
    }
}
export default TemplateList;
