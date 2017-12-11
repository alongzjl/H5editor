import React from 'react';
import moment from 'moment';
import './template.less';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';
import Page from '../h5/elements/Page';
import t from '../i18n';
import Auth from '../../common/Auth';

export default class Template extends React.Component {
    state = {
        keyword: '',
        page: 1,
        myCourse:[],
        myTemplates: [], //
        hotSearches: [],
        hotTemplates: [],
        searchList: [],// 依据关键词搜索的列表
        fromWh:'',
        materialId:'',
        templateId:''
    };
    constructor() {
        super();
        new Auth().check();
    } 
    componentDidMount() {
    	new Auth().check() ? this.setState({fromWh:'wordoor',materialId:new Auth().check()},()=>{
    		this.loadData()
    	}) : this.loadData();
    }
    loadData = () => {
    	console.log(this.state);
    	//获取我的模板列表
        Fetch.get(`${API_URL.template.list}?page=${this.state.page}&isPublic=false&pageSize=7&name=${this.state.keyword}`).then(data => {
        	this.setState({
                myTemplates: data.content,
                total: data.totalElements,
                showMore: false,
            });
        }); 
        //获当前课程
         Fetch.get(`${API_URL.course.list}?page=1&materialId=${this.state.materialId}`).then(data => {
        	this.setState({
                myCourse: data.content,
            });
        });
        //获取公共模板
        Fetch.get(`${API_URL.template.list}?page=1&isPublic=true&sortName=use_count&pageSize=14&name=${this.state.keyword}`).then(data => {
        	 this.setState({
                hotTemplates: data.content,
            }); 
        });
        Fetch.get(`${API_URL.template.listSearch}`).then(data => {
            this.setState({
                hotSearches: data,
            });
        });
    };
    getKeyword = e => {
        this.setState({
            keyword: e.target.value,
        });
    };
    handleKeyDown = e => {
        if (e.keyCode === 13) {
            this.loadData();
        }
    };
    handleSearch = () => {
        this.loadData();
    };
    cancelSearch = () => {
        this.setState({
            keyword: '',
        }, this.loadData);
    };
    selectTemp = template => { // 选择模版
    	let template_id = '';
        template ? (this.saveRecent(template),template_id=template.id) : templateId = '';
        location.href = `#/builder?templateId=${template_id}&from=${this.state.fromWh}&material_id=${this.state.materialId}`;   
    };  
    selectCourse = course => { 
    	let course_id = '';
    	 course ? course_id=course.id : null;
        location.href = `#/builder?courseId=${course_id}&from=${this.state.fromWh}&material_id=${this.state.materialId}`;
    } 
    saveRecent = template => {
    	let templates = localStorage.getItem('templates');
        templates = templates ? JSON.parse(templates) : [];
        templates = templates.filter(item => item.template.id !== template.id);// 删除已经存在的
        const pages = JSON.parse(template.pages); 
        const toSave = { template: { ...template, pages: pages.length > 0 ? JSON.stringify(pages[0]) : "[]" }, date: new Date().getTime() };
        templates.unshift(toSave);
        if (templates.length > 10) {
            templates.shift();
        }
        localStorage.setItem('templates', JSON.stringify(templates));
    };
    changeKeyword = name => {
        this.setState({
            keyword: name,
        }, this.loadData);
    };
    getRecentTemplates = () => localStorage.getItem('templates') ? JSON.parse(localStorage.getItem('templates')) : [];
    render() {
        return (
            <div className="templateBody flex_row_start">
                <div className="left">
                    <img className="logo" alt="" src={require('./images/logo-o.png')} />
                    <p className="title">{t('template_used_recently')}</p>
                    <div className="left_container">
                    	{
	                      this.getRecentTemplates().map(item => <RecentTempItem key={item.template.id} content={item} onSelect={() => this.selectTemp(item.template)} />)
	                  	}
                    </div>
                    
                </div>
                <div className="right">
                    <div className="part">
                        <div className="searchItem flex_row_start flex_vertical_middle">
                            <input
                                placeholder={t('template_search_placeholder')}
                                onKeyDown={this.handleKeyDown}
                                onChange={this.getKeyword}
                                value={this.state.keyword}
                            />
                            <button onClick={this.handleSearch}>
                                <img alt="" src={require('./images/temp-search.png')} className="cursor-pointer" />
                            </button>
                        </div>
                        {
                            this.state.keyword.trim() === '' ?
                                <div className="flex_row_start flex_vertical_middle fs14">
                                    <div className="tempName">{t('template_hot_search')}：</div>
                                    {
                                    this.state.hotSearches.map(item => <button key={item.id} className="tempName" onClick={() => this.changeKeyword(item.name)} >{item.name}</button>)
                                }
                                </div> :
                                <div className="flex_row_start flex_vertical_middle fs14">
                                    {
                                        <KeywordItem content={this.state.keyword} onCancel={this.cancelSearch} />
                                }
                                </div>
                        }
                        <div className="blank"></div>
                        <div className="course_template_my">
                        	<div>
                        		<div className="tempName">新建课程</div>
	                        	<div className="tempShowItem fs12" onClick={() => this.selectCourse('')}>
						            <div className="preview">
						            	<h1>+</h1>
						            </div>
						        </div>
                        	</div>
                        	{
                        		this.state.materialId ? <div>
	                        		<div className="tempName">当前课程</div>
			                        <div className="flex_row_start">
			                            {
			                                this.state.myCourse.length !== 0 ? this.state.myCourse.map(item => <TempShowItem key={`my${item.id}`} name={item.name} pages={item.pages} onSelect={() => this.selectCourse(item)} />) : 
			                                <div className="tempShowItem fs12">
									            <div className="preview">
									            	<h1>空</h1>
									            </div> 
									        </div> 
			                            }
			                        </div>
	                        	</div> : null
                        	}
                        	<div>
                        		<div className="tempName">{t('template_mine')}</div>
		                        <div className="flex_row_start">
		                            {
		                                this.state.myTemplates.length !== 0 ? this.state.myTemplates.map(item => <TempShowItem key={`my${item.id}`} name={item.name} pages={item.pages} onSelect={() => this.selectTemp(item)} />) : 
		                                <div className="tempShowItem fs12">
								            <div className="preview">
								            	<h1>空</h1>
								            </div> 
								        </div> 
		                            }
		                        </div>
                        	</div>
                        </div>
                        <div className="tempName">{t('template_hot')}</div>
                        <div className="flex_row_start">
                            {
                                this.state.hotTemplates.map(item => <TempShowItem key={`my${item.id}`} name={item.name} pages={item.pages} onSelect={() => this.selectTemp(item)} />)
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const RecentTempItem = ({ content, onSelect }) => {
	const pageArr = JSON.parse(content.template.pages);
    return (
        <div className="tempItem" onClick={onSelect}>
            <div className="content">
                <div className="preview"><Page page={pageArr[0]} viewing /></div>
                <div className="nameAndTime whiteColor">
                    <p className="fs18">{content.template.name}</p>
                    <p className="fs12">{moment(content.date).format('YYYY年MM月DD日')}{t('template_used')}</p>
                </div>
            </div>
        </div>
    );
};

const TempShowItem = ({ name, pages, onSelect }) => {
    const pageArr = JSON.parse(pages);
    return (
        <div className="tempShowItem fs12" onClick={onSelect}>
            <div className="preview"><Page page={pageArr[0]} viewing /></div>
            <p>{name}</p>
        </div>
    );
};

const KeywordItem = ({ content, onCancel }) => (
    <div className="keywordItem flex_row_between flex_vertical_middle fs12">
        {content}
        <button onClick={onCancel}>
            <img alt="" src={require('./images/temp-close.png')} />
        </button>
    </div>
);

