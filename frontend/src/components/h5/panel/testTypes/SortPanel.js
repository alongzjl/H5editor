import React from 'react';
import Select from 'react-select';
import store from '../../../../store';
import WordModal from '../../modal/WordModal';
import {addElements, changeFocus, delElementId} from '../../../../actions/h5Actions';
import { changeSortAnswer, changeSortAnswerStyle } from '../../../../actions/testActions';
import SortQuestionModal from '../../modal/testTypes/SortQuestionModal';
import TestConfirmModal from '../../modal/testTypes/TestConfirmModal';
import './testCommon.less';
import TestModal from "../../modal/TestModal";


class Sort extends React.Component {

    state = {
        question_size: 0,
        answer_size:0,
        style_word: { height: '50px', width: '50px', textAlign: 'center', lineHeight: '50px', boxShadow: '2px 2px 4px rgba(0,0,0,.5)', borderRadius: '5px' },
        defaultTop: 150,
        defaultLeft: 50,
    };
   
    /* 添加填空*/
    addQuestion = () => {
    	const index = this.state.question_size;
    	const left = this.state.defaultLeft;
    	const top = this.state.defaultTop;
         if (index === 0) {
            store.dispatch(addElements(new SortQuestionModal({
                left: `${left}px`,
                top: `${top}px`,
            }, 1).plainObject()));
            store.dispatch(addElements(new SortQuestionModal({
                left: `${left + 100}px`,
                top: `${top}px`,
            }, 2).plainObject()));
            store.dispatch(addElements(new SortQuestionModal({
                left: `${left + 200}px`,
                top: `${top}px`,
            }, 3).plainObject()));
            store.dispatch(addElements(new WordModal('选项1', {
                left: `${left}px`,
                fontSize: '14px',
                top: `${top + 100}px`,
                ...this.state.style_word,
            }, 'sort').plainObject()));
            store.dispatch(addElements(new WordModal('选项2', {
                left: `${left + 100}px`,
                fontSize: '14px',
                top: `${top + 100}px`,
                ...this.state.style_word,
            }, 'sort').plainObject()));
            store.dispatch(addElements(new WordModal('选项3', {
                left: `${left + 200}px`,
                fontSize: '14px',
                top: `${top + 100}px`,
                ...this.state.style_word,
            }, 'sort').plainObject()));
			store.dispatch(addElements(new TestConfirmModal('sort').plainObject()));
			this.setState({question_size:index+3,answer_size:this.state.answer_size+3});
        } else {
            store.dispatch(addElements(new SortQuestionModal({
                left: `${left+100*(index%3)}px`,
                top: `${top + 80*(Math.ceil((index+1)/3)-1)}px`,
            }, index+1).plainObject()));
            this.setState({question_size:index+1});
        }
        store.dispatch(changeFocus(new TestModal().plainObject()));
    };
    /* 添加答案*/
    addAnswer = () => {
        const index = this.state.answer_size;
        store.dispatch(addElements(new WordModal(`选项${index + 1}`, {
            left: `${this.state.defaultLeft+100*(index%3)}px`,
            fontSize: '14px',
            top: `${this.state.defaultTop +160+ 60*(Math.floor(index/3)-1)}px`,
            ...this.state.style_word,
        }, 'sort').plainObject()));
        store.dispatch(changeFocus(new TestModal().plainObject()));
         this.setState({answer_size:index+1});
    };
    /* 删除*/
    deleteThis = (index, id) => {
        const newArr = this.state.size.filter(element => (element.name === 'SortQuestionModal') && (element.num !== index));
        this.setState({
            size: newArr,
        });
        store.dispatch(delElementId(id));
    };
    /* 排序*/
    sortNumber = () => {
        const answerList = this.props.page.elements.filter(element => element.name === 'WordModal');
        const length = answerList.length;
        const newArr = [];
        for (let i = 0; i < length; i++) {
            newArr.push(i);
        }
        newArr.sort((a, b) => 0.5 - Math.random());
        answerList.forEach((item, index) => {
            const obj = { left: answerList[newArr[index]].style.left, top: answerList[newArr[index]].style.top };
            store.dispatch(changeSortAnswerStyle(item.id, obj));
        });
    };
    render() {
        const answers = this.props.page.elements.filter(element => element.name === 'WordModal');
        const questions = this.props.page.elements.filter(element => element.name === 'SortQuestionModal');
        return (<div>
            <div className="join_test" onClick={this.addQuestion}>插入填空</div>
            <div className="join_test" onClick={this.addAnswer}>插入答案</div>
            <div className="join_test" onClick={this.sortNumber} style={{visibility:this.state.answer_size>0?'visible':'hidden'}}>打乱排序</div>
            {
               questions.map(item => <RightAnswer key={item.num} index={item.num} deleteThis={() => { this.deleteThis(item.num, item.id); }} answers={answers} sortId={item.id} />)
            }
        </div>);
    }
}
class RightAnswer extends React.Component {
    state = {
        rightAnswer: '',
    }
    delectThis = () => {
        this.props.deleteThis();
    };
    chooseQues = e => {
        this.setState({
            rightAnswer: e.value,
        });
        store.dispatch(changeSortAnswer(this.props.sortId, e.value));
    };

    render() {
        const answers = this.props.answers.map((item, index) => ({ value: item.text, label: item.text }));
        return (
            <div className="choose_question">
                <div className="left_question">
                    <span>{this.props.index}.</span>
                    <p>&nbsp;</p>
                </div>
                <div className="right_question">
                    <Select
                        name="form-field-name1"
                        value={this.state.rightAnswer}
                        onChange={this.chooseQues}
                        clearable={false}
                        searchable={false}
                        options={answers}
                    />
                    <span className="sort_span" onClick={this.delectThis}>×</span>
                </div>
            </div>
        );
    }
}

export default Sort;
