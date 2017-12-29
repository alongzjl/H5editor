import React from 'react';
import { SketchPicker } from 'react-color';
import Slider from 'rc-slider';
import store from '../../../store';
import { addElements, changeShape, changeStyle } from '../../../actions/h5Actions';
import * as Shapes from '../elements/shapes/Shapes';
import ShapeModal from '../modal/ShapeModal';
import Select from 'react-select';
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
                <Shapes.Star style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.CircleSquare style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.LineArrow style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.Polygon8 style={style} onSelected={clickShape} />
            </div>
            <div>
                <Shapes.Polygon5 style={style} onSelected={clickShape} />
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

    changeColor = (color = 'none') => {
        const val = color.hex ? color.hex : color;
        store.dispatch(changeStyle({
            fill: val,
        }));
        this.setState({
            fillColorTool: false,
        });
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
        if (e.value === 'border') {
            store.dispatch(changeStyle({
                stroke: '#000',
                strokeDasharray: 'none',
                strokeWidth: 1,
            }));
        } else if (e.value === 'dash') {
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
            strokeWidth: parseInt(e.value),
        }));
    };
    changeBorderColor = (color = 'none') => {
        const val = color.hex ? color.hex : color;
        store.dispatch(changeStyle({
            stroke: val,
        }));
        this.setState({
            borderColorTool: false,
        });
    };
    changeLineCap = e => {
        store.dispatch(changeStyle({
            strokeLinecap: e.target.value,
        }));
    };
    changeRotate = rotate => {
        store.dispatch(changeStyle({
            transform: `rotate(${rotate}deg)`,
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
        this.setState({
            shadowColor: false,
        });
    };
    handleShadowColor = () => {
        this.setState({
            shadowColor: !this.state.shadowColor,
        });
    };
    render() {
        const { style } = this.props;
        const shadow = style.shadow ? style.shadow : { r: 0, g: 0, b: 0, a: 0 };
        const border_types = [{value:'none',label:t('border_none')},{value:'border',label:t('border_line')},{value:'dash',label:t('border_dash')}];
        const width_types = [{value:1,label:1},{value:2,label:2},{value:3,label:3},{value:4,label:4},{value:5,label:5},{value:6,label:6},{value:7,label:7},{value:8,label:8},{value:9,label:9}];
        return (
            <div style={{position:'relative'}}>
                <div className="flex_row_between flex_vertical_middle fs14 color blackColor">
                    {t('shape_fill')}
                    <div className="flex_row_start flex_vertical_middle">
                        <span style={{ backgroundColor: style.fill }} />
                        <button
                            className="colorBtn flex_row_center flex_vertical_middle"
                            onClick={this.handleFillTool}
                        >
                            <img alt="" src={require('./images/color.png')} />
                        </button>
                    </div>
                    <ColorItem onChange={this.changeColor} />
                </div>
                {
                    this.state.fillColorTool ?
						<div style={{position:'absolute',top:'130px',left:0,zIndex:20}}><SketchPicker onChangeComplete={this.changeColor} color={style.fill} /></div> : null
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
                    {t('opacity')}
                    <Slider onAfterChange={this.changeOpacity} min={0} max={1} step={0.1} />
                    <span>{parseInt(style.fillOpacity * 100)}%</span>
                </div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor opacity">
                    {t('rotation')}
                    <Slider
                        onChange={this.changeRotate} min={-180} max={180} step={1}
                        value={parseInt(style.transform.substring(7))}
                    />
                    <span>{parseInt(style.transform.substring(7))}</span>
                </div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor">
                    {t('border')}
                     <Select
		        	 	name="form-field-name1"
		                onChange={this.changeBorder}
		                value={style.stroke === 'none' ? 'none' : (style.strokeDasharray === 'none' ? 'border' : 'dash')}
		                clearable={false}
		                searchable={false}
		               options={border_types}
		            />
                </div>
               {
                    style.stroke !== 'none' ?
                        <div className="flex_row_end flex_vertical_middle line fs14 blackColor border">
                            <div className="flex_row_start flex_vertical_middle">
                            	{t('width')}
	                            <Select
					        	 	name="form-field-name1"
					                onChange={this.changeBorderWidth}
					                value={style.strokeWidth}
					                clearable={false}
					                searchable={false}
					               options={width_types}
					            />px
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
                        <div style={{position:'absolute',top:'380px',left:0,zIndex:20}}><SketchPicker onChangeComplete={this.changeBorderColor} color={style.stroke} /></div> : null
                }

                <div className="flex_row_between flex_vertical_middle line fs14 blackColor opacity">
                    {t('shadow')}
                    <Slider onAfterChange={this.changeShadowOpacity} min={0} max={1} step={0.1} defaultValue={shadow.a} />
                    <span>{parseInt(shadow.a * 100)}%</span>
                </div>
                <div className="flex_row_end flex_vertical_middle fs14 color blackColor">
                    <span style={{ backgroundColor: `rgba(${shadow.r}, ${shadow.g}, ${shadow.b}, 1)` }} />
                    <button
                        className="colorBtn flex_row_center flex_vertical_middle"
                        onClick={this.handleShadowColor}
                    >
                        <img alt="" src={require('./images/color.png')} />
                    </button>
                </div>
                {
                    this.state.shadowColor ? style.stroke !== 'none' ? 
                        <div style={{position:'absolute',top:'170px',left:0,zIdex:20}}><SketchPicker onChangeComplete={this.changeShadowColor} color={style.shadow} /></div> : 
                        <div style={{position:'absolute',top:'420px',left:0,zIdex:20}}><SketchPicker onChangeComplete={this.changeShadowColor} color={style.shadow} /></div>: null
                }
            </div>
        );
    }
}
const ColorItem = ({ onChange }) => {
    const defaultColorList = ['#00BCD3', '#B7DFCB', '#5C5D5E', '#B6C4DC', '#7CA2D2', '#FAF8C1', '#D6ABE9', '#B4D4B1', '#EF6B56', '#EB9E6A', '#2D2A1E', '#F2D700', '#EAA73A'];
    return (
        <div className="defaultColor">
            <button className="colorItem" onClick={() => onChange()}><img src={require('./images/nocolor.png')} width={26} height={26} /></button>
            {
                defaultColorList.map(color => <button key={color} className="colorItem" style={{ backgroundColor: color }} onClick={() => onChange(color)} />)
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
