import React from 'react';
import moment from 'moment';
import './template.less';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';
import Page from '../h5/elements/Page';
import t from '../i18n';
import Auth from '../../common/Auth';
import Pagination from 'rc-pagination';

export default class Template extends React.Component {
    state = {
        keyword: '',
        page: 1,
       	myTemplates: [], //
        hotSearches: [],
        hotTemplates: [],
        searchList: [],// 依据关键词搜索的列表
        fromWh:'',
        materialId:'',
        templateId:'',
        style:{},
        moreTemplates:false
    };
    constructor() {
        super();
        new Auth().check();
    } 
    componentDidMount() {
    	new Auth().check() ? this.setState({fromWh:'wordoor_edit',materialId:new Auth().check()},()=>{
    		this.loadData()
    	}) : this.loadData();
    	 Fetch.get(`${API_URL.template.listSearch}`).then(data => {
            this.setState({
                hotSearches: data,
            });
        });
    }
    loadData = () => {
    	
    	//获取我的模板列表
        Fetch.get(`${API_URL.template.list}?page=${this.state.page}&isPublic=0&pageSize=7&name=${this.state.keyword}`).then(data => {
        	this.setState({
                myTemplates: data.content,
                myTotal: data.totalElements,
                showMore: false,
            });
        }); 
        //获取公共模板
        Fetch.get(`${API_URL.template.list}?page=1&isPublic=1&sortName=use_count&pageSize=8&name=${this.state.keyword}`).then(data => {
        	 this.setState({
                hotTemplates: data.content,
                hotTotal:data.totalElements
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
    selectTemp = template => { // 使用模版
    	let template_id = '';
        template ? (this.saveRecent(template),template_id=template.id) : template_id = '';
        location.href = `#/builder?templateId=${template_id}&from=${this.state.fromWh}&material_id=${this.state.materialId}`;   
    };  
   saveRecent = template => {
   		let templates = localStorage.getItem('templates');
        templates = templates ? JSON.parse(templates) : [];
        templates = templates.filter(item => item.template.id !== template.id);// 删除已经存在的
        const pages = JSON.parse(template.pages); 
        const toSave = { template: { ...template, pages: pages.length > 0 ? JSON.stringify(pages[0]) : "{}" }, date: new Date().getTime() };
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
    show_more_tem = (res) => {
    	this.setState({
    		moreTemplates:res
    	},()=>{
    		let width = 0,left = 900;
	    	let my_set = setInterval(()=>{
	    		width+=10;
	    		left-=10;
	    		this.setState({style:{width:width+'px',left:left+'px'}});
	    		left == 0 ? clearInterval(my_set) : null;
	    	},0.01)
	    })
    }
     back_tem = () => {
     	let width = 0,left = 900;
    	let my_set = setInterval(()=>{
    		width+=10;
    		left-=10;
    		this.setState({style:{width:left+'px',left:width+'px'}});
    		left == 0 ? (clearInterval(my_set),this.setState({moreTemplates:false})) : null;
    	},0.01)
    }
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
                	{
                		this.state.moreTemplates ? <ManagerTemplate style={this.state.style} back_tem={()=>{this.back_tem()}} my_or_common={this.state.moreTemplates} onDel={()=>{this.loadData()}} /> :null 
                	}
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
                                    this.state.hotSearches.map(item => <button key={item.id} className="tem_hot" onClick={() => this.changeKeyword(item.name)} >{item.name}</button>)
                                }
                                </div> :
                                <div className="flex_row_start flex_vertical_middle fs14">
                                    {
                                        <KeywordItem content={this.state.keyword} onCancel={this.cancelSearch} />
                                }
                                </div>
                        }
                        <div className="blank"></div>
                        <div className="tempName">{t('template_mine')}<span onClick={()=>this.show_more_tem('my')}>更多 ></span></div>
                        <div className="flex_row_start"> 
                        	<div className="tempShowItem fs12">
					            <div className="preview"><Shadow onSelect_2={()=>this.selectTemp('')}/></div>
					            <p>空白模板</p>
					        </div>
                        	{
                                this.state.myTemplates.length !== 0 ? this.state.myTemplates.map(item => <TempShowItem key={`my${item.id}`} my_or_common={`my`} name={item.name} pages={item} onDel={()=>{this.loadData()}} onSelect={() => this.selectTemp(item)} />) : null
                        	}
                        </div>
                        <div className="tempName" style={{marginTop:'60px'}}>{t('template_hot')}<span onClick={()=>this.show_more_tem('common')}>更多 ></span></div>
                        <div className="flex_row_start">
                            {
                                this.state.hotTemplates.length !==0 ? this.state.hotTemplates.map(item => <TempShowItem key={`my${item.id}`} name={item.name} pages={item} my_or_common={`common`} onSelect={() => this.selectTemp(item)} />) :
                                '没有查到相关模板!'
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
class ManagerTemplate extends React.Component {
	state = {
		keyword:'',
		page:1,
		total:0,
		moreTemplate:[]
	};
	 componentDidMount() {
	 	this.loadData();
	 };
	loadData = () => {
		this.props.my_or_common=='my' ? (
			Fetch.get(`${API_URL.template.list}?page=${this.state.page}&isPublic=false&pageSize=14&name=${this.state.keyword}`).then(data => {
	        	this.setState({
	                moreTemplate: data.content,
	                total: data.totalElements
	            });
	       })) : (
	       	Fetch.get(`${API_URL.template.list}?page=1&isPublic=true&sortName=use_count&pageSize=14&name=${this.state.keyword}`).then(data => {
	        	 this.setState({
	                moreTemplate: data.content,
	                total: data.totalElements
	            }); 
	        }))
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
    changePage = page => {
        this.setState({
            page,
        }, this.loadData());
    };
   
	render (){
		return (
			<div className="man_template" style={this.props.style}>
				<div className="back" onClick={this.props.back_tem}>{this.props.my_or_common=='my'?'我的模板':'热门模板'}</div>
				<div className=" searchItem flex_row_start flex_vertical_middle">
                    <input
                        placeholder={t('template_search_placeholder')}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.getKeyword}
                    />
                    <button onClick={this.handleSearch}>
                        <img alt="" src={require('./images/temp-search.png')} className="cursor-pointer" />
                    </button>
                </div>
                <div className="flex_row_start">
                    {
                    	this.props.my_or_common=='my' ? this.state.moreTemplate.map(item => <TempShowItem my_or_common={this.props.my_or_common} key={`${item.id}`} name={item.name} pages={item} onDel={()=>{this.loadData(),this.props.onDel()}} onSelect={() => this.selectTemp(item)} />) :
                    	this.state.moreTemplate.map(item => <TempShowItem my_or_common={this.props.my_or_common} key={`${item.id}`} name={item.name} pages={item} onSelect={() => this.selectTemp(item)} />)
                    }
                </div>
                {
                	this.state.moreTemplate.length >14 ? <Pagination onChange={this.changePage} total={this.state.total} pageSize={14} simple current={this.state.page} /> :null
                }
                
			</div>
		)
	}
}
const Shadow = ({onSelect_2, my_or_common, name, templateId, onDel}) => {
	const edit = () => {
		 location.href = `#/builder?templateId=${templateId}&from=wordoor_add&name=${name}`;
	}
	const delete_tem = () => {
		if (confirm('确定要删除吗?')) {
			 Fetch.del(API_URL.template.del + templateId).then(() => {
            	onDel();
            });
        }
	}
	return (
		<div className="shadow">
			<h1 onClick={onSelect_2}>使用模板</h1>
			{
				my_or_common == 'my' ? <div className="setTem"> 
						<div>
							<h1 onClick={edit}>编辑</h1>
							<h1 onClick={delete_tem}>删除</h1>
						</div>
					</div> :null
			}
			
		</div>
	)
};

const RecentTempItem = ({ content, onSelect }) => {
	const pageObj = JSON.parse(content.template.pages);
	return (
        <div className="tempItem" onClick={onSelect}>
            <div className="content">
                <div className="preview"><Page page={pageObj} viewing /></div>
                <div className="nameAndTime whiteColor">
                    <p className="fs18">{content.template.name}</p>
                    <p className="fs12">{moment(content.date).format('YYYY年MM月DD日')}{t('template_used')}</p>
                </div>
            </div>
        </div>
    );
};

const TempShowItem = ({ name, pages, onSelect, my_or_common, onDel }) => {
	 const pageArr = JSON.parse(pages.pages);
    return (
        <div className="tempShowItem fs12">
            <div className="preview"><Page page={pageArr[0]} viewing />
            {
            	my_or_common == 'my' ? <Shadow onSelect_2={onSelect} onDel={onDel} my_or_common={my_or_common} name={name} templateId={pages.id} /> :
            	<Shadow onSelect_2={onSelect} my_or_common={my_or_common} name={name} templateId={pages.id} />
            }
          	
            </div>
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

