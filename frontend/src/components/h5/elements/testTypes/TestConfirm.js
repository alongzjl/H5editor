import React from 'react';
import store from '../../../../store';
import { changeSortQuestionStyle, checkQuestion } from '../../../../actions/testActions';
import './fillBlanks.less';

export default class TestConfirm extends React.Component {
    correctSort = () => {
        const sortList = this.props.sort;
        const sortQuestions = sortList.filter(item => item.name === 'SortQuestionModal');
        const correct = sortQuestions.every(item => item.answer !== '' && item.answer === item.answerShow);
        const color = correct ? 'green' : 'red';
        store.dispatch(changeSortQuestionStyle({ color }));
    };
    chooseRight = () => {
        const title = this.props.value.title;
        if (title === 'sort') {
            this.correctSort();
        } else {
            store.dispatch(checkQuestion(true));
        }
    };
    render() {
        const { viewing } = this.props;
        if (viewing) {
            return <div className="TestConfirm" onClick={this.chooseRight}>确定</div>;
        }
        return (
            <div className="TestConfirm">确定</div>
        );
    }
}
