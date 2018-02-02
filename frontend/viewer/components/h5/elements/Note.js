/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import './word.less';
import remarkImg from './images/remarked.png';

export default class Note extends React.Component {
    state = {
        hidden: true,
    };

    toggleNote = () => {
        this.setState((prev, props) => ({ hidden: !prev.hidden }));
    };

    render() {
        const { value } = this.props;
	  return (
                <div style={{ ...value.style, width: 'auto' }}>
                    <img src={remarkImg} onClick={this.toggleNote} />
                    {
                        !this.state.hidden && <div style={{position:'absolute',height:'30px',lineHeight:'30px',width:'280px',right:'40px',top:0,textAlign:'right'}}>{value.text}</div>
                    }
                </div>
            );
      }
}
