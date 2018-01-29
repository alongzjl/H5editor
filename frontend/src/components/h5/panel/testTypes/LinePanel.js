import React from 'react';
import { connect } from 'react-redux';
import { addLineQuestion, changeLineQuestionSort, autoChangeLineQuestionSort } from '../../../../actions/testActions';
import './linePanel.less';
import LineQuestionModal from '../../modal/testTypes/LineQuestionModal';
import TestConfirmModal from '../../modal/testTypes/TestConfirmModal';
import { addElements } from '../../../../actions/h5Actions';
import Noty from '../../../common/noty/noty';

class LinePanel extends React.Component {
    state = {
        sort: 'column'
    };
    changeSort = sort => {
        this.setState({
            sort,
        });
        this.props.changeSort(sort);
    };
    addLineObj = () => {
    	const elements = this.props.page.elements;
    	const lineList=elements.filter(element => element.name === 'LineQuestionModal' || element.name === 'ImageModal');
    	  if (elements.find(element => element.name === 'TestConfirmModal')) {
	  		elements.filter(element => element.name === 'LineQuestionModal').length === 0 ?  Noty.error('一个页面只能设置一个题目！') : this.props.add(lineList);
         } else {
           this.props.add(lineList);
        }
    }
    render() {
        const sort = this.state.sort;
        const lineList=this.props.page.elements.filter(element => element.name === 'LineQuestionModal' || element.name === 'ImageModal');
        return (
            <div className="linePanel">
                <button className="insertBtn fs14" onClick={this.addLineObj}>插入对象</button>
                <div style={{ visibility: lineList.length > 0 ? 'visible' : 'hidden' }}>
                    <button className="insertBtn fs14" onClick={() => this.props.autoOrder(sort)}>随机排布</button>
                    <div>
                        <img src={require(`../images/column_order${sort === 'column' ? '_highlight' : ''}.png`)} alt="" onClick={() => this.changeSort('column')} />
                        <img src={require(`../images/row_order${sort === 'row' ? '_highlight' : ''}.png`)} alt="" onClick={() => this.changeSort('row')} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    add(lineList) {
    	lineList = lineList.map(item => item.num).filter((item,index) => index%2 === 0 );
    	lineList.sort((a,b) => a-b>0 );
    	let num = lineList.length === 0 ?  1 : lineList[lineList.length-1]+1;
    	for(var i = 0; i< lineList.length; i++){
    		if(lineList[i] !== i+1){
    			num = i+1;
    			break;
    		}
    	};
    	const top = 50 + (50 * (num - 1));
        const line1 = new LineQuestionModal(num, '双击编辑文字', { left: '65px', top: `${top}px` }, 'left').plainObject();
        const line2 = new LineQuestionModal(num, '长按插入图片', { left: '215px', top: `${top}px` }, 'right').plainObject();
		line1.to = line2.id;
        line2.to = line1.id;
		dispatch(addLineQuestion(line1));
        dispatch(addLineQuestion(line2));
        num === 1 ? dispatch(addElements(new TestConfirmModal('line').plainObject())) : null;
        
    },
    changeSort(sort) {
        dispatch(changeLineQuestionSort(sort));
    },
    autoOrder(sort) {
        dispatch(autoChangeLineQuestionSort(sort));
    },
});
export default connect(() => ({}), mapDispatchToProps)(LinePanel);
