import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import QRCode from 'qrcode';
import { Button, Col, Icon, message, Row, Table } from 'antd';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import Header from '../../../common/header/Header';
import Sidebar from './Sidebar';
import store from '../../../store';
import { changeCourse, changeCourses } from '../../actions/courseActions';
import './groupBuy.less';

class Course extends React.Component {
    state = {
        selects: [],
        page: 1,
    };

    componentDidMount = () => {
        this.loadData();
    };

    generateCodes = () => {
        this.props.courses.forEach(course => {
            const canvas = document.getElementById(`canvas${course.id}`);
            QRCode.toCanvas(canvas, `${API_URL.www}viewer.html#/${course.id}/b`, error => {
                if (error) {
                    console.error(error);
                }
            });
            const canvas2 = document.getElementById(`canvas-c${course.id}`);
            QRCode.toCanvas(canvas2, `${API_URL.www}viewer.html#/${course.id}/c`, error => {
                if (error) {
                    console.error(error);
                }
            });
        });
    };

    loadData = () => {
        const url = `${API_URL.course.list}?page=${this.state.page}&materialId=`;
        Fetch.get(url).then(data => {
            store.dispatch(changeCourses(data.content, data.totalElements));
            this.generateCodes();
        });
    };

    changePage = page => {
        this.setState({
            page,
        }, () => {
            this.loadData();
        });
    };

    add = () => {
        store.dispatch(changeCourse({}));
        this.modal.show();
    };

    update = record => {
        store.dispatch(changeCourse(record));
        this.modal.show();
    };

    qrcode = record => {
        store.dispatch(changeCourse(record));
        this.qrcodeModal.show();
    };

    del = post => {
        Fetch.del(`${API_URL.course.del}${post.id}`, {}).then(() => {
            message.success('删除成功');
            this.loadData();
        });
    };

    exportCourse = id => {
        location.href = `${API_URL.course.export}${id}`;
    };

    delAll = () => {
        if (this.state.selects.length === 0) {
            message.error('请至少选择一项进行删除！');
            return;
        }
        Fetch.put(API_URL.course.batchDel, { ids: this.state.selects }).then(() => {
            message.success('删除成功');
            this.loadData();
        });
    };

    getColumns = () => [{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '浏览数量',
        dataIndex: 'scanCount',
    }, {
        title: '创建时间',
        dataIndex: 'createDate',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    }, {
        title: '创建人',
        dataIndex: 'username',
    }, {
        title: '二维码',
        dataIndex: 'id',
        key: 'id',
        render: text => {
            const id = `canvas${text}`;
            return <canvas id={id} />;
        },
    }, {
        title: 'C端二维码',
        dataIndex: 'id',
        key: 'id-c',
        render: text => {
            const id = `canvas-c${text}`;
            return <canvas id={id} />;
        },
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
            <span>
                <a
                    href="javascript:void(0)" onClick={this.exportCourse.bind(this, record.id)}
                >导出</a>
                <span className="ant-divider" />
                <a
                    href="javascript:void(0)" onClick={this.del.bind(this, record)}
                >删除</a>
            </span>
        ),
    }];

    render() {
        return (
            <div>
                <Header current="course" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <Sidebar current="course" />
                        </Col>
                        <Col span={20}>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.props.courses}
                                del={this.del}
                                rowKey="id"
                                expandedRowRender={record => <p>{record.description}</p>}
                                pagination={{ total: this.props.total, onChange: this.changePage }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        courses: store.courseState.courses,
        course: store.courseState.course,
        total: store.courseState.total,
    };
};

export default connect(mapStateToProps)(Course);
