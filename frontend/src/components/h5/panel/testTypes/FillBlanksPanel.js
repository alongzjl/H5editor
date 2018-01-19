import React from 'react';
import { addElements, changeFocus, delElement } from '../../../../actions/h5Actions';
import { changeFillAnswerIndex, changeFillNum } from '../../../../actions/testActions';
import store from '../../../../store';
import FillBlanksModal from '../../modal/testTypes/FillBlanksModal';
import WordModal from '../../modal/WordModal';
import './FillBlanksPanel.less';
import TestConfirmModal from '../../modal/testTypes/TestConfirmModal';
import TestModal from '../../modal/TestModal';
import Select from 'react-select';


class FillBlanks extends React.Component {
    insertFillItem = () => {
        const size = this.props.page.elements.filter(element => element.name === 'FillBlanksModal').length;
        const defaultTop = 50;
        if (size === 0) {
            const color = '#7B818F';
            store.dispatch(addElements([
                new WordModal('点击插入填空', { left: '50px', top: `${defaultTop + 5}px`, position: 'absolute', color:`${color}`, fontSize: '14px' }).plainObject(),
                new FillBlanksModal({ left: '145px', top: `${defaultTop}px` }, 1, '可／增加').plainObject(),
                new FillBlanksModal({ left: '50px', top: `${defaultTop + 50}px` }, 2, '根据／需求').plainObject(),
                new WordModal('增减文字填空', { left: '230px', top: `${defaultTop + 5 + 50}px`, position: 'absolute',  color:`${color}`, fontSize: '14px' }).plainObject(),
                new FillBlanksModal({ left: '50px', top: `${defaultTop + 100}px` }, 3, '改变／文字').plainObject(),
            ]));
            store.dispatch(addElements(new WordModal('位置及大小', { left: '230px', top: `${defaultTop + 5 + 100}px`, position: 'absolute',  color:`${color}`, fontSize: '14px' }).plainObject()));
            store.dispatch(addElements(new TestConfirmModal('blank').plainObject()));
            store.dispatch(changeFocus(new TestModal().plainObject()));
        } else {
            store.dispatch(addElements(new FillBlanksModal({ left: '50px', top: `${defaultTop + (50 * size)}px` }, size + 1).plainObject()));
        }
    };
    deleteElements = id => {
        store.dispatch(delElement(id));
        const fillItems = this.props.page.elements.filter(element => element.name === 'FillBlanksModal' && element.id !== id);
        fillItems.forEach((obj, index) => {
            store.dispatch(changeFillNum(obj.id, index + 1));
        });
    };
    changeAnswer = (id, e) => {
        const fillItems = this.props.page.elements.filter(element => element.name === 'FillBlanksModal');
        let selectList = fillItems.find(item => item.id === id).selectList.replace(/／/ig, '/');
        selectList = selectList.split('/');
        store.dispatch(changeFillAnswerIndex(id, selectList.findIndex(item => item === e.value)));
    };
    render() {
        const fillItems = this.props.page.elements.filter(element => element.name === 'FillBlanksModal');
        return (
            <div className="fillBlanks">
                <button className="insertBtn fs14" onClick={this.insertFillItem}>插入填空题</button>
                {
                    fillItems.map((item, index) => <FillItem
                        item={item} key={`item${index}`}
                        onChange={args => this.changeAnswer(item.id, args)}
                        onDelete={this.deleteElements}
                    />)
                }
            </div>
        );
    }
}

export default FillBlanks;

const FillItem = ({ item, onChange = () => {}, onDelete = () => {} }) => {
    let selectList = item.selectList.replace(/／/ig, '/');
    selectList = selectList.split('/').map(item => ({ value: item, label: item }));
    return (
        <div className="fillItem flex_row_center flex_vertical_middle">
            <div className="inputDiv flex_row_center flex_vertical_middle">
                {item.num}.
                <input disabled />
            </div>
            <Select
                name="form-field-name1"
                onChange={onChange}
                value={selectList[item.answerIndex]}
                clearable={false}
                searchable={false}
                options={selectList}
            />
            <button className="delButton" onClick={() => onDelete(item.id)} />
        </div>
    );
};
