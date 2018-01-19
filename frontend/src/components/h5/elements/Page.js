/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { Line, Layer, Stage } from 'react-konva';
import Word from './Word';
import Input from './Input';
import Button from './Button';
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
import {changeSortAnswerStyle } from '../../../actions/testActions';
 
/**
 * @param viewing 是否正在浏览
 */
class Page extends React.Component {
    handleClick = e => {
        const { page = { elements: [], style: {} }, viewing = false } = this.props;
        if (!viewing && e.target === e.currentTarget) { // 防止捕获其它onclick事件
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
    drawLine = element => {
    	!this.props.isTeacher ?  this.drawer.drawLine(element) : null;
      };
    correct = () => {
    	 this.drawer.correct();
    }
    render() {
        const { page = { elements: [], style: {}}, focusId, viewing = false, showImage, selects = [], isTeacher,stompClient } = this.props;
        const rightOrColor ={right:'#00bcd3',error:'#e42e42',common:'#7b818f'} ;
         return (
            <div style={page.style} onClick={this.handleClick}>
            	 {
                    !viewing ? <div id="line" /> : <LineContainer ref={com => this.drawer = com} elements={page.elements} />
                }
                {
                    page.elements.map(element => {
                        const selected = selects.includes(element.id);
                        switch (element.name) {
                        case 'WordModal': return <Word key={element.id} value={element} focusId={focusId} viewing={viewing} sort={page.elements} selected={selected} isTeacher={isTeacher} rightOrColor={rightOrColor} />;
                        case 'InputModal': return <Input key={element.id} value={element} focusId={focusId} viewing={viewing} />;
                        case 'ButtonModal': return <Button key={element.id} value={element} focusId={focusId} viewing={viewing} />;
                        case 'ImageModal': return <Image key={element.id} value={element} focusId={focusId} viewing={viewing} selected={selected} />;
                        case 'AudioModal': return <Audio key={element.id} value={element} focusId={focusId} viewing={viewing} selected={selected} />;
                        case 'VideoModal': return <Video key={element.id} value={element} focusId={focusId} viewing={viewing} selected={selected} />;
                        case 'ShapeModal': return <Shape key={element.id} value={element} focusId={focusId} viewing={viewing} selected={selected} />;
                        case 'NoteModal': return (isTeacher || !viewing) ? <Note key={element.id} value={element} focusId={focusId} viewing={viewing} /> : null;
                        case 'SortQuestionModal' : return <Sort key={element.id} value={element} focusId={focusId} viewing={viewing} />;
                        case 'TestConfirmModal' : return !isTeacher || (isTeacher && element.title !== 'line' && element.title !== 'blank') ? <TestConfirm key={element.id} rightOrColor={rightOrColor} viewing={viewing} value={element} isTeacher={isTeacher} correct={element.title==='line'?this.correct:null} sort={page.elements} stompClient={stompClient} /> : null;
                        case 'FillBlanksModal' : return <FillBlanks key={element.id} value={element} focusId={focusId} viewing={viewing} isTeacher={isTeacher} rightOrColor={rightOrColor} />;
                        case 'HighlightModal' : return <Highlight key={element.id} value={element} />;
                        case 'LineQuestionModal' : {
                            const to = page.elements.find(item => item.id === element.to);
                            return <LineQuestion key={element.id} value={element} focusId={focusId} viewing={viewing} to={to} showImage={showImage} drawLine={this.drawLine} />;
                        }
                        default: return null;
                        }
                    })
                }
             </div>
        );
    }
}

class LineContainer extends React.Component {
    state = {
        start: null,
        points: [],
    };
    drawLine = element => {
    	 if (this.state.start === null) {
            this.setState({
                start: element,
            });
        } else {
            this.draw(element);
        }
    };
    draw = to => {
    	 if (to.id === this.state.start.id) {
            this.setState({
                start: null,
            });
            return;
        }
        const newPoints = this.state.points.filter(point => {
            const [point1, point2] = point;
            return (point1.id !== this.state.start.id) && (point1.id !== to.id) && (point2.id !== this.state.start.id) && (point2.id !== to.id);
        });
        this.setState({
            start: null,
            points: newPoints.concat([[this.state.start, to]]),
        });
     };
    getPoint = point => {
        const [from, to] = point;
        const fT = parseInt(from.style.top) + parseInt(from.style.height) / 2;
        const tT = parseInt(to.style.top) + parseInt(to.style.height) / 2;
        const fL = parseInt(from.style.left) + parseInt(from.style.width) / 2;
        const tL = parseInt(to.style.left) + parseInt(to.style.width) / 2;
        return [fL, fT, tL, tT];
    };
    correct = () => {
    	const points = this.state.points.map(point => {
	        const [from, to] = point;
	        const rightLine = from.to === to.id ? "#00bcd3" :"#e42e42";
	        from.showColor = rightLine;
	        return point;
    	});
    	this.setState({
    		points:points
    	})
    	const allRight = this.state.points.filter(item => item[0].to !== item[1].id); 
    	 const allBackground = allRight.length === 0 ? '#00bcd3' : '#e42e42';
    	const confirm = this.props.elements.filter(element => element.name === 'TestConfirmModal');
    	store.dispatch(changeSortAnswerStyle(confirm[0].id,{ background:allBackground}))
    };
    render() {
    	const lineQuestions=this.props.elements.filter(element => element.name === 'LineQuestionModal')
        if (lineQuestions.length === 0) {
            return null;
        } 
       return (
            <div className="lineCanvas">
                <Stage width={375} height={667}>
                    <Layer>
                        {
                            this.state.points.map((point, index) => <Line
                                key={index}
                                points={this.getPoint(point)}
                                stroke={point[0].showColor}
                                strokeWidth={1}
                            />)
                        }
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default Page;
