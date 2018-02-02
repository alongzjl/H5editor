/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Rnd from '../../common/rnd/ReactRnd';
import store from '../../../store';
import Shapes from './shapes/Shapes';
import Action from './Action';
import './word.less';
import { changeFocus, changeWordEditable, changeWordText, changeStyle, changeWordSymbol, selectMultiple, changeWordPinyin,changeWordAnswerChoose } from '../../../actions/h5Actions';
import { changeSortAnswerShow, changeSortQuestionStyle, checkQuestion ,changeSortAnswerStyle} from '../../../actions/testActions';
import { convert } from '../panel/WordPanel';

function getStyle(value) {
    const animation = {
        animationDelay: value.style.animationDelay,
        animationDuration: value.style.animationDuration,
        animationIterationCount: value.style.animationIterationCount,
    };
    return Object.assign({}, animation, {
        width: value.style.width,
        height: value.style.height,
        minHeight: value.style.minHeight ? value.style.minHeight : 'auto',
        lineHeight: value.style.lineHeight,
        fontSize: value.style.fontSize,
        color: value.style.color,
        backgroundColor: value.style.backgroundColor,
        fontWeight: value.style.fontWeight,
        fontStyle: value.style.fontStyle,
        fontFamily: value.style.fontFamily,
        textDecoration: value.style.textDecoration,
        textAlign: value.style.textAlign,
    });
}
const getPosition = value => {
    const x = value.style.left ? parseInt(value.style.left) : 0;
    const y = value.style.top ? parseInt(value.style.top) : 0;
    return { x, y, height: value.style.height };
};
class Word extends React.Component {
    state = {
        index: 0,
    };
    onAnimationEnd = () => {
        this.setState({
            index: this.state.index + 1,
        });
    };
    componentWillReceiveProps() { // 属性变化时，动画重新播放
        if (this.state.index === this.props.value.animations.length) {
            this.setState({
                index: 0,
            });
        }
    }
    wordClicked = e => {
        if ((navigator.platform.indexOf('Mac') === 0 && e.metaKey) || (navigator.platform.indexOf('Mac') !== 0 && e.ctrlKey)) {
            store.dispatch(selectMultiple(this.props.value.id));
            return;
        }
        store.dispatch(changeFocus(this.props.value));
    };
    changeEditable = () => {
        store.dispatch(changeWordEditable(this.props.value.id, true));
         store.dispatch(changeStyle({ minHeight: this.props.value.style.height }));
    };
    changeEditableFalse = () => {
        store.dispatch(changeWordEditable(this.props.value.id, false));
    };
    changeText = e => {
        store.dispatch(changeWordText(this.props.value.id, e.target.innerHTML));
    };
    handleBlur = e => {
        this.changeEditableFalse();
        this.changeText(e);
    };
     handleEnter = e => {
        if (e.keyCode === 13) {
        	 const lineHeight = Number.parseInt(this.props.value.style.lineHeight);
            const height = Number.parseInt(this.props.value.style.height);
            store.dispatch(changeStyle({
                height: `${height + lineHeight}px`,
            }));
         }
    };
    handleCopy = e => {
    	if(e.keyCode === 86){
    		this.copyText(e);
    	}
    };
    //复制word文本的处理
    copyText = e => {
    	const html_content = e.target.innerHTML;
    	const dom_now = document.createElement('div');
    	 dom_now.innerHTML = html_content;
    	 const dom_span = dom_now.childNodes;
    	 let text_show = '';
    	 dom_span.forEach(item=>{
    	 	if(item.nodeName === 'DIV'){
    	 		item.childNodes.forEach(val => {
	    	 		text_show += this.copySearch(val);
	    	 	})
    	 	}else{
    	 			text_show += this.copySearch(item);
    	 	}
    	})
    	 store.dispatch(changeWordText(this.props.value.id, text_show));
     };
    //循环遍历dom
    copySearch = (item) => {
    		let text_show = '';
    		item.nodeName === '#text' ? text_show += item.nodeValue : null;
    	 	item.nodeName === 'BR' ? text_show += '<br/ >' : null; 
    	 	item.nodeName === 'P' ? text_show += item.innerText + '<br/ >' : null;
    	 	item.nodeName === 'SPAN' ? text_show += item.innerText + '<br/ >' : null;
    	 	return text_show
    };
    render() {
        const { value, focusId, sort, selected} = this.props;
        value.pinyins = value.pinyins ? value.pinyins : [];

        let animation = {};
        if (value.animations && (value.animations.length > this.state.index)) {
            animation = value.animations[this.state.index];
        }
        value.style = Object.assign({}, value.style, {
            className: animation.className,
            animationDelay: animation.animationDelay,
            animationDuration: animation.animationDuration,
            animationIterationCount: animation.animationIterationCount,
        });

        if (value.pinyins.length > 0) {
            return (
                <PinYinWord
                    onClick={this.wordClicked}
                    value={value}
                    onAnimationEnd={this.onAnimationEnd}
                    onDoubleClick={this.changeEditable}
                    focusId={focusId}
                    selected={selected}
                />
            );
        }
        if (value.symbol && value.symbol.length > 0) {
            return (
                <SymbolWord
                    onClick={this.wordClicked}
                    value={value}
                   onAnimationEnd={this.onAnimationEnd}
                    onDoubleClick={this.changeEditable}
                    focusId={focusId}
                    selected={selected}
                />
            );
        }
	 const selectedClass = selected ? 'selected' : '';
        return (
            <Rnd
                onDragStart={this.wordClicked}
                className={focusId === value.id ? 'focused' : ''}
                style={value.style}
                isDraggable={!value.contenteditable}
                onDoubleClick={this.changeEditable}
                initial={getPosition(value)}
            >
                <div
                    className={`${(focusId === value.id || focusId === -1) ? value.style.className : ''} word_common ${selectedClass}`}
                    style={getStyle(value)}
                    contentEditable={value.contenteditable}
                    onBlur={this.handleBlur}
                  	onContextMenu={this.wordClicked}
                    onKeyDown={this.handleEnter}
                    onKeyUp = {e =>{this.handleCopy(e) }}
                    onAnimationEnd={this.onAnimationEnd}
                    dangerouslySetInnerHTML={{ __html: value.text }}
                />
            </Rnd>
        );
    }
}
export default Word;


