import React from 'react';
import SkyLight from 'react-skylight';
import Swiper from 'swiper';
import Page from '../elements/Page';
import { refreshAnimation ,changeCurrentPage} from '../../../actions/h5Actions';
import store from '../../../store';
import './previewDialog.less';
import 'swiper/dist/css/swiper.css';
import disableScroll from './disableScroll';

export default class PreviewDialog extends React.Component {
    state = {
        currentPage: 0,
         next: true,
    };
    
    show = () => {
        this.previewModal.show();
        setTimeout(this.initSwiper,1);
     }; 
    
    hide = () => {
        this.previewModal.hide();
    };
    refreshAn = activeIndex => { 
		 store.dispatch(changeCurrentPage(activeIndex));
	     store.dispatch(refreshAnimation());
	};
    initSwiper = () => {
    	var that = this;
    	 this.swiper = new Swiper('.swiper-container', {
    	 	watchSlidesProgress: true,
    	 	slidesPerView: 'auto',
    	 	centeredSlides: true,
            loop: false,
            loopedSlides: 3,
            effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
            autoplay:false, 
            navigation: {
			    nextEl: '.swiper-button-next',
			    prevEl: '.swiper-button-prev',
			  },
			  pagination: {
			        el: '.swiper-pagination',
			        type: 'custom',
			        renderCustom: function (swiper, current, total) {
			          return current + ' / ' + total;
			        }
			  },
			on:{
            	 slideChangeTransitionEnd: function(){
					 that.refreshAn(this.activeIndex); 
				},
				 progress: function(progress) {
			    	for (var i = 0; i < this.slides.length; i++) {
						var slide = this.slides.eq(i);
						var slideProgress = this.slides[i].progress;
						var modify = 1;
						if (Math.abs(slideProgress) > 1) {
							modify = (Math.abs(slideProgress) - 1) * 0.3;
						}
						const translate = slideProgress * modify * (-60) + 'px';  
						const scale = 1 - Math.abs(slideProgress) / 3;
						const zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
						slide.transform('translateX(' + translate + ') scale(' + scale + ')');
						slide.css('zIndex', zIndex);
						slide.css('opacity', 1);
						if (Math.abs(slideProgress) > 3) {
							slide.css('opacity', 0);
						} 
					}
				},
				setTransition: function(transition) {
					for (var i = 0; i < this.slides.length; i++) {
						var slide = this.slides.eq(i)
						slide.transition(transition);
					}
				}
			 }
         });
     };
    render() {
        const previewDialog = {
            height: 'auto',
            minHeight: '320px',
            width: '900px',
            margin: '0 auto',
            left: 0,
            right: 0,
            top: '60px',
            backgroundColor: 'rgba(0,0,0,0)',
        };
        return (
            <SkyLight
                dialogStyles={previewDialog}
                overlayStyles={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
                ref={com => { this.previewModal = com; }}
                title=""
                {...disableScroll()}
            >
				<div className="previewDialog">
                    <div className="pagepercent">
                    	<div className="swiper-pagination"></div>
                    </div>
                    <div className="hideDialog" onClick={this.hide}>退出预览</div>
                    <div className="flex_row_center flex_vertical_bottom">
                        <img className="left swiper-button-prev" src={require('./images/left.png')} />
                        <div className="content">
                        	<div className="phone_title">
                        	<div className="swiper-container">
				                <div className="swiper-wrapper"> 
				                	 {
				                        this.props.pages.map((page, index) => <div className="swiper-slide" key={page.id} style={{width:'240px'}}><div><div className="prewView"></div><Page page={page} view="phone" /></div></div>)
				                    }
				                </div>
				            </div>
				            </div>
                        </div>
                       <img className="right swiper-button-next" src={require('./images/right.png')} />
                    </div>
                </div>
            </SkyLight>
        );
    }
}
