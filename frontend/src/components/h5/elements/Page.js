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
import TestModal from "../modal/TestModal";
import {checkQuestion} from "../../../actions/testActions";

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
                }
            }
            store.dispatch(changeFocus({ ...page }));
        }
    };
    drawLine = element => {
        this.drawer.drawLine(element);
    };
    render() {
        const { page = { elements: [], style: {}, checking: false }, focusId, viewing = false, showImage, selects = [], isTeacher } = this.props;
        return (
            <div style={page.style} onClick={this.handleClick}>
                {
                    page.elements.map(element => {
                        const selected = selects.includes(element.id);
                        switch (element.name) {
                        case 'WordModal': return <Word key={element.id} value={element} focusId={focusId} viewing={viewing} sort={page.elements} selected={selected} checking={page.checking} />;
                        case 'InputModal': return <Input key={element.id} value={element} focusId={focusId} viewing={viewing} />;
                        case 'ButtonModal': return <Button key={element.id} value={element} focusId={focusId} viewing={viewing} />;
                        case 'ImageModal': return <Image key={element.id} value={element} focusId={focusId} viewing={viewing} selected={selected} />;
                        case 'AudioModal': return <Audio key={element.id} value={element} focusId={focusId} viewing={viewing} selected={selected} />;
                        case 'VideoModal': return <Video key={element.id} value={element} focusId={focusId} viewing={viewing} selected={selected} />;
                        case 'ShapeModal': return <Shape key={element.id} value={element} focusId={focusId} viewing={viewing} selected={selected} />;
                        case 'NoteModal': return (isTeacher || !viewing) ? <Note key={element.id} value={element} focusId={focusId} viewing={viewing} /> : null;
                        case 'SortQuestionModal' : return <Sort key={element.id} value={element} focusId={focusId} viewing={viewing} />;
                        case 'TestConfirmModal' : return <TestConfirm key={element.id} viewing={viewing} value={element} sort={page.elements} />;
                        case 'FillBlanksModal' : return <FillBlanks key={element.id} value={element} focusId={focusId} viewing={viewing} checking={page.checking} />;
                        case 'HighlightModal' : return <Highlight key={element.id} value={element} />;
                        case 'LineQuestionModal' : {
                            const to = page.elements.find(item => item.id === element.to);
                            return <LineQuestion key={element.id} value={element} focusId={focusId} viewing={viewing} to={to} showImage={showImage} drawLine={this.drawLine} />;
                        }
                        default: return null;
                        }
                    })
                }
                {
                    !viewing ? <div id="line" /> : <LineContainer ref={com => this.drawer = com} lineQuestions={page.elements.filter(element => element.name === 'LineQuestionModal')} checking={page.checking} />
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
        store.dispatch(checkQuestion(false));
    };
    getPoint = point => {
        const [from, to] = point;
        const fT = parseInt(from.style.top) + parseInt(from.style.height) / 2;
        const tT = parseInt(to.style.top) + parseInt(to.style.height) / 2;
        const fL = parseInt(from.style.left) + parseInt(from.style.width) / 2;
        const tL = parseInt(to.style.left) + parseInt(to.style.width) / 2;
        return [fL, fT, tL, tT];
    };
    correct = () => this.state.points.every(point => {
        const [from, to] = point;
        return from.to === to.id;
    });
    render() {
        let color = '#00BCD3';
        if (this.props.lineQuestions.length === 0) {
            return null;
        } else if (this.props.lineQuestions.length / 2 === this.state.points.length) {
            if (!this.correct() && this.props.checking) {
                color = 'red';
            }
        }
        return (
            <div className="lineCanvas">
                <Stage width={375} height={667}>
                    <Layer>
                        {
                            this.state.points.map((point, index) => <Line
                                key={index}
                                points={this.getPoint(point)}
                                stroke={color}
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
