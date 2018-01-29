/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, hashHistory } from 'react-router';
import { ActionCreators } from 'redux-undo';
import Panel from './panel/Panel';
import Header from './header/Header';
import store from '../../store';
import PageContainer from './pageContainer/PageContainer';
import { initPage, changeCourse, changeTemplate, delElement } from '../../actions/h5Actions';
import PageModal from './modal/PageModal';
import Sidebar from './sidebar/Sidebar';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';
import PreviewDialog from './dialog/PreviewDialogAlong';
import SaveTemplateDialog from './dialog/SaveTemplateDialog';
import Auth from '../../common/Auth';
import t from '../i18n';
import './builder.less';

class Builder extends React.Component {

    componentDidMount = () => {
    	
        this.props.location.query.from !== 'wordoor_edit' ? new Auth().check() : null;
        if (this.props.location.query.templateId) {
            this.loadTemplate(this.props.location.query.templateId);
        } else if (this.props.location.query.material_id) {
            this.loadCourse(this.props.location.query.material_id);
        } else {
            this.addPage();
        }
        store.dispatch(ActionCreators.clearHistory());
        // this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    };

    load_style = pages => {
        let style_font = '';
        const courseFontFamily = pages;
        courseFontFamily.length !== 0 ? courseFontFamily.forEach(item => {
            item.elements.forEach(value => {
                value.fontFace ? style_font += value.fontFace.fontFace : null;
            });
        }) : null;
        const newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(style_font));
        document.head.appendChild(newStyle);
    };

    loadTemplate = templateId => {
        Fetch.get(`${API_URL.template.show}${templateId}`).then(data => {
            store.dispatch(changeTemplate(data.id, data.name, JSON.parse(data.pages)));
            this.load_style(JSON.parse(data.pages));
        });
    };

    loadCourse = courseId => {
        Fetch.get(`${API_URL.course.list}?materialId=${courseId}&page=1`).then(data => {
            data.content.length ? (store.dispatch(changeCourse(data.content[0].id, JSON.parse(data.content[0].pages))), this.load_style(JSON.parse(data.content[0].pages))) : this.addPage();
        });
    };

    addPage = () => {
        store.dispatch(initPage(new PageModal().plainObject()));
    };

   /* routerWillLeave = nextLocation => {
        if (!confirm(t('page_leave'))) {
            this.props.router.push('/builder');
            return false;
        }
    };  */

    publish = () => {
        const c_id = parseInt(this.props.location.query.material_id);
        const templateId = parseInt(this.props.location.query.templateId);
        const name = templateId ? this.props.location.query.name : `模板${new Date().getTime()}`;
        let published = 0;
        if (this.props.location.query.from == 'admin') {
            published = 1;
            Fetch.postJSON(API_URL.template.save, { id: templateId, name, pages: JSON.stringify(this.props.pages), isPublic:published }).then(data => {
                if (confirm('确定保存并返回模板列表页面!')) {
                    window.location.href = `${API_URL.domain}admin/index.html#/template`;
                    return false;
                }
            });
        } else if (this.props.location.query.from == 'wordoor_add') {
            Fetch.postJSON(API_URL.template.save, { id: templateId, name, pages: JSON.stringify(this.props.pages), isPublic:published }).then(data => {
                if (confirm('确定保存并返回模板列表页面!')) {
                    hashHistory.push('/template');
                    return false;
                }
            });
        } else if (this.props.location.query.from == 'wordoor_edit') {
            Fetch.postJSON(API_URL.course.save, { materialId: c_id, id: '', name: `课程${new Date().getTime()}`, templateId, pages: JSON.stringify(this.props.pages), isPublic:published }).then(data => {
                if (confirm('确定保存并返回课程页面')) {
                    window.location.href = `${API_URL.wordoor}indexEdit.html`; 
                    return false;
                }
            });
        } else {
            Fetch.postJSON(API_URL.template.save, { id: '', name, pages: JSON.stringify(this.props.pages), isPublic:published }).then(data => {
                if (confirm('确定保存并返回模板列表页面!')) {
                    hashHistory.push('/template');
                    return false;
                }
            });
        }
    };

    disableBackSpace = e => {
    	 var currKey=0,e=e||event; 
    	 currKey=e.keyCode||e.which||e.charCode;//支持IE、FF
        if (currKey === 8 &&
            !this.props.focus.contenteditable &&
            e.target.nodeName !== 'INPUT' &&
            e.target.nodeName !== 'TEXTAREA' 
        ) {
            store.dispatch(delElement());
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        if (currKey === 46) { // 按下删除
            store.dispatch(delElement());
        } 
        return true;
    };

    render() {
    	 return (
            <div onKeyDown={this.disableBackSpace} tabIndex="0" className="rootDiv">
                <Header
                    onPublish={this.publish}
                    onPreview={() => this.pageModal.show()}
                    onSaveTemplate={() => this.saveTemplateDialog.show()}
                    currentPage={this.props.pages[this.props.currentPage]}
                />
                <div className="builder">
                    <Sidebar pages={this.props.pages} currentPage={this.props.currentPage} />
                    <PageContainer pages={this.props.pages} focus={this.props.focus} currentPage={this.props.currentPage} selects={this.props.selects} />
                    <Panel focus={this.props.focus} currentPage={this.props.pages[this.props.currentPage]} pages={this.props.pages} token={this.props.location.query.access_token} />
                    <PreviewDialog ref={com => { this.pageModal = com; }} pages={this.props.pages} />
                    <SaveTemplateDialog
                        ref={com => { this.saveTemplateDialog = com; }}
                        pages={this.props.pages}
                        isPublic={this.props.location.query.isPublic}
                        templateId={this.props.templateId}
                        templateName={this.props.templateName}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        courseId: store.h5State.present.courseId,
        templateId: store.h5State.present.templateId,
        name: store.h5State.present.name,
        templateName: store.h5State.present.templateName,
        pages: store.h5State.present.pages,
        currentPage: store.h5State.present.currentPage,
        focus: store.h5State.present.focus,
        selects: store.h5State.present.selects,
    };
};

export default connect(mapStateToProps)(withRouter(Builder));

