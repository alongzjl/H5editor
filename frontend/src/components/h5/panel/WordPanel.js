/**
 * Created by sunlong on 2017/3/25.
 */
import React from 'react';
import { SketchPicker } from 'react-color';
import 'rc-slider/assets/index.css';
import store from '../../../store';
import { changeStyle, changeWordPinyin, toggleWordSymbol } from '../../../actions/h5Actions';
import * as Shapes from '../elements/shapes/Shapes';
import './fonts/iconfont.css';
import './wordPanel.less';
import t from '../../i18n';

export default class WordPanel extends React.Component {
    state = {
        buttonState: '',
    };
    changeFont = e => {
        store.dispatch(changeStyle({
            fontFamily: e.target.value,
        }));
    };

    changeFontSize = e => {
        store.dispatch(changeStyle({
            fontSize: e.target.value,
        }));
        store.dispatch(changeStyle({
            height: 'auto',
        }));
    };

    changeFontColor = color => {
        store.dispatch(changeStyle({
            color: color.hex,
        }));
    };

    changeBgColor = color => {
        store.dispatch(changeStyle({
            backgroundColor: color.hex,
        }));
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
        const pinyin = this.props.focus.pinyin;
        store.dispatch(changeWordPinyin(!pinyin));
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
    };
    changeVisible = e => {
        store.dispatch(changeStyle({
            visibility: e.target.checked ? 'hidden' : 'visible',
        }));
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
                <select onChange={this.changeFont} className="wordFont" value={this.props.focus.style.fontFamily}>
                    <option value="黑体">{t('font_hei')}</option>
                    <option value="微软雅黑">{t('font_yahei')}</option>
                    <option value="Serif">Serif</option>
                </select>
                <select onChange={this.changeFontSize} className="wordFont" value={this.props.focus.style.fontSize}>
                    <option value="12px">12px</option>
                    <option value="13px">13px</option>
                    <option value="14px">14px</option>
                    <option value="15px">15px</option>
                    <option value="16px">16px</option>
                    <option value="17px">17px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="22px">22px</option>
                    <option value="26px">26px</option>
                    <option value="30px">30px</option>
                    <option value="34px">34px</option>
                    <option value="38px">38px</option>
                    <option value="42px">42px</option>
                    <option value="46px">46px</option>
                    <option value="50px">50px</option>
                    <option value="54px">54px</option>
                    <option value="58px">58px</option>
                    <option value="62px">62px</option>
                    <option value="66px">66px</option>
                    <option value="70px">70px</option>
                    <option value="80px">80px</option>
                    <option value="90px">90px</option>
                </select>
                <div className="visible">{style.visibility === 'hidden' ? <input type="checkbox" checked onChange={this.changeVisible} /> : <input type="checkbox" onChange={this.changeVisible} />} 隐藏</div>
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
