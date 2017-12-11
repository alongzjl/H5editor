import React from 'react';
import { Table, message, Row, Col } from 'antd';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import Header from '../../../common/header/Header';
import './Ad.less';
import Sidebar from './Sidebar';

class TagTable extends React.Component {
    componentDidMount = () => {
        this.loadData(1);
    };

    state = {
        tags: [],
        total: 0,
    };

    loadData = (page = 1) => {
        Fetch.get(`${API_URL.tag.list}?page=${page}`).then(data => {
            this.setState({ tags: data.content, total: data.totalElements });
        });
    };

    changePage = page => {
        this.loadData(page);
    };

    changeBest = post => {
        Fetch.put(`${API_URL.tag.best}${post.id}`, { best: !post.best }).then(() => {
            message.success('设置成功');
            this.loadData();
        });
    };

    del = tag => {
        Fetch.del(`${API_URL.tag.del}${tag.id}`, {}).then(() => {
            message.success('删除成功');
            this.loadData();
        });
    };

    getColumns = () => [{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
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
                <Header current="post" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <Sidebar current="2" />
                        </Col>
                        <Col span={20}>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.state.tags}
                                del={this.del}
                                pagination={{ total: this.state.total, onChange: this.changePage }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default TagTable;