class Item extends React.Component {
    componentDidUpdate(prevProp, prevState) {
    	this.text.innerHTML = prevProp.text;
    }
    blur = (key, value) => {
        if (key === 'text') {
            this.props.onBlur(this.props.index, convert(value));
        } else {
            this.props.onBlur(this.props.index, { pinyin: value, text: this.props.text });
        }
    };
    render() {
        const { pinyin, text, contenteditable } = this.props;
        return (
            <div className="pinyinItem">
                <div
                    dangerouslySetInnerHTML={{ __html: pinyin }}
                    contentEditable={contenteditable}
                    onBlur={e => this.blur('pinyin', e.target.innerHTML)}
                />
                <div
                    dangerouslySetInnerHTML={{ __html: text }}
                    ref={com => this.text = com}
                    contentEditable={contenteditable}
                    onBlur={e => this.blur('text', e.target.innerHTML)}
                />
            </div>
        );
    }
}

const getClassName = textAlign => {
    let className = 'flex_row_start';
    if (textAlign === 'right') {
        className = 'flex_row_end';
    } else if (textAlign === 'center') {
        className = 'flex_row_center';
    }
    return className;
};

class PinYinWord extends React.Component {
    handleBlur = (index, value) => {
        const newPinyins = this.props.value.pinyins.slice(0, index).concat(value).concat(this.props.value.pinyins.slice(index + 1));
        store.dispatch(changeWordEditable(this.props.value.id, false));
        store.dispatch(changeWordPinyin(newPinyins));
    };
    render() {
        const { value, onClick, onDoubleClick, focusId, onAnimationEnd, selected } = this.props;
		const className = getClassName(value.style.textAlign);
        const selectedClass = selected ? 'selected' : '';
        return (
            <Rnd
                onDragStart={onClick}
                className={focusId === value.id ? 'focused' : ''}
                style={value.style}
                isDraggable={!value.contenteditable}
                onDoubleClick={onDoubleClick}
                initial={getPosition(value)}
            >
                <div
                    className={`${className} ${selectedClass} ${focusId === value.id ? value.style.className : ''}`}
                    id='wordPinyin'
                    style={getStyle(value)}
                    onAnimationEnd={onAnimationEnd}
                >
                    {
                        value.pinyins.map((item, index) => {
                        		if(item.text.indexOf('<br>')>-1){
                        			let thisCount = 0;
                        			item.text.replace(/<br>/g, function (m, i) {
								    	thisCount++;
								  });
								return <div className="flex_column_start pinyinItem" style={{width:'100%',height:`${thisCount*12}px`}} key={`item${index}`}></div>;
	                        	}else{
	                        		return <Item
	                                pinyin={item.pinyin}
	                                text={item.text}
	                                key={`item${index}`}
	                                index={index}
	                                contenteditable={value.contenteditable}
	                                onBlur={this.handleBlur}
	                            />;
                        	}
                        })
                    }
                </div>
            </Rnd>
        );
    }
}

