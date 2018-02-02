/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { Line, Layer, Stage } from 'react-konva';
import Word from './Word';
import Image from './Image';
import Sort from './testTypes/Sort';
import FillBlanks from './testTypes/FillBlanks';
import TestConfirm from './testTypes/TestConfirm';
import Audio from './Audio';

import Video from './Video';
import Shape from './Shape';
import Note from './Note';

import store from '../../../store';
import { changeFocus } from '../../../actions/h5Actions';
import './page.less';
import LineQuestion from './testTypes/LineQuestion';
import Highlight from './Highlight';
import TestModal from '../modal/TestModal';
import {changeSortAnswerStyle,changeLineShow } from '../../../actions/testActions';
 
/**
 * @param viewing 是否正在浏览
 */
class Page extends React.Component {
    handleClick = e => {
        const { page = { elements: [], style: {} }, viewing = false } = this.props;
        if (e.target === e.currentTarget) {// 防止捕获其它onclick事件
            for (const element of page.elements) {
                if (element.name === 'FillBlanksModal' || element.name === 'SortQuestionModal' || element.name === 'LineQuestionModal') {
                	 store.dispatch(changeFocus(new TestModal().plainObject()));
                    return; 
                } else if (element.name === 'WordModal' && element.answer !== undefined && element.answer !== -1) {
                    store.dispatch(changeFocus(new TestModal().plainObject()));
                    return;
                } else if (element.name === 'ShapeModal') {
                    store.dispatch(changeFocus({
                        id: 0,
                        name: 'ShapeModal',
                        style: {
                            width: '100px',
                            height: '100px',
                            fill: '#00BCD3',
                            stroke: 'none',
                            strokeWidth: 0,
                        },
                    }));
                    return;
                }
            }
            store.dispatch(changeFocus({ ...page }));
        }
    };
   
    render() {
        const { page = { elements: [], style: {}}, focusId, showImage, selects = [],view } = this.props;
       
         return (
            <div style={page.style} onClick={this.handleClick}>
            	  <div className="lineCanvasShow"> </div>
               { 
                    page.elements.map(element => {
                        const selected = selects.includes(element.id);
                        switch (element.name) {
                        case 'WordModal': return <Word key={element.id} value={element} focusId={focusId} sort={page.elements} selected={selected}  />;
                        case 'ImageModal': {
                        	 const to = page.elements.find(item => item.id === element.to);
                        	return <Image key={element.id} value={element} focusId={focusId} to={to} selected={selected} />
                        };
                        case 'AudioModal': return <Audio key={element.id} value={element} focusId={focusId} selected={selected} />;
                        case 'VideoModal': return <Video key={element.id} value={element} focusId={focusId} selected={selected} />;
                        case 'ShapeModal': return <Shape key={element.id} value={element} focusId={focusId} selected={selected} />;
                        case 'NoteModal': return <Note key={element.id} value={element} focusId={focusId} /> ;
                        case 'SortQuestionModal' : return <Sort key={element.id} value={element} focusId={focusId} />;
                        case 'TestConfirmModal' : return  <TestConfirm key={element.id} value={element} sort={page.elements} /> ;
                        case 'FillBlanksModal' : return <FillBlanks key={element.id} value={element} focusId={focusId} />;
                        case 'HighlightModal' : return <Highlight key={element.id} value={element} />;
                        case 'LineQuestionModal' : {
                            const to = page.elements.find(item => item.id === element.to);
                            return <LineQuestion key={element.id} value={element} focusId={focusId} to={to} showImage={showImage} />;
                        }
                        default: return null;
                        }
                    })
                }
             </div>
        );
    }
}

export default Page;
