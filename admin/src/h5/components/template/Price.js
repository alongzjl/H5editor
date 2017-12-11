import React from 'react';
import { Icon, Button, Input, Form, message } from 'antd';

const FormItem = Form.Item;
const createForm = Form.create;

class PriceForm extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            name: value.name,
            note: value.note,
            fee: value.fee,
            vipFee: value.vipFee,
        };
    }

    del = () => {
        this.props.del(this.props.index);
    };

    onFeeChange = e => {
       // this.setState({ fee: e.target.value });
        this.triggerChange({ fee: e.target.value });
    };

    onVipFeeChange = e => {
        // this.setState({ fee: e.target.value });
        this.triggerChange({ vipFee: e.target.value });
    };

    onNoteChange = e => {
        // this.setState({ note: e.target.value });
        this.triggerChange({ note: e.target.value });
    };

    onNameChange = e => {
        // this.setState({ name: e.target.value });
        this.triggerChange({ name: e.target.value });
    };

    triggerChange = changedValue => {
        const newValue = Object.assign({}, this.state, changedValue);
        this.props.onChange(this.props.index, newValue);
    };

    componentWillReceiveProps = nextProps => {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    render() {
        return (
            <span>
                <Input placeholder="套餐名称" className="price" value={this.state.name} onChange={this.onNameChange} />
                <Input placeholder="价格" className="price" value={this.state.fee} onChange={this.onFeeChange} />
                <Input placeholder="会员价格" className="price" value={this.state.vipFee} onChange={this.onVipFeeChange} />
                <Input placeholder="套餐说明" className="price" value={this.state.note} onChange={this.onNoteChange} />
                <Icon type="minus-circle-o" className="dynamic-delete-button" onClick={this.del} />
            </span>
        );
    }
}


const Price = React.createClass({
    getInitialState() {
        return {
            prices: this.props.value,
        };
    },

    del(index) {
        const prices = this.state.prices;
        if (prices.length === 1) {
            message.error('至少保留一条价格信息!');
            return;
        }
        prices.splice(index, 1);
        this.setState({ prices });
        this.props.onChange(prices);
    },

    update(currentIndex, value) {
        const newPrices = this.state.prices.map((price, index) => {
            if (index === currentIndex) {
                return value;
            }
            return price;
        });
        this.setState({ prices: newPrices });
        this.props.onChange(newPrices);
    },

    add() {
        if (this.valid()) {
            const newPrice = {
                id: '',
                name: '',
                fee: '',
                vipFee: '',
                note: '',
            };
            const arr = this.state.prices.concat([newPrice]);
            this.setState({
                prices: arr,
            });
            this.props.onChange(arr);
        }
    },

    valid() { // 验证价格是否为空
        const prices = this.state.prices;

        if (prices.length >= 5) {
            message.warning('最多只能添加5个价格!');
            return false;
        }

        for (const price of prices) {
            if (price.fee === '') {
                message.warning('价格不能为空!');
                return false;
            }
            if (price.vipFee === '') {
                message.warning('会员价格不能为空!');
                return false;
            }
            if (price.name === '') {
                message.warning('套餐名称不能为空!');
                return false;
            }
        }
        return true;
    },

    render() {
        const formItems = this.state.prices.map((price, index) => (<PriceForm
            index={index}
            del={this.del}
            value={price}
            key={index}
            onChange={this.update}
        />));

        return (
            <div>
                {formItems}
                <Button type="dashed" onClick={this.add} className="priceBtn">
                    <Icon type="plus" />新增
                </Button>
            </div>
        );
    },
});


export { Price as default };
