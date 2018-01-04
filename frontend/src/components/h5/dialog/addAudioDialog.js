import React from 'react';
import SkyLight from 'react-skylight';
import AudioModal from '../modal/AudioModal';
import FileUploader from '../../common/fileUpload/fileUploader';
import DragUpload from '../../common/fileUpload/DragUpload';
import store from '../../../store';
import { addElements } from '../../../actions/h5Actions';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import Category from './Category';
import './addAudioDialog.less';
import Noty from '../../common/noty/noty';
import t from '../../i18n';
import disableScroll from './disableScroll';
import commonCss from '../commonCssNav';

export default class AddAudioDialog extends React.Component {
    state = {
        contentLi: '音频素材',
        audios: [],
        categoryId: 0,
    };

    show() {
        this.audioModal.show();
    }
    chooseMangAudio = () => {
        const elements = this.state.audios.map(audio => new AudioModal(audio.musicPath).plainObject());
        store.dispatch(addElements(elements));
        this.saveRecent();
        this.audioModal.hide();
    };
    saveRecent = () => {
        let audios = localStorage.getItem('audios');
        audios = audios ? JSON.parse(audios) : [];
        this.state.audios.forEach(audio => {
            if (audios.findIndex(item => audio.id === item.id) === -1) {
                audios.push(audio);
            }
        });
        localStorage.setItem('audios', JSON.stringify(audios));
    };
    select = (name, e) => {
        const value = e.target ? e.target.value : e;
        this.setState({
            [name]: value,
        });
    };
    selectedAudio = item => {
        const index = this.state.audios.findIndex(audio => audio.id === item.id);
        if (index === -1) {
            this.setState({
                audios: this.state.audios.concat([item]),
            });
        }
    };
    previewAudio = () => {
        this.audioModal.hide();
        this.previewModal.show();
    };
    deleteAudio = i => {
        const audioList = this.state.audios.filter((item, index) => index !== i);
        this.setState({
            audios: audioList,
        });
    };
    render() {
        return (
            <div>
                <SkyLight
                    dialogStyles={{ ...commonCss.dialogStyles, paddingBottom: '40px' }}
                    titleStyle={commonCss.titleStyle}
                    closeButtonStyle={commonCss.closeButtonStyle}
                    hideOnOverlayClicked
                    ref={com => { this.audioModal = com; }}
                    title="音频素材"
                    {...disableScroll()}
                >
                    <div className="addImageBody audioDialog flex_row_start">
                        <div className="left flex_column_between">
                            <ul className="cursor-pointer">
                                <li
                                    onClick={() => this.select('contentLi', '音频素材')}
                                    className={`${this.state.contentLi === '音频素材' ? 'selectLi' : ''}`}
                                >
                                    音频库
                                </li>
                                <li
                                    onClick={() => this.select('contentLi', '最近使用')}
                                    className={`${this.state.contentLi === '最近使用' ? 'selectLi' : ''}`}
                                >
                                    最近使用
                                </li>
                                <li
                                    onClick={() => this.select('contentLi', '我的音频')}
                                    className={`${this.state.contentLi === '我的音频' ? 'selectLi' : ''}`}
                                >
                                    我的音频
                                </li>
                                <li
                                    onClick={() => this.select('contentLi', '本地上传')}
                                    className={`${this.state.contentLi === '本地上传' ? 'selectLi' : ''}`}
                                >
                                    本地上传
                                </li>
                            </ul>
                            <button className="uploadBtn" onClick={this.previewAudio}>添加外链</button>
                        </div>
                        <div className="right">
                            <Audios
                                onChoose={item => this.selectedAudio(item)}
                                current={this.state.contentLi}
                                changeSelect={this.select}
                                categoryId={this.state.categoryId}
                                selects={this.state.audios}
                            />
                            <ul className="page">
                                {
                                    this.state.audios.length ? <li >已选择:</li> : null
                                }

                                {
                                    this.state.audios.map((item, index) =>
                                        <li key={item.id}>
                                            <p>{item.musicName}</p>
                                            <div className="deleteAudio" onClick={() => this.deleteAudio(index)}>×</div>
                                        </li>,
                                    )
                                }
                                {
                                    this.state.contentLi !== '本地上传' && <div className="chooseAudioBtn" onClick={this.chooseMangAudio}>{t('confirm')}</div>
                                }
                            </ul>
                        </div>
                    </div>
                </SkyLight>
                <PreviewDialog ref={com => { this.previewModal = com; }} />
            </div>
        );
    }
}

class Audios extends React.Component {
    state = {
        audios: [],
        play: null,
        hover: null,
        categoryId: 0,
    };
    componentDidMount() {
        this.loadData();
    }
    loadData = (isPublic = true, keyword = '') => {
        Fetch.get(`${API_URL.audio.list}?isPublic=${isPublic}&categoryId=${this.state.categoryId}&keyword=${keyword}`).then(data => {
            this.setState({
                audios: data,
            });
        });
    };
    componentWillReceiveProps(nextProps) {
        switch (nextProps.current) {
        case '音频素材': this.loadData(true); break;
        case '我的音频': this.loadData(false); break;
        case '最近使用': {
            const audios = localStorage.getItem('audios') ? JSON.parse(localStorage.getItem('audios')) : [];
            this.setState({ audios });
            break;
        }
        default: break;
        }
        this.setState({
            current: nextProps.current,
        });
    }
    previewPlay = (item, index, e) => {
        e.stopPropagation();
        const audio = document.getElementById(`audio${item.id}`);
        if (audio.paused) {
            audio.play();
            this.handlePlayState(index);
        } else {
            audio.pause();
            this.handlePlayState(null);
        }
    };
    handlePlayState = idx => {
        this.setState({
            play: idx,
        });
    };
    handleOver = index => {
        this.setState({
            hover: index,
        });
    };
    changeKeyword = e => {
        this.keyword = e.target.value;
    };

