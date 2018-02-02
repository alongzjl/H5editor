import React from 'react';
import './fillBlanks.less';

export default class Sort extends React.Component {
    
    render() {
        const { value} = this.props;
         return (
                <div className="sortitem flex_row_start flex_vertical_middle" style={value.style}>
                    <div className="inputClass">{value.answerShow}</div>
                </div>
            );
     }
}
