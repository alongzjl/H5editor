import React from 'react';
import Select from 'react-select';
import Rnd from '../../../common/rnd/ReactRnd';
import store from '../../../../store';
import { changeFocus,changeWordEditable } from '../../../../actions/h5Actions';
import { changeFillSelectList, checkQuestion,changeFillChooseIndex} from '../../../../actions/testActions';
import getPosition from '../getPosition';
import './fillBlanks.less';

export default class FillBlanks extends React.Component {
    state = {
        index: 0
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
        store.dispatch(changeWordEditable(id, false));
        this.fillBlankModal.contentEditable = false;
    };
    changeUserAnswer = (e,id,index) => {
        store.dispatch(changeFillChooseIndex(id, index));
    };
    changeFillBlankModal = () => {
    	 store.dispatch(changeWordEditable(this.props.value.id, true));
    		this.fillBlankModal.contentEditable = true;
    }; 
    
    render() {
        const { value, focusId, viewing, checking,contenteditable,isTeacher,rightOrColor } = this.props;
         if (viewing) {
            let selectList = value.selectList.replace(/／/ig, '/');
            selectList = selectList.split('/');
            const value_show = value.chooseIndex;
             return (
                <div style={{ ...value.style }}> 
                      <div className="fillBlankItem">
	                    <input className="inputClass" disabled value={selectList[value_show]} style={{color:value.style.color}} />
	                    <div className="addSelect"> 
	                    	{
	                    		selectList.map( (item,index) => <span key={index} className="tiankongAlong" ><span style={{color : isTeacher&&value.answerIndex === index ? rightOrColor.right : rightOrColor.common}} onClick={e => !isTeacher ? this.changeUserAnswer(e,value.id,index) : null}>{item}</span><span >&nbsp;/&nbsp;</span></span>)
	                    	}
	                    </div> 
	                </div> 
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
                <div className="fillBlankItem">
                    <span className="index">{value.num}</span>
                    <input className="inputClass" disabled />
                    <div
                        className="addSelect"
                        ref={com => { this.fillBlankModal = com; }}
                        onDoubleClick={this.changeFillBlankModal}
                        onBlur={args => this.addSelectList(value.id, args)}
                    >
                        {value.selectList}
                    </div>
                </div>
            </Rnd>
        );
    }
}