class SymbolWord extends React.Component {
    constructor() {
        super();
        this.blured = 0;
    }
    onBlur = () => {
        if (this.blured + 1 === this.props.value.symbol.length) {
            this.blured = 0;
            store.dispatch(changeWordEditable(this.props.value.id, false));
        } else {
            this.blured = this.blured + 1;
        }
    };
    render() {
        const { value, onClick, onDoubleClick, focusId, onAnimationEnd } = this.props;
        const symbolStyle = {
            fill: '#00BCD3',
            stroke: 'none',
            strokeWidth: 0,
            width: '10px',
            height: '10px',
        };
        const className = getClassName(value.style.textAlign);
       return (
            <Rnd
                onDragStart={onClick}
                className={focusId === value.id ? 'focused' : ''}
                style={value.style}
                isDraggable={!value.contenteditable}
                onDoubleClick={onDoubleClick}
                onContextMenu={onClick}
                initial={getPosition(value)}
            >
                <div
                    className={`word_common ${focusId === value.id ? value.style.className : ''}`}
                    style={getStyle(value)}
                    onAnimationEnd={onAnimationEnd}
                >
                    {
                        value.symbol.map((item, index) => (
                            <div className={`${className} flex_vertical_middle`} key={`symbol${index}`}>
                                <Shapes name={item.symbol} style={Object.assign({}, symbolStyle, { fill: value.style.color })} />
                                <SymbolContent item={item} contenteditable={value.contenteditable} index={index} style={value.style} onBlur={this.onBlur} />
                            </div>
                        ))
                    }
                </div>
            </Rnd>
        );
    }
}

class SymbolContent extends React.Component {
    keyDownSymbol = (e, idx, sym) => {
        const style = this.props.style;
        const lineHeight = Number.parseInt(style.lineHeight);
        const height = Number.parseInt(style.height);
        if (e.keyCode === 13) { // 回车
            store.dispatch(changeStyle({
                height: `${height + lineHeight}px`,
            }));
            store.dispatch(changeWordSymbol([{ symbol: sym, text: '' }]));
        } else if (e.keyCode === 8 && e.target.value === '') { // 删除
            store.dispatch(changeStyle({
                height: `${height - lineHeight}px`,
            }));
            store.dispatch(changeWordSymbol(null, idx));
        }
    };
    changeSymbol = (e, idx, sym) => {
        store.dispatch(changeWordSymbol({ symbol: sym, text: e.target.value }, idx));
    };
    render() {
        const { item, contenteditable, index, style, onBlur } = this.props;
        const newStyle = {
            width: `${parseInt(style.width) - 17}px`,
            marginLeft: '3px',
        };
        const text = item.text.replace(/<[^>]+>/g, '');
        if (!contenteditable) {
            return (
                <div style={newStyle}>{text}</div>
            );
        }
        return (
            <input
                value={text}
                style={newStyle}
                onChange={args => this.changeSymbol(args, index, item.symbol)}
                onKeyDown={args => this.keyDownSymbol(args, index, item.symbol)}
                onBlur={onBlur}
            />
        );
    }
}
