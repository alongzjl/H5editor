import React from 'react';
import { connect } from 'react-redux';
import { addChoose, addChooseItems, changeSortAnswer } from '../../../../actions/testActions';
import { changeFocus, delElementId } from '../../../../actions/h5Actions';
import WordModal from '../../modal/WordModal';
import Noty from '../../../common/noty/noty';
import './ChooseItem.less';
import t from '../../../i18n';
import store from '../../../../store';
import TestModal from '../../modal/TestModal';

class ChooseItem extends React.Component {
    state = {
        answerArr: [''],
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
        const id = e.target.value;
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
        if (this.props.page.elements.some(element => (element.answer !== undefined && element.answer !== -1))) {
            Noty.error(t('choose_question_exist'));
        } else {
            this.props.addChooseClick();
        }
    };
    render() {
        const arr = this.props.page.elements.filter(element => element.name === 'WordModal' && (element.answer !== undefined && element.answer !== -1));
        const options = this.props.page.elements.filter(element => element.name === 'WordModal' && element.answer > -1);
        return (
            <div className="itemsBox">
                <div onClick={this.add} className="addChoose">插入选择题</div>
                <div onClick={() => { this.props.addItemsClick(options.length); }} className="addChooseItem">添加选项</div>
                <p className="addSubItem">正确答案：
                    <span onClick={this.subItem} className="subItem">-</span>
                    <span onClick={this.addItem} className="addItem">+</span>
                </p>
                <div className="answerList">
                    {
                        this.state.answerArr.map((item, key) =>
                            <select key={key} onChange={e => this.answerSelect(e, key)} className="answerSelect">
                                <option>请选择正确答案</option>
                                {
                                    options.map((val, index) => <option value={val.id} key={index}>{val.text}</option>)
                                }
                            </select>,
                        )
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
        let top = 210;

        const choose = new WordModal('编辑您的题目，下方的选项可以根据您的需求增加以及删除', {
            left: '32px',
            top: '140px',
            width: '340px',
            height: '52px',
            textAlign: 'left',
            position: 'absolute',
            fontSize: '16px',
        }, -2).plainObject();
        dispatch(addChoose(choose));

        this.select.forEach((val, key) => {
            content = `${index[key]}. ${val.item}`;
            top += 40;
            const item = new WordModal(content, {
                left: '32px',
                width: '340px',
                top: `${top}px`,
                textAlign: 'left',
                position: 'absolute',
                fontSize: '16px',
            }, val.answer).plainObject();
            dispatch(addChooseItems(item));
        });
        dispatch(changeFocus(new TestModal().plainObject()));
    },
    addItemsClick(num) {
        // 向select中添加一条选项，并刷新题目
        const obj = {
            item: ' 编辑答案',
            answer: 0,
        };
        const content = `${this.subscript[num]}. ${obj.item}`;
        const item = new WordModal(content, {
            left: '32px',
            width: '340px',
            top: `${210 + (num + 1) * 40}px`,
            textAlign: 'left',
            position: 'absolute',
            fontSize: '16px',
        }, obj.answer).plainObject();
        dispatch(addChooseItems(item));
        dispatch(changeFocus(new TestModal().plainObject()));
    },
});
export default connect(() => ({}), mapDispatchToProps)(ChooseItem);

