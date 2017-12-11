import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Table, Button, Modal, message, Row, Col } from 'antd';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import Header from '../../../common/header/Header';
import './Ad.less';
import Sidebar from './Sidebar';
import store from '../../../store';
import { changeAudios, changeAudio } from '../../actions/audioActions';
import AudioFormModal from './AudioFormModal';

class Audio extends React.Component {
    componentDidMount = () => {
        this.loadData(1);
    };

    changePage = page => {
        this.loadData(page);
    };

    loadData = (page = 1) => {
        Fetch.get(`${API_URL.audio.list}?page=${page}&orderName=created_date&orderDir=DESC&isPublic=true`).then(data => {
            store.dispatch(changeAudios(data.content, data.totalElements));
        });
    };

    del = audio => {
        Fetch.del(`${API_URL.audio.del}${audio.id}`, {}).then(() => {
            message.success('删除成功');
            this.loadData();
        });
    };

    add= () => {
        store.dispatch(changeAudio({}));
        this.audioModal.show();
    };

    getColumns = () => [{
        title: '音乐名',
        dataIndex: 'musicName',
        key: 'musicName',
    }, {
        title: '分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
    }, {
        title: '音乐存放地址',
        dataIndex: 'musicPath',
        key: 'musicPath',
    }, {
        title: '上传时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
            <span>
                <a
                    href="javascript:void(0)" onClick={this.del.bind(this, record)}
                >删除</a>
            </span>
        ),
    }];

    render() {
        return (
            <div>
                <Header current="audio" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <Sidebar current="1" />
                        </Col>
                        <Col span={20}>
                            <Button type="primary" size="large" onClick={this.add}>添加</Button>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.props.audios}
                                del={this.del}
                                rowKey="id"
                                pagination={{ total: this.props.total, onChange: this.changePage }}
                            />
                            <AudioFormModal audio={this.props.audio} reload={this.loadData} ref={com => { this.audioModal = com; }} />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        audios: store.audioState.audios,
        audio: store.audioState.audio,
        total: store.audioState.total,
    };
};

export default connect(mapStateToProps)(Audio);
