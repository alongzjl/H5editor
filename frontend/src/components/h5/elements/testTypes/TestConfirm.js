import React from 'react';
import store from '../../../../store';
import { changeSortQuestionStyle } from '../../../../actions/testActions';
import './fillBlanks.less';

export default class TestConfirm extends React.Component {
    chooseRight = () => {
        const sortList = this.props.sort;
        const sortQuestions = sortList.filter(item => item.name === 'SortQuestionModal');
        const correct = sortQuestions.every(item => item.answer !== '' && item.answer === item.answerShow);
        const color = correct ? 'green' : 'red';
        store.dispatch(changeSortQuestionStyle({ color }));
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
