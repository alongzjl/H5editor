import React from 'react';
import SkyLight from 'react-skylight';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import ImageModal from '../modal/ImageModal';
import FileUploader from '../../common/fileUpload/fileUploader';
import store from '../../../store';
import { addElements, changeImage, changePageStyle } from '../../../actions/h5Actions';
import './addImageDialog.less';
import Category from './Category';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import Noty from '../../common/noty/noty';
import t from '../../i18n';

export default class AddImageDialog extends React.Component {
    constructor(props) {
        super();
        this.state = {
            contentLi: '图片库',
            category: props.type,
        };
    }

    show() {
        this.setState({
            contentLi: '图片库',
        });
        this.imageModal.show();
    }

    addImages = res => {
        if (this.state.category === 'backImage') {
            store.dispatch(changePageStyle({
                backgroundImage: `url(${API_URL.upload + res})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }));
        } else if (this.props.focus.id) {
            store.dispatch(changeImage(res));
        } else {
            this.saveRecent(res);
            store.dispatch(addElements(new ImageModal(res).plainObject()));
        }
        this.imageModal.hide();
    };
    saveRecent = src => {
        let images = localStorage.getItem('images');
        images = images ? JSON.parse(images) : [];
        images.unshift(src);
        if (images.length > 24) {
            images.shift();
        }
        localStorage.setItem('images', JSON.stringify(images));
    };
    select = (name, e) => {
        const value = e.target ? e.target.value : e;
        this.setState({
            [name]: value,
        });
    };

    render() {
        const addImageDialog = {// 添加图片弹窗样式
            width: '780px',
            height: 'auto',
            color: '#505766',
            zIndex: '101!important',
            background: '#f9f9f9',
            margin: '0 auto',
            boxShadow: '0 4px 10px 0',
            left: 0,
            right: 0,
            top: '50px',
            borderRadius: '6px',
        };
        return (
            <SkyLight
                dialogStyles={addImageDialog}
                hideOnOverlayClicked
                ref={com => {
                    this.imageModal = com;
                }}
                title="图片素材"
            >
                <div className="addImageBody flex_row_start">
                    <div className="left flex_column_between">
                        <ul className="cursor-pointer">
                            <li
                                onClick={() => this.select('contentLi', '图片库')}
                                className={`${this.state.contentLi === '图片库' ? 'selectLi' : ''}`}
                            >
                                图片库
                            </li>
                            <li
                                onClick={() => this.select('contentLi', '最近使用')}
                                className={`${this.state.contentLi === '最近使用' ? 'selectLi' : ''}`}
                            >
                                最近使用
                            </li>
                            <li
                                onClick={() => this.select('contentLi', '我的图库')}
                                className={`${this.state.contentLi === '我的图库' ? 'selectLi' : ''}`}
                            >
                                我的图库
                            </li>
                            <li
                                onClick={() => this.select('contentLi', '本地上传')}
                                className={`${this.state.contentLi === '本地上传' ? 'selectLi' : ''}`}
                            >
                                本地上传
                            </li>
                        </ul>
                    </div>
                    <div className="right">
                        <Images
                            onAddImage={this.addImages}
                            current={this.state.contentLi}
                            changeSelect={this.select}
                        />
                    </div>
                </div>
            </SkyLight>
        );
    }
}
class Images extends React.Component {
    state = {
        images: [],
        total: 0,
        isPublic: true,
        categoryId: 0,
        selectImg: '',
    };
    componentDidMount() {
        this.loadData();
    }
    select = (name, e) => {
        const value = e.target ? e.target.value : e;
        this.setState({
            [name]: value,
        });
    };
    loadData = (page = 1, keyword = '') => {
        Fetch.get(`${API_URL.image.list}?page=${page}&isPublic=${this.state.isPublic}&categoryId=${this.state.categoryId}&keyword=${keyword}`).then(data => {
            this.setState({
                images: data.content,
                total: data.totalElements,
            });
        });
    };
    changePage = (page = 1) => {
        if (this.state.current === '最近使用') {
            const srcs = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')) : [];
            const images = srcs.map(src => ({ path: src }));
            this.setState({ images, total: images.length });
        } else if (this.state.current !== '本地上传') {
            this.loadData(page);
        }
    };
    componentWillReceiveProps(nextProps) {
        let isPublic = true;
        switch (nextProps.current) {
        case '图片库': break;
        case '我的图库': isPublic = false; break;
        case '最近使用': isPublic = false; break;
        default: break;
        }
        this.setState({
            current: nextProps.current,
            isPublic,
        }, this.changePage);
    }
    handleUse = () => {
        this.props.onAddImage(this.state.selectImg);
    };
    handlePreview = () => {
        this.previewModal.show(this.state.selectImg);
    };
    handleDel = (id, src) => {
        if (this.state.current === '最近使用') {
            let images = localStorage.getItem('images');
            images = images ? JSON.parse(images) : [];
            const newImages = images.filter(image => image !== src);
            this.setState({ images: newImages });
            localStorage.setItem('images', JSON.stringify(newImages));
            Noty.success(t('delete_success'));
        } else {
            Fetch.del(`${API_URL.image.del}${id}`).then(() => {
                Noty.success(t('delete_success'));
                this.loadData(1);
            });
        }
    };
    changeKeyword = e => {
        this.keyword = e.target.value;
    };

    search = () => {
        this.loadData(1, this.keyword);
    };
    onCategoryChange = category => {
        this.setState({ categoryId: category.id }, this.loadData);
    };
    render() {
        if (this.state.current === '本地上传') {
            return (
                <div className="flex_row_center flex_vertical_bottom">
                    <FileUploader
                        options={{
                            baseUrl: API_URL.image.upload,
                            multiple: true,
                            uploadSuccess: () => {
                                Noty.success(t('file_upload_success'));
                                this.props.changeSelect('contentLi', '我的图库');
                            },
                        }}
                    >
                        <button ref="chooseAndUpload" className="uploadBtn">{t('file_select')}</button>
                    </FileUploader>
                </div>
            );
        }
        return (
            <div>
                {
                    this.state.current === '图片库' ? <div className="top flex_row_start flex_vertical_top">
                        <Category type="image" onClick={this.onCategoryChange} />
                        <div className="searchItem flex_row_between">
                            <input onChange={this.changeKeyword} />
                            <button className="flex_row_center flex_vertical_middle" onClick={this.search}>
                                <img src={require('./images/search.png')} />
                            </button>
                        </div>
                    </div> : null
                }
                <div className="flex_row_start images">
                    {
                        this.state.images.map((item, index) =>
                            <div
                                className="imageItem flex_row_center flex_vertical_middle"
                                onMouseOver={() => this.select('selectImg', item.path)}
                                onMouseLeave={() => this.select('selectImg', '')}
                                key={item.id}
                            >
                                <img src={`${API_URL.upload + item.path}`} />
                                {
                                this.state.selectImg === item.path ? <div className="handleBack" /> : null
                            }
                                {
                                    (this.state.selectImg === item.path && this.state.current === '图片库') ? <div className="handles flex_column_center flex_vertical_middle">
                                        <button className="use" onClick={this.handleUse}>{t('file_use')}</button>
                                    </div> : null
                            }
                                {
                                    (this.state.selectImg === item.path && this.state.current !== '图片库') ? <div className="handles flex_column_center flex_vertical_middle">
                                        <button className="preview" onClick={() => this.handleDel(item.id, item.path)}>{t('delete')}</button>
                                        <button className="use" onClick={this.handleUse}>{t('file_use')}</button>
                                    </div> : null
                                }
                            </div>,
                        )
                    }
                </div>
                <div className="page">
                    <Pagination onChange={this.changePage} total={this.state.total} pageSize={20} />
                </div>
            </div>
        );
    }
}

export class PreviewDialog extends React.Component {
    state = {
        image: '',
    };

    show(src) {
        this.previewModal.show();
        this.setState({
            image: src,
        });
    }

    useNow = () => {
        this.props.onAddImages(this.state.image);
    };

    render() {
        const previewDialog = {// 预览图片弹窗样式
            height: 'auto',
            minHeight: '400px',
            margin: '0 auto',
            color: '##505766',
            left: 0,
            right: 0,
            top: '250px',
            width: '780px',
            background: '#F9F9F9',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,0.20)',
            borderRadius: '6px',
        };
        return (
            <SkyLight
                dialogStyles={previewDialog}
                hideOnOverlayClicked
                ref={com => { this.previewModal = com; }}
                title=""
            >
                <div className="previewBody flex_row_start">
                    <div className="imageBody flex_row_center flex_vertical_middle">
                        <img src={this.state.image} />
                    </div>
                    <div>
                        <h2 className="blackColor">预览</h2>
                        <button className="useNow fs14 whiteColor themeBack" onClick={this.useNow}>立即使用</button>
                    </div>
                </div>
            </SkyLight>
        );
    }
}

