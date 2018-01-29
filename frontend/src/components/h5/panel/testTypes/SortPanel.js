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
import Noty from '../../../common/noty/noty';

class Sort extends React.Component {

    state = {
        question_size: 0,
        answer_size:0,
        style_word: { height: '50px', width: '50px', textAlign: 'center', lineHeight: '50px', boxShadow: '2px 2px 4px rgba(0,0,0,.5)', borderRadius: '5px' },
        defaultTop: 50,
        defaultLeft: 50
    };
   componentWillReceiveProps (nextProps) {
   		this.update(nextProps.page.elements);
   };
   componentWillMount () {
   		this.update(this.props.page.elements);
   };
   update = data => {
   		const answerNumber = data.filter(element => element.name === 'WordModal');
   		const questionNumber = data.filter(element => element.name === 'SortQuestionModal');
   		this.setState({
   			answer_size:answerNumber.length, 
   			question_size:questionNumber.length,
   			questions:questionNumber,
   			answers:answerNumber
   		})
   };
   join_sort = () => {
   	const elements = this.props.page.elements;
   	if (elements.find(element => element.name === 'TestConfirmModal')) {
   		this.state.question_size === 0 ?  Noty.error('一个页面只能设置一个题目！') : this.addQuestion() ;
        } else {
            this.addQuestion();
        }
   }
    /* 添加填空*/
    addQuestion = () => {
    	let index = this.state.question_size;
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
            }, 'sort',1).plainObject()));
            store.dispatch(addElements(new WordModal('选项2', {
                left: `${left + 100}px`,
                fontSize: '14px',
                top: `${top + 100}px`,
                ...this.state.style_word,
            }, 'sort',2).plainObject()));
            store.dispatch(addElements(new WordModal('选项3', {
                left: `${left + 200}px`,
                fontSize: '14px',
                top: `${top + 100}px`,
                ...this.state.style_word,
            }, 'sort',3).plainObject()));
			store.dispatch(addElements(new TestConfirmModal('sort').plainObject()));
			this.setState({question_size:index+3,answer_size:this.state.answer_size+3});
        } else {
        	const questions = this.state.questions.map(item => item.num);
        	questions.sort((a,b) => a>b);
        	for(var i = 0;i<questions.length; i++){
        		if(questions[i] !== i+1){
        			index = i;
        			break;
        		}
        	}
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
        let index = this.state.answer_size;
        const answers = this.state.answers.map(item => item.num);
        	answers.sort((a,b) => a>b);
        	for(var i = 0;i<answers.length; i++){
        		if(answers[i] !== i+1){
        			index = i;
        			break;
        		}
        	}
        store.dispatch(addElements(new WordModal(`选项${index + 1}`, {
            left: `${this.state.defaultLeft+100*(index%3)}px`,
            fontSize: '14px',
            top: `${this.state.defaultTop +160+ 60*(Math.floor(index/3)-1)}px`,
            ...this.state.style_word,
        }, 'sort',index+1).plainObject()));
        store.dispatch(changeFocus(new TestModal().plainObject()));
         this.setState({answer_size:index+1});
    };
    /* 删除*/ 
    deleteThis = (index, id) => {
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
        questions.sort((a,b) => a.num>b.num);
        return (<div>
            <div className="join_test" onClick={this.join_sort}>插入填空</div>
            <div className="join_test" onClick={this.addAnswer}>插入答案</div>
            <div className="join_test" onClick={this.sortNumber} style={{visibility:this.state.answer_size>0?'visible':'hidden'}}>打乱排序</div>
            {
               questions.map((item,index) => <RightAnswer key={index} index={item.num} question={item.answer} deleteThis={() => { this.deleteThis(item.num, item.id); }} answers={answers} sortId={item.id} />)
            } 
        </div>);
    }
}
class RightAnswer extends React.Component {
    state = {
        rightAnswer: this.props.question ? this.props.question : this.props.answers[0].text,
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
