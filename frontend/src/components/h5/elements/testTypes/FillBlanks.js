import React from 'react';
import Select from 'react-select';
import Rnd from '../../../common/rnd/ReactRnd';
import store from '../../../../store';
import { changeFocus } from '../../../../actions/h5Actions';
import { changeFillSelectList, checkQuestion } from '../../../../actions/testActions';
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
            userAnswer: e.value,
        });
        store.dispatch(checkQuestion(false));
    };
    render() {
        const { value, focusId, viewing, checking } = this.props;
        if (viewing) {
            let selectList = value.selectList.replace(/／/ig, '/');
            selectList = selectList.split('/');
            const correct = this.state.userAnswer === selectList[value.answerIndex];
            let options = [{ value: '', label: '请选择答案' }];
            options = options.concat(selectList.map(obj => ({ value: obj, label: obj })));
            return (
                <div style={{ ...value.style }} className={`${checking ? (correct ? '' : 'errorColor') : ''}`}>
                    <Select
                        name="form-field-name"
                        value={this.state.userAnswer}
                        style={{ color: `${checking ? (correct ? '' : 'red !important') : ''}` }}
                        onChange={this.changeUserAnswer}
                        clearable={false}
                        searchable={false}
                        options={options}
                    />
                </div>
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
