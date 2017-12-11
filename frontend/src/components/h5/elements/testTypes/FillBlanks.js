import React from 'react';
import Rnd from '../../../common/rnd/ReactRnd';
import store from '../../../../store';
import { changeFocus } from '../../../../actions/h5Actions';
import { changeFillSelectList } from '../../../../actions/testActions';
import getPosition from '../getPosition';
import './fillBlanks.less';

export default class FillBlanks extends React.Component {
    state = {
        index: 0,
        userAnswer: '',
    };
    onClicked = e => {
        e.stopPropagation();
        store.dispatch(changeFocus(this.props.value));
    };
    componentWillReceiveProps() {
        this.setState({
            index: 0,
        });
    }
    addSelectList = (id, e) => {
        store.dispatch(changeFillSelectList(id, e.target.textContent));
    };
    changeUserAnswer = e => {
        this.setState({
            userAnswer: e.target.value,
        });
    };
    render() {
        const { value, focusId, viewing } = this.props;
        if (viewing) { 
            let selectList = value.selectList.replace(/／/ig, '/');
            selectList = selectList.split('/');
            const error = this.state.userAnswer !== '' && this.state.userAnswer === selectList[value.answerIndex];
            return (
                <select
                    className={`fillBlankViewing ${error ? 'errorColor' : ''}`}
                    style={{ ...value.style }}
                    value={this.state.userAnswer}
                    onChange={this.changeUserAnswer}
                >
                    <option value="">请选择答案</option>
                    {
                        selectList.map(obj => <option value={obj} key={obj}>
                            {obj}
                        </option>)
                    }
                </select>
            );
        }
        return (
            <Rnd
                onDragStart={this.onClicked}
                className={focusId === value.id ? 'focused' : ''}
                isDraggable
                style={value.style}
                initial={getPosition(value.style)}
            >
                <div className="fillBlankItem flex_row_start flex_vertical_middle">
                    <span className="index">{value.num}</span>
                    <input className="inputClass" disabled />
                    <div
                        className="addSelect"
                        contentEditable
                        onBlur={args => this.addSelectList(value.id, args)}
                    >
                        {value.selectList}
                    </div>
                </div>
            </Rnd>
        );
    }
}
