import React from 'react';
import store from '../../../../store';
import WordModal from '../../modal/WordModal';
import { addElements, delElementId } from '../../../../actions/h5Actions';
import { changeSortAnswer, changeSortAnswerStyle } from '../../../../actions/testActions';
import SortQuestionModal from '../../modal/testTypes/SortQuestionModal';
import TestConfirmModal from '../../modal/testTypes/TestConfirmModal';

import './testCommon.less';


class Sort extends React.Component {

    state = {
        size: this.props.page.elements.filter(element => element.name === 'SortQuestionModal'),
        style_word: { height: '50px', width: '50px', textAlign: 'center', lineHeight: '50px', boxShadow: '2px 2px 4px rgba(0,0,0,.5)', borderRadius: '5px' },
        defaultTop: 150,
        defaultLeft: 50,
    };
    componentWillReceiveProps() { // 属性变化时
        this.setState({
            size: this.props.page.elements.filter(element => element.name === 'SortQuestionModal'),
        });
    }
    /* 添加填空*/
    addQuestion = () => {
        const index = this.state.size.length;
        if (index === 0) {
            store.dispatch(addElements(new SortQuestionModal({
                left: `${this.state.defaultLeft}px`,
                top: `${this.state.defaultTop}px`,
            }, 1).plainObject()));
            store.dispatch(addElements(new SortQuestionModal({
                left: `${this.state.defaultLeft + 100}px`,
                top: `${this.state.defaultTop}px`,
            }, 2).plainObject()));
            store.dispatch(addElements(new SortQuestionModal({
                left: `${this.state.defaultLeft + 200}px`,
                top: `${this.state.defaultTop}px`,
            }, 3).plainObject()));
            store.dispatch(addElements(new WordModal('选项1', {
                left: `${this.state.defaultLeft}px`,
                top: `${this.state.defaultTop + 100}px`,
                ...this.state.style_word,
            }).plainObject()));
            store.dispatch(addElements(new WordModal('选项2', {
                left: `${this.state.defaultLeft + 100}px`,
                top: `${this.state.defaultTop + 100}px`,
                ...this.state.style_word,
            }).plainObject()));
            store.dispatch(addElements(new WordModal('选项3', {
                left: `${this.state.defaultLeft + 200}px`,
                top: `${this.state.defaultTop + 100}px`,
                ...this.state.style_word,
            }).plainObject()));

            store.dispatch(addElements(new TestConfirmModal().plainObject()));
        } else {
            store.dispatch(addElements(new SortQuestionModal({
                left: `${this.state.defaultLeft}px`,
                top: `${this.state.defaultTop + 80}px`,
            }, index + 1).plainObject()));
        }
    };
    /* 添加答案*/
    addAnswer = () => {
        const index = this.state.size.length;
        store.dispatch(addElements(new WordModal(`选项${index + 1}`, {
            left: `${this.state.defaultLeft}px`,
            top: `${this.state.defaultTop + 160}px`,
            ...this.state.style_word,
        }).plainObject()));
    };
    /* 删除*/
    deleteThis = (index, id) => {
        const new_arr = this.state.size.filter(element => (element.name === 'SortQuestionModal') && (element.num !== index));
        this.setState({
            size: new_arr,
        });
        store.dispatch(delElementId(id));
    };
    /* 排序*/
    sortNumber = () => {
        const answer_list = this.props.page.elements.filter(element => element.name === 'WordModal');
        const length = answer_list.length;
        const new_arr = [];
        for (let i = 0; i < length; i++) {
            new_arr.push(i);
        }
        new_arr.sort((a, b) => 0.5 - Math.random());
        answer_list.forEach((item, index) => {
            const obj = { left: answer_list[new_arr[index]].style.left, top: answer_list[new_arr[index]].style.top };
            store.dispatch(changeSortAnswerStyle(item.id, obj));
        });
    };
    render() {
        const answers = this.props.page.elements.filter(element => element.name === 'WordModal');
        return (<div>
            <div className="join_test" onClick={this.addQuestion}>插入填空</div>
            <div className="join_test" onClick={this.addAnswer}>插入答案</div>
            <div className="join_test" onClick={this.sortNumber}>打乱排序</div>
            {
                this.state.size.map(item => <RightAnswer key={item.num} index={item.num} deleteThis={() => { this.deleteThis(item.num, item.id); }} answers={answers} sortId={item.id} />)
            }
        </div>);
    }
}
class RightAnswer extends React.Component {
    delectThis = () => {
        this.props.deleteThis();
    };
    chooseQues = e => {
        store.dispatch(changeSortAnswer(this.props.sortId, e.target.value));
    };
    render() {
        return (
            <div className="choose_question">
                <div className="left_question">
                    <span>{this.props.index}.</span>
                    <p>&nbsp;</p>
                </div>
                <div className="right_question">
                    <select onChange={this.chooseQues}>
                        <option value="">请选择答案</option>
                        {
                            this.props.answers.map((item, index) => <option key={index} value={item.text}>{item.text}</option>)
                        }
                    </select>
                    <span onClick={this.delectThis}>×</span>
                </div>
            </div>
        );
    }
}

export default Sort;
