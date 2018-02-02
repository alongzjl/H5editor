import React from 'react';
import { connect } from 'react-redux';
import { addChoose, addChooseItems, changeSortAnswer } from '../../../../actions/testActions';
import { addElements, changeFocus, delElementId } from '../../../../actions/h5Actions';
import WordModal from '../../modal/WordModal';
import Noty from '../../../common/noty/noty';
import './ChooseItem.less';
import t from '../../../i18n';
import store from '../../../../store';
import TestModal from '../../modal/TestModal';
import TestConfirmModal from '../../modal/testTypes/TestConfirmModal';
import Select from 'react-select';


class ChooseItem extends React.Component {
    state = {
        answerArr: [''],
    };
    componentDidMount() {
    	let answer_show_arr = this.props.page.elements.filter(element => element.name === 'WordModal' && element.answer === 1);
    	answer_show_arr = answer_show_arr.map(item=>{return item.id});
    	answer_show_arr.length > 0 ? (this.setState({
    		answerArr:answer_show_arr
    	})) : null;
    };
    addItem = () => {
        // 向当前选择题中插入一条正确答案
        const array = this.state.answerArr;
        array.push('');
        this.setState({
            answerArr: array,
        });
    };
    subItem = () => {
        // 从当前选择题中删除最后一条正确答案
        if (this.state.answerArr.length === 1) {
            Noty.error('至少保留一个正确答案');
            return;
        }
        const array = this.state.answerArr;
        const id = array.pop();
        if (id !== '') {
            store.dispatch(changeSortAnswer(id, 0));
            store.dispatch(changeFocus(new TestModal().plainObject()));
        }
        this.setState({
            answerArr: array,
        });
    };
    answerSelect = (e, index) => {
        // 下拉选择，当前值为正确答案，isAnswer为true
        const id = e.value;
        if (this.state.answerArr[index] !== id) {
            this.setState({
                answerArr: this.state.answerArr.map((item, i) => index === i ? id : item),
            });
            if (this.state.answerArr[index] !== '') {
                store.dispatch(changeSortAnswer(this.state.answerArr[index], 0));
            }
            store.dispatch(changeSortAnswer(id, 1));
        }
        store.dispatch(changeFocus(new TestModal().plainObject()));
    };
    delSpan = id => {
        // 删除当前选项
        store.dispatch(delElementId(id));
    };
    add = () => {
    	const elements = this.props.page.elements;
        if (elements.find(element => element.name === 'TestConfirmModal')) {
            Noty.error('一个页面只能设置一个题目！');
        } else {
            this.props.addChooseClick();
        }
    };
    render() {
        const arr = this.props.page.elements.filter(element => element.name === 'WordModal' && (element.answer !== undefined && element.answer !== -1));
        let fillOptions = this.props.page.elements.filter(element => element.name === 'WordModal' && element.answer > -1);
        fillOptions = fillOptions.map(item => ({ value: item.id, label: item.text,num:item.num }));
        return (
            <div className="itemsBox">
                <div onClick={this.add} className="addChoose">插入选择题</div>
                <div onClick={() => { this.props.addItemsClick(fillOptions.map(item=>item.num)); }} className="addChooseItem">添加选项</div>
                <div style={{ visibility: arr.length > 0 ? 'visible' : 'hidden' }}>
                    <p className="addSubItem">正确答案：
                        <span onClick={this.subItem} className="subItem">-</span>
                        <span onClick={this.addItem} className="addItem">+</span>
                    </p>

                    {
                        this.state.answerArr.map((item, key) =>
                            <div key={key}>
                                <Select
                                    name="form-field-name1"
                                    onChange={e => this.answerSelect(e, key)}
                                    clearable={false}
                                    searchable={false}
                                    placeholder="请选择"
                                    value={this.state.answerArr[key]}
                                    className="answerSelect"
                                    options={fillOptions}
                                />
                            </div>)
                    }
                </div>
                {
                    arr.map((val, key) => <p key={key} className="answerItem">{val.text}<span onClick={() => { this.delSpan(val.id); }} className="delSpan" /></p>)
                }
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    select: [{
        item: ' 编辑答案',
        answer: 0,
    },
    {
        item: ' 编辑答案',
        answer: 0,
    },
    {
        item: ' 编辑答案',
        answer: 0,
    },
    {
        item: ' 编辑答案',
        answer: 0,
    }],
    subscript: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
    addChooseClick() {
        const index = this.subscript;
        let content = '';
        let top = 110;
		const color = '#7B818F';
        const choose = new WordModal('编辑您的题目，下方的选项可以根据您的需求增加以及删除', {
            left: '32px',
            top: '40px',
            width: '310px',
            height: '52px',
            textAlign: 'left',
            position: 'absolute',
            fontSize: '16px',
            color,
        }).plainObject();
        dispatch(addChoose(choose));

        this.select.forEach((val, key) => {
            content = `${index[key]}. ${val.item}`;
            top += 40;
            const item = new WordModal(content, {
                left: '32px',
                width: '310px',
                top: `${top}px`,
                textAlign: 'left',
                position: 'absolute',
                fontSize: '16px',
                color,
            }, val.answer,key+1).plainObject();
            dispatch(addChooseItems(item));
        });
        store.dispatch(addElements(new TestConfirmModal('choose').plainObject()));
        dispatch(changeFocus(new TestModal().plainObject()));
    },
    addItemsClick(fillList) {
        // 向select中添加一条选项，并刷新题目
        let num = fillList.length;
         const obj = {
            item: ' 编辑答案',
            answer: 0,
        };
        fillList.sort((a,b)=> a>b);
        for(var i = 0;i<fillList.length;i++){
        	if(fillList[i] !== i+1){
        		num = i;
        		break;
        	}
        }
        const color = '#7B818F';
        const content = `${this.subscript[num]}. ${obj.item}`;
        const item = new WordModal(content, {
            left: '32px',
            width: '310px',
            top: `${110 + (num + 1) * 40}px`,
            textAlign: 'left',
            position: 'absolute',
            fontSize: '16px',
            color,
        }, obj.answer,num+1).plainObject();
        dispatch(addChooseItems(item));
        dispatch(changeFocus(new TestModal().plainObject()));
    },
});
export default connect(() => ({}), mapDispatchToProps)(ChooseItem);

