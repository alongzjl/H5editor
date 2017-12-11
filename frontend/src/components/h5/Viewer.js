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
import { changeCourse } from '../../actions/h5Actions';
import Page from './elements/Page';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';

import './viewer.less';

class Viewer extends React.Component {
    constructor() {
        super();
        this.connect();
    }
    state = {
        pages: [],
    };
    componentDidMount = () => {
        this.loadData();
    };

    connect = () => {
        const baseDomain = API_URL.domain.substring(0, API_URL.domain.indexOf('/', 8));
        const socket = new SockJS(`${baseDomain}/ws`);
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, frame => {
            const type = this.props.params.type;
            if (type === 'c') {
                this.stompClient.subscribe('/topic/flip', data => {
                    const id = this.props.params.id;
                    const message = JSON.parse(data.body);
                    if (message.data && id == message.data.id) {
                        this.swiper.slideTo(message.data.page);
                    }
                });
            }
        });
    };

    disconnect = () => {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected');
    };

    loadData = () => {
        const id = this.props.params.id;
        if (!id) {
            const pages = window.pages;
            store.dispatch(changeCourse(0, pages));
            this.initSwiper();
        } else {
            Fetch.get(`${API_URL.course.show}/${id}`).then(course => {
                const pages = JSON.parse(course.pages);
                store.dispatch(changeCourse(course.id, pages));
                this.initSwiper();
            });
        }
    };
    initSwiper = () => {
        this.swiper = new Swiper('.swiper-container', {
            loop: false,
        });
        const type = this.props.params.type;
        const id = this.props.params.id;
        if (type === 'b') {
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
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {
                        this.props.pages.map((page, index) => <div className="swiper-slide" key={page.id}><Page page={page} viewing isTeacher={this.props.params.type === 'b'} /></div>)
                    }
                </div>
            </div>
        );
    }
}
const mapStateToProps = function (store) {
    return {
        pages: store.h5State.present.pages,
    };
};

export default connect(mapStateToProps)(Viewer);