    search = () => {
        this.loadData(true, this.keyword);
    };
    onCategoryChange = category => {
        this.setState({ categoryId: category.id }, this.loadData);
    };
    selected(id) {
        const index = this.props.selects.findIndex(item => item.id === id);
        return index !== -1;
    }
    render() {
        const { onChoose } = this.props;
        if (this.state.current === '本地上传') {
            return (
                <div>
                    <DragUpload
                        acceptedFiles="audio/*"
                        changeSelect={() => this.props.changeSelect('contentLi', '我的音频')}
                        postUrl={API_URL.audio.upload}
                    />
                    <div className="flex_row_center audio_list2">
                        <FileUploader
                            url={API_URL.audio.upload}
                            multiple
                            onStart={() => { this.setState({ uploading: true }); }}
                            onSuccess={() => {
                                this.setState({ uploading: false });
                                Noty.success(t('file_upload_success'));
                                this.props.changeSelect('contentLi', '我的音频');
                            }}
                            onError={() => { this.setState({ uploading: false }); }}
                            accept="audio/*"
                        >
                            <button className="uploadBtn" disabled={this.state.uploading}>
                                {
                                    this.state.uploading ? t('file_uploading') : t('file_select')
                                }
                                {
                                    this.state.uploading && <div className="spinner">
                                        <div className="bounce1"></div>
                                        <div className="bounce2"></div>
                                        <div className="bounce3"></div>
                                    </div>
                                }
                            </button>
                        </FileUploader>
                    </div>
                </div>
            );
        }
        const butSrc = {
            play: require('./images/play_normal.png'),
            pause: require('./images/pause_normal.png'),
            playSelected: require('./images/play_selected.png'),
            pauseSelected: require('./images/pause_selected.png'),
        };
        return (
            <div>
                {
                    this.state.current === '音频素材' ? <div className="top flex_row_start flex_vertical_top">
                        <Category type="audio" onClick={this.onCategoryChange} />
                        <div className="searchItem flex_row_between">
                            <input onChange={this.changeKeyword} />
                            <button className="flex_row_center flex_vertical_middle" onClick={this.search}>
                                <img src={require('./images/search.png')} />
                            </button>
                        </div>
                    </div> : null
                }
                <ul className="audio_list">
                    {
                        this.state.audios.map((item, index) => {
                            const selected = this.selected(item.id);
                            return (
                                <li
                                    onMouseEnter={() => this.handleOver(index)}
                                    onMouseLeave={() => this.handleOver(null)}
                                    onClick={() => onChoose(item)}
                                    key={item.id}
                                    className={`flex_row_start flex_vertical_middle ${selected ? 'selected2' : ''}`}
                                >
                                    <button
                                        style={{ backgroundImage: `url(${
                                                (this.state.hover === index || selected) ?
                                                        `${this.state.play === index ? butSrc.playSelected : butSrc.pauseSelected}` :
                                                        `${this.state.play === index ? butSrc.play : butSrc.pause}`})`,
                                        }}
                                        className="controlBtn"
                                        onClick={args => this.previewPlay(item, index, args)}
                                    />
                                    <audio id={`audio${item.id}`} src={API_URL.upload + item.musicPath} onEnded={() => this.handlePlayState(null)} />
                                    {item.musicName}
                                </li>
                            );
                        },
                        )
                    }
                </ul>
            </div>
        );
    }
}

class PreviewDialog extends React.Component {
    state = {
        audio: '',
    };
    show() {
        this.previewModal.show();
    }
    hide = () => {
        this.previewModal.hide();
    };
    addAudio = () => {
        if (!this.state.audio || this.state.audio.indexOf('http') !== 0) {
            Noty.error(t('audio_url_error'));
            return;
        }
        store.dispatch(addElements(new AudioModal(this.state.audio).plainObject()));
        this.previewModal.hide();
    };
    saveValue = e => {
        this.setState({
            audio: e.target.value,
        });
    };
    render() {
        return (
            <SkyLight
                dialogStyles={{ ...commonCss.dialogStyles, paddingBottom: '40px' }}
                titleStyle={commonCss.titleStyle}
                closeButtonStyle={commonCss.closeButtonStyle}
                hideOnOverlayClicked
                ref={com => { this.previewModal = com; }}
                title="音频素材"
            >
                <p className="audioDesc">{t('audio_tip')}</p>
                <input type="text" className="audioInput" placeholder={t('audio_placeholder')} onChange={this.saveValue} />
                <ul className="audioBtn">
                    <li onClick={this.addAudio}>{t('confirm')}</li>
                    <li onClick={this.hide}>{t('cancel')}</li>

                </ul>
            </SkyLight>
        );
    }
}
