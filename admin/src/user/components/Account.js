/**
 * Created by sunlong on 16/8/6.
 */
import React from 'react';
import { Table, Row, Col } from 'antd';
import Header from '../../common/header/Header';
import Sidebar from './Sidebar';
import './groupBuy.less';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';

class Account extends React.Component {
    state = {
        page: 1,
        list: [],
        total: 0,
        account: {},
    };

    componentDidMount() {
        const user = JSON.parse(sessionStorage.user);

        Fetch.get(`${API_URL.fund.list}${user.sub}?page=${this.state.page}`).then(data => {
            this.setState({ list: data.content, total: data.totalElements });
        });

        Fetch.get(`${API_URL.fund.show}${user.sub}`).then(account => {
            this.setState({ account });
        });
    }

    changePage = page => {
        this.setState({
            page,
        }, () => {
            this.loadData();
        });
    };

    getColumns = () => [{
        title: '订单ID',
        dataIndex: 'nickname',
        key: 'nickname',
    }, {
        title: '订单价格',
        dataIndex: 'name',
        key: 'name2',
    }, {
        title: '购买人',
        dataIndex: 'name',
        key: 'name1',
    }, {
        title: '课程名',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '购买时间',
        dataIndex: 'phone',
        key: 'phone',
    }, {
        title: '收入',
        dataIndex: 'status',
        key: 'status',
    }];

    render() {
        return (
            <div>
                <Header current="userInfo" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <Sidebar current="1" />
                        </Col>
                        <Col span={20}>
                            <h4>总收入 {this.state.account.total} 可提现 {this.state.account.over}</h4>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.state.list}
                                pagination={{ total: this.state.total, onChange: this.changePage }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Account;
