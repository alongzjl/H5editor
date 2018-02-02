/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Swiper from 'swiper';
import { connect } from 'react-redux';
import 'swiper/dist/css/swiper.css';
import store from '../../store';
import { changeCourse, refreshAnimation,changeCurrentPage } from '../../actions/h5Actions';
import Page from './elements/Page';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';
import './viewer.less';
window.socket = require('socket.io-client')(API_URL.socket);

  function log (msg) {
    console.log(msg);
}
 function init_socket(reg_info) {
  		// 响应注册流程
		socket.on('reg', function(data) {
		    try {
		        var msg = JSON.parse(data);
		        switch (msg.msg) {
		            case 'unreg'     :  socket.emit('reg', JSON.stringify(reg_info)); break;
		            case 'connected' : log('connected'); break;
		            default : log(data); break;
		        }
			 } catch (error) {
		        log(error+"APP注册请求的JSON格式不正确");
		        return
		    }
		});
		// 响应断线逻辑 && 重连逻辑
		socket.on('disconnect',        function() { log('服务器断开连接');});
		socket.on('connect_error',     function() { log(' 连接错误!');});
		socket.on('reconnect_attempt', function() { log(' 开始重连');});
		socket.on('connect_stu_suc', function(data) { log(' 学生连接成功');});
		socket.on('wait', function() { alert("有学生连接到老师了，请稍等")});
		socket.on('reconnect_failed',  function() {
		    socket.close();
		     log(' 重连失败');
		});
}
function getQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    
}

class Viewer extends React.Component {
    constructor() {
        super();
        this.connect();
    }
    state = {
        pages: [],
        key:getQueryString('key'),
        m_key:getQueryString('m_key'),
        type:getQueryString('type'),
        student_id:getQueryString('student_id'),
        teacher_id: getQueryString('teacher_id')
    };
    componentDidMount = () => {
    	 this.loadData(this.load_style); 
    };  
	load_style = (pages)=>{
		const courseFontFamily = pages;
    	let style_font = '';
		courseFontFamily.length !== 0 ? courseFontFamily.forEach(item=>{
			item.elements.forEach(value=>{
				value.fontFace ? style_font += value.fontFace.fontFace : null
			})
		}) : null; 
		const newStyle = document.createElement('style');
		newStyle.appendChild(document.createTextNode(style_font));
		document.head.appendChild(newStyle);
	}
    connect = () => {
    	var that = this;
    	if(this.state.teacher_id){
    		init_socket({'key':this.state.m_key,'m_key':this.state.key,'is_teacher':1});
    	}else if(this.state.student_id){
    		init_socket({'key':this.state.key,'m_key':this.state.m_key,'is_teacher':0,'student_id':this.state.student_id});
    	}
    	socket.on('control', function(data) { 
    		const message = JSON.parse(data);
    		message.name === 'page' && that.state.m_key == message.id ? that.swiper.slideTo(message.page_num) : null;
    	});
    };

     loadData = (fn) => {
        const id = this.state.key;
        if (!id) {
            const pages = window.pages;
            store.dispatch(changeCourse(0, pages));
            this.initSwiper();
        } else {
            Fetch.get(`${API_URL.course.show}${id}`).then(course => {
                const pages = JSON.parse(course.pages);
                store.dispatch(changeCourse(course.id, pages));
                this.initSwiper();
                fn(pages);
            });
        }
    };
    initSwiper = () => {
    	this.swiper = new Swiper('.swiper-container', {
            loop: false,
           // effect: 'coverflow', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
            resistanceRatio : 0.5,
             mousewheel: true,
             watchSlidesProgress : true,
            on:{
            	 slideChangeTransitionEnd: function(){
					 refreshAn(this.activeIndex); 
				}
			 }
         });
        const id = this.state.m_key;
        if (this.state.teacher_id) {
        	 this.swiper.on('slideChange', () => {
        	 	 socket.emit('control', JSON.stringify({name:'page',page_num:this.swiper.activeIndex,id:id}));
        	 })
        }
    };
    
    render() {
    	 return (
        	<div style={{height:'100%'}}>
        		{
        			this.state.type === 'pc' ? <div className="phone">
			            <div className="swiper-container">
			                <div className="swiper-wrapper">
			                    {
			                        this.props.pages.map((page, index) => <div className="swiper-slide" key={page.id}><Page page={page} mKey={this.state.m_key} isTeacher={this.state.teacher_id ? true:false} /></div>)
			                    }
			                </div> 
			            </div>
		            </div> : <div className="swiper-container">
			                <div className="swiper-wrapper">
			                    {
			                        this.props.pages.map((page, index) => <div className="swiper-slide" key={page.id}><Page page={page} mKey={this.state.m_key} isTeacher={this.state.teacher_id ? true:false} /></div>)
			                    } 
			                </div> 
			            </div>
        		}
        	</div>
        	
        );
    }
}
const mapStateToProps = function (store) {
    return {
        pages: store.h5State.present.pages,
    };
};
const refreshAn = activeIndex => { 
    store.dispatch(refreshAnimation());
     store.dispatch(changeCurrentPage(activeIndex));
};
    
export default connect(mapStateToProps)(Viewer);
