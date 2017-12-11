/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ActionCreators } from 'redux-undo';
import Panel from './panel/Panel';
import Header from './header/Header';
import store from '../../store';
import PageContainer from './pageContainer/PageContainer';
import { addPage, changeCourse, changeTemplate } from '../../actions/h5Actions';
import PageModal from './modal/PageModal';
import Sidebar from './sidebar/Sidebar';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';
import noty from '../common/noty/noty';
import PreviewDialog from './dialog/PreviewDialog';
import SaveTemplateDialog from './dialog/SaveTemplateDialog';
import Auth from '../../common/Auth';
import t from '../i18n';
import './builder.less';

class Builder extends React.Component {
    
    componentDidMount = () => {
    	new Auth().check();
        if (this.props.location.query.templateId) {
            this.loadTemplate(this.props.location.query.templateId);
        } else if (this.props.location.query.courseId) {
            this.loadCourse(this.props.location.query.courseId);
        } else {
            this.addPage();
        }
        store.dispatch(ActionCreators.clearHistory());
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    };

    loadTemplate = templateId => {
        Fetch.get(`${API_URL.template.show}${templateId}`).then(data => {
            store.dispatch(changeTemplate(data.id, data.name, JSON.parse(data.pages)));
        });
    };

    loadCourse = courseId => {
        Fetch.get(`${API_URL.course.show}${courseId}`).then(data => {
            store.dispatch(changeCourse(data.id, JSON.parse(data.pages), data.templateId));
        });
    };

    addPage = () => {
        store.dispatch(addPage(new PageModal().plainObject()));
    };

    routerWillLeave = nextLocation => {
        if (!confirm(t('page_leave'))) {
            this.props.router.push('/builder');
            return false;
        }
    };   

    publish = () => {
    	const c_id =  parseInt(this.props.location.query.material_id); 
    	const course_id = this.props.location.query.courseId ? parseInt(this.props.location.query.courseId) : '';
    	let published = false;
    	if(this.props.location.query.from == 'admin'){
    		let published = true;
    	}
    	Fetch.postJSON(API_URL.course.save, { materialId: c_id, id: course_id, name: `课程${new Date().getTime()}`, templateId: parseInt(this.props.location.query.templateId), pages: JSON.stringify(this.props.pages), published: published}).then(data => {
             if(this.props.location.query.from == 'wordoor'){ 
             	if (confirm('确定保存并返回课程页面')) {      
		            window.location.href = `${API_URL.wordoor}wordoorFront/indexEdit.html`;
		            return false;
		        } 
              }else if(this.props.location.query.from == 'admin'){
             	if (confirm('确定保存并返回模板列表页面!')) {
		            window.location.href = `${API_URL.domain}admin/index.html#/template`;  
		            return false;
		        }
             }else{ 
             	 this.props.router.push('/template');
             }
             
            //noty.success(t('publish_success'));
            //store.dispatch(changeCourse(data));
        });
    };

    disableBackSpace = e => {
        if (e.which === 8 && !this.props.focus.contenteditable && e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'TEXTAREA') {
            console.log('disabled backspace');
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        return true;
    };

    render() {
        return (
            <div onKeyDown={this.disableBackSpace} tabIndex="0">
                <Header
                    onPublish={this.publish}
                    onPreview={() => this.pageModal.show()}
                    onSaveTemplate={() => this.saveTemplateDialog.show()}
                />
                <div className="builder">
                    <Sidebar pages={this.props.pages} currentPage={this.props.currentPage} />
                    <PageContainer pages={this.props.pages} focusId={this.props.focus.id} currentPage={this.props.currentPage} selects={this.props.selects} />
                    <Panel focus={this.props.focus} currentPage={this.props.pages[this.props.currentPage]} token={this.props.location.query.token}/>
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

