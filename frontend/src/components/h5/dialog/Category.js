import React from 'react';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import './category.less';

export default class Category extends React.Component {
    state = {
        categories: [{
            id: 0,
            name: '全部',
            value: '全部',
        }, {
            id: -1,
            name: '最新',
            value: '最新',
        }],
        category: '',
    };
    onClick = item => {
        this.setState({
            category: item.name,
        });
        this.props.onClick && this.props.onClick(item);
    };
    componentDidMount() {
        Fetch.get(`${API_URL.category.list}?type=${this.props.type}`).then(data => {
            this.setState({
                categories: this.state.categories.concat(data),
            });
        });
    }
    render() {
        return (
            <div className="categories">
                {
                    this.state.categories.map(item =>
                        <button
                            key={item.name}
                            className={`${this.state.category === item.name ? 'select' : ''}`}
                            onClick={() => this.onClick(item)}
                        >
                            {item.name}
                        </button>,
                    )
                }
            </div>
        );
    }
}
