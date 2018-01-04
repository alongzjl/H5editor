/**
 * Created by madofu@163.com.
 */
import React from 'react';
import { Base64 } from 'js-base64';
import Select from 'react-select';
import './header.less';
import WordModal from '../modal/WordModal';
import PageModal from '../modal/PageModal';
import TestModal from '../modal/TestModal';
import store from '../../../store';
import { addElements, addPage, changeFocus } from '../../../actions/h5Actions';
import { hideNoteModal } from '../../../actions/uiActions';
import AddVideoDialog from '../dialog/addVideoDialog';
import AddAudioDialog from '../dialog/addAudioDialog';
import AddBeiZhuDialog from '../dialog/addBeiZhuDialog';
import AddImageDialog from '../dialog/addImageDialog';
import t from '../../i18n';

class Header extends React.Component {
    state = {
        current: null,
        user: {},
    };

    addWord = () => {
        store.dispatch(addElements(new WordModal().plainObject()));
    };

    addTest = () => {
        store.dispatch(changeFocus(new TestModal().plainObject()));
    };
    addPages = () => {
        store.dispatch(addPage(new PageModal().plainObject()));
    };
    addShape = () => {
        store.dispatch(changeFocus({
            id: 0,
            name: 'ShapeModal',
            style: {
                width: '100px',
                height: '100px',
                fill: '#00BCD3',
                stroke: 'none',
                strokeWidth: 0,
            },
        }));
    };
    mouseOver = index => {
        this.setState({
            current: Number.parseInt(index),
        });
    };
    mouseLeave = index => {
        this.setState({
            current: null,
        });
    };
    componentWillMount() {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            const user = Base64.decode(token.split('.')[1]);
            this.setState({
                user: JSON.parse(user),
            });
        }
    }
    changeLocale = e => {
        if (confirm(t('change_locale'))) {
            localStorage.setItem('locale', e.value);
            window.location.reload();
        }
    };
    render() {
        const imgList = [{
            normal: './images/add_board.png',
            highlight: './images/add_board_click.png',
        }, {
            normal: './images/save_tmpl.png',
            highlight: './images/save_tmpl_click.png',
        }, {
            normal: './images/play.png',
            highlight: './images/play_click.png',
        }, {
            normal: './images/fonts.png',
            highlight: './images/fonts_click.png',
        }, {
            normal: './images/form.png',
            highlight: './images/form_click.png',
        }, {
            normal: './images/shape.png',
            highlight: './images/shape_click.png',
        }, {
            normal: './images/photo.png',
            highlight: './images/photo_click.png',
        }, {
            normal: './images/audio.png',
            highlight: './images/audio_click.png',
        }, {
            normal: './images/video.png',
            highlight: './images/video_click.png',
        }, {
            normal: './images/remarks.png',
            highlight: './images/remarks_click.png',
        }];
        const locale = localStorage.getItem('locale') || 'zh_CN';
        return (
            <div className="h5Header">
                <div className="logo">
                    <img src={require('./images/popon.png')} />
                </div>
                <div className="type_wordoor">
                    <ul className="mang_type">
                        <li onClick={this.addPages} onMouseEnter={() => this.mouseOver(0)} onMouseLeave={() => this.mouseLeave(0)} title='新建课程'>
                            <img src={require(`${this.state.current !== 0 ? imgList[0].normal : imgList[0].highlight}`)} />
                        </li>
                        <li onClick={this.props.onSaveTemplate} onMouseEnter={() => this.mouseOver(1)} onMouseLeave={() => this.mouseLeave(1)} title='保存课程模板'>
                            <img src={require(`${this.state.current !== 1 ? imgList[1].normal : imgList[1].highlight}`)} />
                        </li>
                        <li onClick={this.props.onPreview} onMouseEnter={() => this.mouseOver(2)} onMouseLeave={() => this.mouseLeave(2)} title='预览课程'>
                            <img src={require(`${this.state.current !== 2 ? imgList[2].normal : imgList[2].highlight}`)} />
                        </li>
                        <li>|</li>
                        <li onClick={this.addWord} onMouseEnter={() => this.mouseOver(3)} onMouseLeave={() => this.mouseLeave(3)} title='添加文本'>
                            <img src={require(`${this.state.current !== 3 ? imgList[3].normal : imgList[3].highlight}`)} />
                        </li>
                        <li onClick={this.addTest} onMouseEnter={() => this.mouseOver(4)} onMouseLeave={() => this.mouseLeave(4)} title='添加试题'>
                            <img src={require(`${this.state.current !== 4 ? imgList[4].normal : imgList[4].highlight}`)} />
                        </li>
                        <li onClick={this.addShape} onMouseEnter={() => this.mouseOver(5)} onMouseLeave={() => this.mouseLeave(5)} title='添加图形'>
                            <img src={require(`${this.state.current !== 5 ? imgList[5].normal : imgList[5].highlight}`)} />
                        </li>
                        <li onClick={() => { this.addImageModal.show(); }} onMouseEnter={() => this.mouseOver(6)} onMouseLeave={() => this.mouseLeave(6)} title='添加图片'>
                            <img src={require(`${this.state.current !== 6 ? imgList[6].normal : imgList[6].highlight}`)} />
                        </li>
                        <li onClick={() => { this.addAudioModal.show(); }} onMouseEnter={() => this.mouseOver(7)} onMouseLeave={() => this.mouseLeave(7)} title='添加音频'>
                            <img src={require(`${this.state.current !== 7 ? imgList[7].normal : imgList[7].highlight}`)} />
                        </li>
                        <li onClick={() => { this.addVideoModal.show(); }} onMouseEnter={() => this.mouseOver(8)} onMouseLeave={() => this.mouseLeave(8)} title='添加视频'>
                            <img src={require(`${this.state.current !== 8 ? imgList[8].normal : imgList[8].highlight}`)} />
                        </li>
                        <li onClick={() => { store.dispatch(hideNoteModal(false)); }} onMouseEnter={() => this.mouseOver(9)} onMouseLeave={() => this.mouseLeave(9)} title='添加备注，只有教练身份可见'>
                            <img src={require(`${this.state.current !== 9 ? imgList[9].normal : imgList[9].highlight}`)} />
                        </li>
                    </ul>
                </div>
                <div className="verifyCourse">
                    <div className="userInfo">
                        <Select
                            name="form-field-name"
                            value={locale}
                            onChange={this.changeLocale}
                            clearable={false}
                            searchable={false}
                            options={[
                                { value: 'en_US', label: 'en' },
                                { value: 'zh_CN', label: 'cn' },
                            ]}
                        />
                        <img src={this.state.user.avatar} />
                    </div>
                    <div className="finishCourse" onClick={this.props.onPublish}>{t('publish')}</div>
                </div>
                <AddAudioDialog ref={com => { this.addAudioModal = com; }} />
                <AddVideoDialog ref={com => { this.addVideoModal = com; }} />
                <AddBeiZhuDialog />
                <AddImageDialog ref={com => { this.addImageModal = com; }} focus={{}} />
            </div>
        );
    }
}

export default Header;
