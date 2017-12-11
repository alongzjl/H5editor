import React from 'react';
import { connect } from 'react-redux';
import { addLineQuestion, changeLineQuestionSort, autoChangeLineQuestionSort } from '../../../../actions/testActions';
import './linePanel.less';
import LineQuestionModal from '../../modal/testTypes/LineQuestionModal';

class LinePanel extends React.Component {
    state = {
        sort: 'column',
    };
    changeSort = sort => {
        this.setState({
            sort,
        });
        this.props.changeSort(sort);
    };
    render() {
        const sort = this.state.sort;
        return (
            <div className="linePanel">
                <button className="insertBtn fs14" onClick={() => { this.props.add((this.props.size / 2) + 1); }}>插入对象</button>
                <button className="insertBtn fs14" onClick={() => this.props.autoOrder(sort)}>随机排布</button>
                <div>
                    <img src={require(`../images/column_order${sort === 'column' ? '_highlight' : ''}.png`)} alt="" onClick={() => this.changeSort('column')} />
                    <img src={require(`../images/row_order${sort === 'row' ? '_highlight' : ''}.png`)} alt="" onClick={() => this.changeSort('row')} />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    add(num) {
        const line1 = new LineQuestionModal(num, '双击编辑文字', { left: '65px', top: '100px' }, 'left').plainObject();
        const line2 = new LineQuestionModal(num, '长按插入图片', { left: '215px', top: '100px' }, 'right').plainObject();

        line1.to = line2.id;
        line2.to = line1.id;

        dispatch(addLineQuestion(line1));
        dispatch(addLineQuestion(line2));
    },
    changeSort(sort) {
        dispatch(changeLineQuestionSort(sort));
    },
    autoOrder(sort) {
        dispatch(autoChangeLineQuestionSort(sort));
    },
});
export default connect(() => ({}), mapDispatchToProps)(LinePanel);
