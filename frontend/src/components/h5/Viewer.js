/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Swiper from 'swiper';
import { connect } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import 'swiper/dist/css/swiper.css';
import store from '../../store';
import { changeCourse, refreshAnimation,changeCurrentPage } from '../../actions/h5Actions';
import Page from './elements/Page';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';

import './viewer.less';

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
        teacher_id: getQueryString('teacher_id'),
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
        const baseDomain = API_URL.domain.substring(0, API_URL.domain.indexOf('/', 8));
        const socket = new SockJS(`${baseDomain}/ws`);
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, frame => {
            console.log(`Connected: ${frame}`);
            const type = this.state.teacher_id ? 'c' : 'b';
            if (type === 'b') {
                this.stompClient.subscribe('/topic/flip', data => {
                    const id = this.state.m_key;
                    const message = JSON.parse(data.body);
                    if (message.data && id == message.data.id) {
                        this.swiper.slideTo(message.data.page);
                    }
                });
            }
        },error => {
        	alert(error.headers.message);
        }); 
    };

    disconnect = () => {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected');
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
            autoplay:false, 
            on:{
            	 slideChangeTransitionEnd: function(){
					 refreshAn(this.activeIndex); 
				} 
			 }
         });
         const type = this.state.teacher_id ? 'c' : 'b';
        const id = this.state.m_key;
        if (type === 'c') {
            this.swiper.on('slideChange', () => {
                this.stompClient.send('/message/page/flip', {}, JSON.stringify({ name: 'flip page', data: { id, page: this.swiper.activeIndex } }));
            });
        }
    };
    componentWillUnmount() {
        this.disconnect();
    }
    render() {
        return (
        	<div style={{height:'100%'}}>
        		{
        			this.state.type === 'pc' ? <div className="phone">
			            <div className="swiper-container">
			                <div className="swiper-wrapper">
			                    {
			                        this.props.pages.map((page, index) => <div className="swiper-slide" key={page.id}><Page page={page} viewing isTeacher={this.state.teacher_id ? true:false} stompClient={this.stompClient} /></div>)
			                    }
			                </div> 
			            </div>
		            </div> : <div className="swiper-container">
			                <div className="swiper-wrapper">
			                    {
			                        this.props.pages.map((page, index) => <div className="swiper-slide" key={page.id}><Page page={page} viewing isTeacher={this.state.teacher_id ? true:false} stompClient={this.stompClient} /></div>)
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
