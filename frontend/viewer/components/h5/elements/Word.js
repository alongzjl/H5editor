/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import store from '../../../store';
import Shapes from './shapes/Shapes';
import Action from './Action';
import './word.less';
import { changeStyle,changeWordAnswerChoose } from '../../../actions/h5Actions';
import { changeSortAnswerShow, changeSortQuestionStyle, changeSortAnswerStyle} from '../../../actions/testActions';


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
   
    render() {
        const { value, sort, isTeacher,rightOrColor} = this.props;
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
                    value={value}
                    onAnimationEnd={this.onAnimationEnd}
                   />
            );
        }
        if (value.symbol && value.symbol.length > 0) {
            return (
                <SymbolWord
                    value={value}
                    onAnimationEnd={this.onAnimationEnd}
                     />
            );
        }

        let isHaveSort = '';
        if (value.answer !== undefined && value.answer !== '' && value.answer !== -1) {
            if (value.answer === 'sort') {
                isHaveSort = 'SortQuestionModal';
            } else {
                isHaveSort = 'ItemsChoose';
            }
        }

        if (isHaveSort === 'SortQuestionModal') {
            return (
                <ItemsSort
                    value={value}
                    sort={sort}
                    onAnimationEnd={this.onAnimationEnd}
                    isTeacher={isTeacher}
                />
            );
        } else if (isHaveSort === 'ItemsChoose') {
            return (
                <Action action={value.action}>
                    <ItemsChoose value={value} onAnimationEnd={this.onAnimationEnd} isTeacher={isTeacher} rightOrColor={rightOrColor} />
                </Action>
            );
        } else  {
            return (
                <Action action={value.action}>
                    <div
                        className={value.style.className}
                        style={{ ...value.style, height: 'auto', lineHeight: 'normal' }}
                        dangerouslySetInnerHTML={{ __html: value.text }}
                        onAnimationEnd={this.onAnimationEnd}
                    />
                </Action>
            );
        }
     }
}
export default Word;

class ItemsSort extends React.Component {
    sortChoose = () => {
        const sortList = this.props.sort;
        const sortQuestions = sortList.filter(item => item.name === 'SortQuestionModal');
        const exist = sortQuestions.find(question => question.answerShow === this.props.value.text);
        if (exist) {
            store.dispatch(changeSortAnswerShow(exist.id, ''));
        } else {
            const blank = sortQuestions.find(question => question.answerShow === '');
            store.dispatch(changeSortAnswerShow(blank.id, this.props.value.text));
        }
        store.dispatch(changeSortQuestionStyle({ color: 'black' }));
    };
    render() {
        const { value, onAnimationEnd, isTeacher} = this.props;
        return (
            <div
                onClick={!isTeacher ? this.sortChoose : null}
                className={`sort_word ${value.style.className}`}
                style={{ ...value.style, height: 'auto' }}
                onAnimationEnd={onAnimationEnd}
            >
                { value.text }
            </div>
        );
    }
}

class ItemsChoose extends React.Component {
    state = {
    	chooseAnswer:this.props.value.chooseAnswer
    }
    ItemsChooseClick = id => {
    	this.setState({
    		chooseAnswer:!this.state.chooseAnswer
    	},()=>{
    		store.dispatch(changeWordAnswerChoose(id,this.state.chooseAnswer));
    		const color = this.state.chooseAnswer ? this.props.rightOrColor.right : this.props.rightOrColor.common;
    		store.dispatch(changeSortAnswerStyle(id,{ color:color }));
    	})
     };
    render() {
        const { value,onAnimationEnd,isTeacher} = this.props;
        return (
            <div
                onClick={()=>!isTeacher ? this.ItemsChooseClick(value.id) : null}
                className={`ItemsChoose`}
                style={{ ...value.style, height: 'auto' }}
                onAnimationEnd={onAnimationEnd}
            > 
                <span>{ value.text }</span>
            </div>
        );
    }
}

class Item extends React.Component {
    componentDidUpdate(prevProp, prevState) {
    	this.text.innerHTML = prevProp.text;
    }
    render() {
        const { pinyin, text} = this.props;
        return (
            <div className="pinyinItem">
                <div
                    dangerouslySetInnerHTML={{ __html: pinyin }}
                  
                />
                <div
                    dangerouslySetInnerHTML={{ __html: text }}
                    ref={com => this.text = com}
                   
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
        const { value,onAnimationEnd} = this.props;
		const className = getClassName(value.style.textAlign);
         return (
                <div
                    className={`${className} ${value.style.className}`}
                    style={value.style}
                    onAnimationEnd={onAnimationEnd}
                >
                    {
                        value.pinyins.map((item, index) =>{
                        	if(item.text.indexOf('<br>')>-1){
	                        		let thisCount = 0;
	                        			item.text.replace(/<br>/g, function (m, i) {
									    	thisCount++;
									  });
                        			return <div className="flex_column_start pinyinItem" key={`item${index}`} style={{width:'100%',height:`${thisCount*12}px`}} ></div>;
                        	}else{
                        		return <Item pinyin={item.pinyin} text={item.text} key={`item${index}`} />;
                        	}
                         })
                    }
                </div>
            );
  	}
}

class SymbolWord extends React.Component {
    constructor() {
        super();
        this.blured = 0;
    }
   
    render() {
        const { value,onAnimationEnd } = this.props;
        const symbolStyle = {
            fill: '#00BCD3',
            stroke: 'none',
            strokeWidth: 0,
            width: '10px',
            height: '10px',
        };
        const className = getClassName(value.style.textAlign);
          return (
                <div
                    className={`flex_row_start ${value.style.className}`}
                    style={value.style}
                    onAnimationEnd={onAnimationEnd}
                >
                    {
                        value.symbol.map((item, index) => (
                            <div className={`${className} flex_vertical_middle`} key={`symbol${index}`}>
                                <Shapes name={item.symbol} style={Object.assign({}, symbolStyle, { fill: value.style.color })} />
                                <SymbolContent item={item} contenteditable={false} index={index} style={value.style} />
                            </div>
                        ))
                    }
                </div>
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
