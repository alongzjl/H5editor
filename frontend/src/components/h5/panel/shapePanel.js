import React from 'react';
import { SketchPicker } from 'react-color';
import Slider from 'rc-slider';
import store from '../../../store';
import { addElements, changeShape, changeStyle } from '../../../actions/h5Actions';
import * as Shapes from '../elements/shapes/Shapes';
import ShapeModal from '../modal/ShapeModal';
import './shapePanel.less';
import t from '../../i18n';

const ShapeList = ({ onSelected }) => {
    const clickShape = shape => {
        onSelected(shape);
    };
    const style = {
        fill: '#00BCD3',
        stroke: 'none',
        strokeWidth: 0,
        width: '50px',
        height: '50px',
    };
    return (
        <div className="shapeList flex_row_start">
            <div>
                <Shapes.Triangle style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.Circle style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.Square style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.CircleSquare style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.Polygon8 style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.Polygon5 style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.Star style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.LineArrow style={style} onSelected={clickShape} />
            </div>
        </div>
    );
};

class ShapeStyle extends React.Component {
    constructor() {
        super();
        this.state = {
            fillColorTool: false,
            borderColorTool: false,
            shadowColor: false,
        };
    }

    changeColor = color => {
        const val = color.hex ? color.hex : color;
        store.dispatch(changeStyle({
            fill: val,
        }));
    };
    handleFillTool = () => {
        this.setState({
            fillColorTool: !this.state.fillColorTool,
        });
    };
    handleBorderTool = () => {
        this.setState({
            borderColorTool: !this.state.borderColorTool,
        });
    };
    changeWidth = e => {
        store.dispatch(changeStyle({
            width: `${e.target.value}px`,
        }));
    };
    changeHeight = e => {
        store.dispatch(changeStyle({
            height: `${e.target.value}px`,
        }));
    };
    changeOpacity = opc => {
        store.dispatch(changeStyle({
            fillOpacity: 1 - opc,
        }));
    };
    changeBorder = e => {
        if (e.target.value === 'border') {
            store.dispatch(changeStyle({
                stroke: '#000',
                strokeDasharray: 'none',
                strokeWidth: 1,
            }));
        } else if (e.target.value === 'dash') {
            store.dispatch(changeStyle({
                stroke: '#000',
                strokeDasharray: '5,5',
                strokeWidth: 1,
            }));
        } else {
            store.dispatch(changeStyle({
                stroke: 'none',
                strokeWidth: 0,
            }));
        }
    };
    changeBorderWidth = e => {
        store.dispatch(changeStyle({
            strokeWidth: parseInt(e.target.value),
        }));
    };
    changeBorderColor = color => {
        const val = color.hex ? color.hex : color;
        store.dispatch(changeStyle({
            stroke: val,
        }));
    };
    changeRotate = rotate => {
        store.dispatch(changeStyle({
            transform: `rotate(${rotate}deg)`,
        }));
    };
    changeVisible = e => {
        store.dispatch(changeStyle({
            visibility: e.target.checked ? 'hidden' : 'visible',
        }));
    };
    changeShadowOpacity = opc => {
        store.dispatch(changeStyle({
            shadow: {
                r: this.props.style.shadow.r,
                g: this.props.style.shadow.g,
                b: this.props.style.shadow.b,
                a: opc,
            },
        }));
    };

