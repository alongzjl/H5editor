/**
 * Created by sunlong on 2017/3/25.
 */
import React from 'react';
import { SketchPicker } from 'react-color';
import pinyin from 'pinyin';
import Select from 'react-select';
import 'rc-slider/assets/index.css';
import store from '../../../store';
import { changeStyle, changeWordPinyin, toggleWordSymbol, changeWordFace, changeWordAccessKey } from '../../../actions/h5Actions';
import * as Shapes from '../elements/shapes/Shapes';
import './fonts/iconfont.css';
import './wordPanel.less';
import t from '../../i18n';
import youziku from 'youziku';

const youzikuClient = new youziku.youzikuClient("0bafdccfe4251c51c3256b963087ebdf");

export const convert = text2Convert => {
    let text = text2Convert.replace(/<[^>]+>/g, '');
    const pinyinContent = pinyin(text);
    return pinyinContent.map(item => {
        let value = '';
        const textStr = text.substring(0, 1);
        const testChinese = /^[\u4e00-\u9fa5]+$/;
        if (testChinese.test(textStr)) {
            value = textStr;
            text = text.substring(1);
        } else {
            value = item[0];
            text = text.substring(item[0].length);
        }
        return { pinyin: item[0], text: value };
    });
};

export default class WordPanel extends React.Component {
    state = {
        buttonState: '',
        fontFamily:''
    };
    componentDidMount = () => {
    	this.setState({
    		fontFamily:this.props.focus.accessKey ? this.props.focus.accessKey.accessKey : 'acc87a2f8c8042b798071f8b61de1450'
    	})
    }
    changeFont = e => {
        document.getElementsByTagName('style')[0] ? document.head.removeChild(document.getElementsByTagName('style')[0]) : null;
        const entity={
            AccessKey:e.value,
            Content:this.props.focus.text
        };
        const courseFontFamily = this.props.page;
        this.setState({fontFamily:e.value});
        youzikuClient.getFontFace(entity, function (result) {
            store.dispatch(changeStyle({
                fontFamily: result.FontFamily
            }));
            store.dispatch(changeWordFace({'fontFace':result.FontFace}));
            store.dispatch(changeWordAccessKey({'accessKey':e.value}));
            let style_font = '';
            courseFontFamily.length !== 0 ? courseFontFamily.forEach(item=>{
                item.elements.forEach(value=>{
                    value.fontFace ? style_font += value.fontFace.fontFace : null
                })
            }) : null;
            style_font += result.FontFace;
            const newStyle = document.createElement('style');
            newStyle.appendChild(document.createTextNode(style_font));
            document.head.appendChild(newStyle);
        })
        store.dispatch(changeStyle({
            height: 'auto',
        }));
    };

	changeFontSize = e => {
        store.dispatch(changeStyle({
            fontSize: e.value,
        }));
        store.dispatch(changeStyle({
            height: 'auto',
        }));
    };

    changeFontColor = color => {
        store.dispatch(changeStyle({
            color: color.hex,
        }));
        this.setState({
            buttonState: '',
        });
    };

    changeBgColor = color => {
        store.dispatch(changeStyle({
            backgroundColor: color.hex,
        }));
        this.setState({
            buttonState: '',
        });
    };

    changeTransparency = value => {
        store.dispatch(changeStyle({
            opacity: 1 - value,
        }));
    };

    alignLeft = () => {
        store.dispatch(changeStyle({
            textAlign: 'left',
        }));
    };

    alignCenter = () => {
        store.dispatch(changeStyle({
            textAlign: 'center',
        }));
    };

    alignRight = () => {
        store.dispatch(changeStyle({
            textAlign: 'right',
        }));
    };

    changeBold = () => {
        const fontWeight = this.props.focus.style.fontWeight === 'bold' ? 'normal' : 'bold';
        store.dispatch(changeStyle({
            fontWeight,
        }));
    };

    changeItalic = () => {
        const fontStyle = this.props.focus.style.fontStyle === 'italic' ? 'normal' : 'italic';
        store.dispatch(changeStyle({
            fontStyle,
        }));
    };

