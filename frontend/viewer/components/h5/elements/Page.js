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
import './page.less';
import LineQuestion from './testTypes/LineQuestion';
import Highlight from './Highlight';
import TestModal from '../modal/TestModal';
import {changeSortAnswerStyle,changeLineShow } from '../../../actions/testActions';
 
/**
 * @param viewing 是否正在浏览
 */
class Page extends React.Component {

    drawLine = element => {
    	!this.props.isTeacher ?  this.drawer.drawLine(element) : ()=>{};
    };
    correct = data => {
    	this.drawer.correct();
    };
    
    render() {
        const { page = { elements: [], style: {}},showImage,  isTeacher,mKey } = this.props;
        const rightOrColor ={right:'#00bcd3',error:'#e42e42',common:'#7b818f'} ;
         const isHaveLine = page.elements.filter(item => item.name =='TestConfirmModal' && item.title === 'line' ? true : false);
          return (
            <div style={page.style} >
            	 {
                    isHaveLine.length ===0 ? <div className="lineCanvasShow" /> : <LineContainer ref={com => this.drawer = com} elements={page.elements} mKey={mKey} rightOrColor={rightOrColor} isTeacher={isTeacher} />
                }
                { 
                    page.elements.map(element => {
                        switch (element.name) {
                        case 'WordModal': return <Word key={element.id} value={element}  sort={page.elements}  isTeacher={isTeacher} rightOrColor={rightOrColor} />;
                        case 'ImageModal': {
                        	 const to = page.elements.find(item => item.id === element.to);
                        	return <Image key={element.id} value={element}  to={to}  lineTo={this.drawLine} />
                        };
                        case 'AudioModal': return <Audio key={element.id} value={element} />;
                        case 'VideoModal': return <Video key={element.id} value={element} />;
                        case 'ShapeModal': return <Shape key={element.id} value={element} />;
                        case 'NoteModal': return isTeacher  ? <Note key={element.id} value={element} /> : null;
                        case 'SortQuestionModal' : return <Sort key={element.id} value={element} />;
                        case 'TestConfirmModal' : return  <TestConfirm key={element.id} rightOrColor={rightOrColor} value={element} isTeacher={isTeacher} correct={this.correct} sort={page.elements} mKey={mKey}/> ;
                        case 'FillBlanksModal' : return <FillBlanks key={element.id} value={element}  isTeacher={isTeacher} rightOrColor={rightOrColor} />;
                        case 'HighlightModal' : return <Highlight key={element.id} value={element} />;
                        case 'LineQuestionModal' : {
                            const to = page.elements.find(item => item.id === element.to);
                            return <LineQuestion key={element.id} value={element} question to={to} showImage={showImage} drawLine={this.drawLine} isTeacher={isTeacher} />;
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
	        rightOrColor:this.props.rightOrColor,
	        confirm : this.props.elements.filter(element => element.name === 'TestConfirmModal')[0]
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
    correct = data => {
    	let points = [];
    	points = this.state.points.map(point => {
	        const [from, to] = point;
	        const rightLine = from.to === to.id ? this.state.rightOrColor.right :this.state.rightOrColor.error;
	        from.showColor = rightLine;
	        return point;
    	}),this.setState({
    		points:points
    	});
    	!this.props.isTeacher ? this.show_line_func() : null;
     };
     //点击确定按钮时显示连线结果
     show_line_func = () => {
     	store.dispatch(changeSortAnswerStyle(this.state.confirm.id,{ background:'#7b818f'}));
    	const post_line = this.state.points.map(item=>{const [from,to] = item; return [{to:from.to,id:from.id, style:{top:from.style.top,left:from.style.left,width:from.style.width,height:from.style.height}, showColor:from.showColor},{id:to.id,style:{top:to.style.top,left:to.style.left,width:to.style.width,height:to.style.height}}] });
    	store.dispatch(changeLineShow(this.state.confirm.id,JSON.stringify(post_line)));
    	socket.emit('control', JSON.stringify({name:'matching',list: post_line,id:this.state.confirm.id, mKey:this.props.mKey}));
    };
    render() {
    	const confirmLine = this.props.elements.filter(element => element.name === 'TestConfirmModal')[0].lineList;
    	return (
            <div className="lineCanvas">
                <Stage width={375} height={667}>
                    <Layer>
                        {
                        	this.props.isTeacher && confirmLine !== undefined ? JSON.parse(confirmLine).map((point, index) => <Line
                                key={index}
                                points={this.getPoint(point)}
                                stroke={point[0].showColor}
                                strokeWidth={1}
                            />) :  this.state.points.map((point, index) => <Line
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