    changeShadowColor = color => {
        store.dispatch(changeStyle({
            shadow: {
                r: color.rgb.r,
                g: color.rgb.g,
                b: color.rgb.b,
                a: this.props.style.shadow.a,
            },
        }));
    };
    handleShadowColor = () => {
        this.setState({
            shadowColor: !this.state.shadowColor,
        });
    };
    render() {
        const { style } = this.props;
        return (
            <div>
                <div className="flex_row_start flex_vertical_middle fs14 color blackColor">
                    {t('shape_fill')}
                    <span style={{ backgroundColor: style.fill }} />
                    <button
                        className="colorBtn flex_row_center flex_vertical_middle"
                        onClick={this.handleFillTool}
                    >
                        <img alt="" src={require('./images/color.png')} />
                    </button>
                    <ColorItem onChange={this.changeColor} />
                </div>
                {
                    this.state.fillColorTool ?
                        <SketchPicker onChangeComplete={this.changeColor} color={style.fill} /> : null
                }
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor">
                    <div className="width flex_row_around flex_vertical_middle">
                        {t('width')}
                        <input
                            type="number" className="inputClass" min={0} value={parseInt(style.width)}
                            onChange={this.changeWidth}
                        />
                        px
                    </div>
                    <div className="height flex_row_around flex_vertical_middle">
                        {t('height')}<input
                            type="number" className="inputClass" min={0} value={parseInt(style.height)}
                            onChange={this.changeHeight}
                        />px
                    </div>
                </div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor opacity">
                    {t('opacity')}：
                    <Slider onAfterChange={this.changeOpacity} min={0} max={1} step={0.1} />
                    <span>{parseInt(style.fillOpacity * 100)}%</span>
                </div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor opacity">
                    {t('rotation')}：
                    <Slider
                        onChange={this.changeRotate} min={-180} max={180} step={1}
                        value={parseInt(style.transform.substring(7))}
                    />
                    <span>{parseInt(style.transform.substring(7))}</span>
                </div>
                <div className="flex_row_start flex_vertical_middle line fs14 blackColor">
                    {t('border')}：
                    <select value={style.stroke === 'none' ? 'none' : (style.strokeDasharray === 'none' ? 'border' : 'dash')} onChange={this.changeBorder}>
                        <option value="none">{t('border_none')}</option>
                        <option value="border">{t('border_line')}</option>
                        <option value="dash">{t('border_dash')}</option>
                    </select>
                </div>
                {
                    style.stroke !== 'none' ?
                        <div className="line fs14 blackColor border">
                            {t('width')}：<select value={style.strokeWidth} onChange={this.changeBorderWidth}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>px
                        </div> : null
                }
                {
                    style.stroke !== 'none' ?
                        <div className="flex_row_start flex_vertical_middle line fs14 blackColor border">
                            {t('color')}：
                            <div className="flex_row_start flex_vertical_middle">
                                <div className="colorDiv" style={{ backgroundColor: style.stroke }} />
                                <button
                                    className="colorBtn flex_row_center flex_vertical_middle"
                                    onClick={this.handleBorderTool}
                                >
                                    <img alt="" src={require('./images/color.png')} />
                                </button>
                            </div>
                            <ColorItem onChange={this.changeBorderColor} />
                        </div> : null
                }
                {
                    this.state.borderColorTool ?
                        <SketchPicker onChangeComplete={this.changeBorderColor} color={style.stroke} /> : null
                }

                <div className="visible">{style.visibility === 'hidden' ? <input type="checkbox" checked onChange={this.changeVisible} /> : <input type="checkbox" onChange={this.changeVisible} />} 隐藏</div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor opacity">
                    {t('shadow')}：
                    <Slider onAfterChange={this.changeShadowOpacity} min={0} max={1} step={0.1} defaultValue={style.shadow.a} />
                    <span>{parseInt(style.shadow.a * 100)}%</span>
                </div>
                <div className="flex_row_end flex_vertical_middle fs14 color blackColor">
                    <span style={{ backgroundColor: `rgba(${style.shadow.r}, ${style.shadow.g}, ${style.shadow.b}, 1)` }} />
                    <button
                        className="colorBtn flex_row_center flex_vertical_middle"
                        onClick={this.handleShadowColor}
                    >
                        <img alt="" src={require('./images/color.png')} />
                    </button>
                </div>
                {
                    this.state.shadowColor ?
                        <SketchPicker onChangeComplete={this.changeShadowColor} color={style.shadow} /> : null
                }
            </div>
        );
    }
}
const ColorItem = ({ onChange }) => {
    const defaultColorList = ['#ffffff', '#00BCD3', '#B7DFCB', '#5C5D5E', '#B6C4DC', '#7CA2D2', '#FAF8C1', '#D6ABE9', '#B4D4B1', '#EF6B56', '#EB9E6A', '#2D2A1E', '#F2D700', '#EAA73A'];
    return (
        <div className="defaultColor">
            {
                defaultColorList.map(color => <button className="colorItem" style={{ backgroundColor: color }} onClick={() => onChange(color)} />)
            }
        </div>
    );
};
export default class ShapePanel extends React.Component {
    addShape = shape => {
        if (this.props.focus.id) {
            store.dispatch(changeShape(shape));
        } else {
            this.saveRecent(shape);
            store.dispatch(addElements(new ShapeModal(shape).plainObject()));
        }
    };
    saveRecent = name => {
        let shapes = localStorage.getItem('shapes');
        shapes = shapes ? JSON.parse(shapes) : [];
        shapes = new Set(shapes);
        shapes.add(name);
        localStorage.setItem('shapes', JSON.stringify([...shapes]));
    };
    render() {
        return (
            <div className="shapePanelBody">
                {
                    this.props.focus.id ? <ShapeStyle style={this.props.focus.style} /> : <ShapeList onSelected={this.addShape} />
                }
            </div>
        );
    }
}