    changeUnderline = () => {
        const textDecoration = this.props.focus.style.textDecoration === 'underline' ? 'none' : 'underline';
        store.dispatch(changeStyle({
            textDecoration,
        }));
    };
    changeLineThrough = () => {
        const textDecoration = this.props.focus.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        store.dispatch(changeStyle({
            textDecoration,
        }));
    };
    addPinyin = () => {
        let pinyins = [];
        if (!(this.props.focus.pinyins && this.props.focus.pinyins.length > 0)) {
            pinyins = convert(this.props.focus.text);
        }

        store.dispatch(changeWordPinyin(pinyins));
    };
    addWordColor = () => {
        this.setState({
            buttonState: 'addWordColor',
        });
    };
    addWordBgColor = () => {
        this.setState({
            buttonState: 'addWordBgColor',
        });
    };
    addSymbol = () => {
        this.setState({
            buttonState: 'addSymbol',
        });
    };
    selectSymbol = symbol => {
        store.dispatch(toggleWordSymbol(symbol));
        this.setState({
            buttonState: 'false',
        });
    };
    render() {
        const style = Object.assign({}, {
            color: '#000000',
            backgroundColor: '#ffffff',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
        }, this.props.focus.style);
        const symbolStyle = {
            fill: '#4A4A4A;',
            stroke: 'none',
            strokeWidth: 0,
            width: '20px',
            height: '20px',
        };
        const currentSymbol = (this.props.focus.symbol && this.props.focus.symbol.length > 0) ? this.props.focus.symbol[0].symbol : '';
        const font_family_types_CN = [
			{ value: 'acc87a2f8c8042b798071f8b61de1450', label: '默认'},
            { value: '6d975903393d4e2a8d4a664413d60e82', label: '经典中圆简' },
            { value: 'bed20f8f2a4445f0943926486abe13ba', label: '宋体' },
            { value: 'd1f33a279b944d4d9973401d2884e87b', label: '幼圆' },
            { value: 'a88dbf2932ef464c90d22344c9669bbf', label: '钢笔行书' },
         	{ value: '1cd22e50ed9f4ed0a44c4f29eb31bebf', label: '浪漫原体国际码' },
          	{ value: '68ebcb79cbf94ad581f956f35e1df751', label: '经典隶变简' },
           	{ value: '57881db416684effb4e4dcf005686752', label: '思源黑体Medium' },
            { value: '49ae1c1ef0124962b2338c7184fa645b', label: '奶油小甜心' },
            { value: 'bf1f8c8768fb463cb2d21ad1d7dc1845', label: '硬笔行楷简' },
            { value: '4cead41a5e6e4699843017ef0a284c26', label: '毛笔行书' },
            { value: '8a5c6387c3594d89ab0f82ad234a68d8', label: '汉鼎繁细黑' },
            { value: '23ddeb3b59e34c9e82f7142f3122d8af', label: '超世纪中古印' },
            { value: '073e825ddf754b8e9538e1dc2108294c', label: '天真娃娃体 ' },
            { value: 'd993fa4001e64bdf9fda3b7950826544', label: '汉鼎简新艺体 ' },
            { value: 'cae5fcb0edef4575b80157bc868e7ba5', label: '熊兔体 ' },
            { value: '3355ed991c2c4704b6564d4cda019e49', label: '苹方黑体' },
            { value: '112ce7f1489b4e009fe6588d2f7e93e8', label: '中国锐博体' },
            { value: 'c8a6041ebe144062b383fb5d93b7f532', label: '毛笔隶书' },
            { value: '9338b0275338419e9993bf9e82c3bdac', label: '新唐人簡篆体 ' },
            { value: 'c1b24e1c8d234ca6a51c71ff13de3bb3', label: '胖胖美工国际码' },
            { value: '5d375d7df0a24c4a9a9eef51b6dd813b', label: '美工忠狗字形' },
            { value: '29529dc608cc4b36b5e86827670e9ae0', label: '中海报简' },
            { value: 'c375779cf85b4b72ac5308b5d7e8c214', label: '拓仿黑体' },

        ]
        return (
            <div className="wordPanel">
                <ul className="WordAlign">
                    <li onClick={this.alignLeft}><img src={require(`./images/left_justifying${style.textAlign === 'left' ? '_selected' : ''}.png`)} /></li>
                    <li onClick={this.alignCenter}><img src={require(`./images/Center${style.textAlign === 'center' ? '_selected' : ''}.png`)} /></li>
                    <li onClick={this.alignRight}><img src={require(`./images/Right_Aligns${style.textAlign === 'right' ? '_selected' : ''}.png`)} /></li>
                </ul>
                <ul className="WordStr">
                    <li onClick={this.changeBold}><img src={require(`./images/overstriking${style.fontWeight === 'bold' ? '_selected' : ''}.png`)} /></li>
                    <li onClick={this.changeItalic}><img src={require(`./images/italic${style.fontStyle === 'italic' ? '_selected' : ''}.png`)} /></li>
                    <li onClick={this.changeUnderline}><img src={require(`./images/underline${style.textDecoration === 'underline' ? '_selected' : ''}.png`)} /></li>
                    <li onClick={this.changeLineThrough}><img src={require(`./images/line-through${style.textDecoration === 'line-through' ? '_selected' : ''}.png`)} /></li>
                </ul>
                <Select
                    name="form-field-name1"
                    value={this.state.fontFamily ? this.state.fontFamily : 'acc87a2f8c8042b798071f8b61de1450'}
                   onChange={this.changeFont}
                    clearable={false}
                    searchable={false}
                    className="fontSelect"
                    options={font_family_types_CN}
                />
                <Select
                    name="form-field-name"
                    value={this.props.focus.style.fontSize}
                    onChange={this.changeFontSize}
                    clearable={false}
                    searchable={false}
                    options={[
                        { value: '12px', label: '12px' },
                        { value: '13px', label: '13px' },
                        { value: '14px', label: '14px' },
                        { value: '15px', label: '15px' },
                        { value: '16px', label: '16px' },
                        { value: '17px', label: '17px' },
                        { value: '18px', label: '18px' },
                        { value: '20px', label: '20px' },
                        { value: '22px', label: '22px' },
                        { value: '26px', label: '26px' },
                        { value: '30px', label: '30px' },
                        { value: '34px', label: '34px' },
                        { value: '38px', label: '38px' },
                        { value: '42px', label: '42px' },
                        { value: '46px', label: '46px' },
                        { value: '50px', label: '50px' },
                        { value: '54px', label: '54px' },
                        { value: '58px', label: '58px' },
                        { value: '62px', label: '62px' },
                        { value: '66px', label: '66px' },
                        { value: '70px', label: '70px' },
                        { value: '80px', label: '80px' },
                        { value: '90px', label: '90px' },
                    ]}
                />
                <div className="flex_row_start flex_vertical_middle wordFunction">
                    {this.props.focus.name === 'WordModal' && <button onClick={this.addPinyin} className={`addBtn addPinyin ${this.props.focus.pinyin ? 'addPinyinSelect' : ''}`} />}
                    <button onClick={this.addWordColor} className={`addBtn addWordColor ${this.state.buttonState === 'addWordColor' ? 'addWordColorSelect' : ''}`} />
                    <button onClick={this.addWordBgColor} className={`addBtn addWordBgColor ${this.state.buttonState === 'addWordBgColor' ? 'addWordBgColorSelect' : ''}`} />
                    {this.props.focus.name === 'WordModal' && <button onClick={this.addSymbol} className={`addBtn addSymbol ${this.state.buttonState === 'addSymbol' ? 'addSymbolSelect' : ''}`} />}
                </div>
                {
                    this.state.buttonState === 'addWordColor' ? <SketchPicker onChangeComplete={this.changeFontColor} color={style.color} /> : null
                }
                {
                    this.state.buttonState === 'addWordBgColor' ? <SketchPicker onChangeComplete={this.changeBgColor} color={style.backgroundColor} /> : null
                }
                {
                    this.state.buttonState === 'addSymbol' ? <div className="symbolList flex_row_between flex_vertical_middle">
                        <div className={`${currentSymbol === 'Triangle' ? 'selected' : ''}`}>
                            <Shapes.Triangle style={symbolStyle} onSelected={this.selectSymbol} />
                        </div>
                        <div className={`${currentSymbol === 'Circle' ? 'selected' : ''}`}>
                            <Shapes.Circle style={symbolStyle} onSelected={this.selectSymbol} />
                        </div>
                        <div className={`${currentSymbol === 'Square' ? 'selected' : ''}`}>
                            <Shapes.Square style={symbolStyle} onSelected={this.selectSymbol} />
                        </div>
                        <div className={`${currentSymbol === 'CircleSquare' ? 'selected' : ''}`}>
                            <Shapes.CircleSquare style={symbolStyle} onSelected={this.selectSymbol} />
                        </div>
                        <div className={`${currentSymbol === 'Star' ? 'selected' : ''}`}>
                            <Shapes.Star style={symbolStyle} onSelected={this.selectSymbol} />
                        </div>
                    </div> : null
                }
            </div>
        );
    }
}
