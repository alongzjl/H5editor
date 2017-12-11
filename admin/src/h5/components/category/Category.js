import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, message, Row, Col, Icon } from 'antd';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import Header from '../../../common/header/Header';
import store from '../../../store';
import ImageSidebar from '../image/Sidebar';
import AudioSidebar from '../audio/Sidebar';
import { changeCategories, changeCategory } from '../../actions/categoryActions';
import CategoryFormModal from './CategoryFormModal';

class Category extends React.Component {
    state = {
        selects: [],
    };

    componentDidMount = () => {
        this.loadData();
    };

    loadData = () => {
        const url = `${API_URL.category.list}?type=${this.props.params.type}`;
        Fetch.get(url).then(data => {
            store.dispatch(changeCategories(data));
        });
    };

    add = parentId => {
        store.dispatch(changeCategory(typeof parentId === 'number' ? { parent_id: parentId } : {}));
        this.modal.show();
    };

    update = record => {
        store.dispatch(changeCategory(record));
        this.modal.show();
    };

    del = post => {
        Fetch.del(`${API_URL.category.del}${post.id}`, {}).then(() => {
            message.success('删除成功');
            this.loadData();
        });
    };

    delAll = () => {
        if (this.state.selects.length === 0) {
            message.error('请至少选择一项进行删除！');
            return;
        }
        Fetch.put(API_URL.category.batchDel, { ids: this.state.selects }).then(() => {
            message.success('删除成功');
            this.loadData();
        });
    };

    getColumns = () => [{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '序号',
        dataIndex: 'categoryNo',
        key: 'categoryNo',
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
            <span>
                <a
                    href="javascript:void(0)" onClick={this.update.bind(this, record)}
                >修改</a>
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
                <Header current={this.props.params.type} />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            {
                                this.props.params.type === 'image' ? <ImageSidebar current="category" /> : <AudioSidebar current="category" />
                            }
                        </Col>
                        <Col span={20}>
                            <Button type="primary" onClick={this.add}>
                                <Icon type="plus" /> 新建
                            </Button>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.props.categories}
                                del={this.del}
                                rowKey="id"
                                pagination={false}
                            />
                            <CategoryFormModal
                                type={this.props.params.type}
                                category={this.props.category}
                                reload={this.loadData}
                                ref={com => { this.modal = com; }}
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
        categories: store.categoryState.categories,
        category: store.categoryState.category,
    };
};

export default connect(mapStateToProps)(Category);
