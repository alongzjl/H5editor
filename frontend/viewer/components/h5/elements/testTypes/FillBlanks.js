import React from 'react';
import store from '../../../../store';
import { changeFillChooseIndex} from '../../../../actions/testActions';
import getPosition from '../getPosition';
import './fillBlanks.less';
 
export default class FillBlanks extends React.Component {
    
    changeUserAnswer = (e,id,index) => {
        store.dispatch(changeFillChooseIndex(id, index));
    };
    
    render() {
        const { value, contenteditable,isTeacher,rightOrColor } = this.props;
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
}
