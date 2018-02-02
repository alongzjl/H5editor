import React from 'react';
import Rnd from '../../../common/rnd/ReactRnd';
import store from '../../../../store';
import { changeFocus,changeWordEditable } from '../../../../actions/h5Actions';
import { changeFillSelectList, checkQuestion} from '../../../../actions/testActions';
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
    changeFillBlankModal = () => {
    	 store.dispatch(changeWordEditable(this.props.value.id, true));
    		this.fillBlankModal.contentEditable = true;
    }; 
    
    render() {
        const { value, focusId} = this.props;
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
