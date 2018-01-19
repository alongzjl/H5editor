import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Select from 'react-select';
import { SketchPicker } from 'react-color';
import { changeStyle } from '../../../actions/h5Actions';
import store from '../../../store';
import CropperDialog from '../dialog/cropperDialog';
import AddImageDialog from '../dialog/addImageDialog';
import API_URL from '../../../common/url';
import t from '../../i18n';
import './shapePanel.less';
import './imagePanel.less';

export default class ImagePanel extends React.Component {
    constructor() {
        super();
        this.state = {
            shadowColor: false,
            borderColorTool: false,
        };
    }
    showCropper = () => {
        this.cropperModal.show();
    };
    showAddImage = () => {
        this.addImageModal.show();
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
            opacity: opc,
        }));
    };
    changeBorder = e => {
        if (e.value === 'border') {
            store.dispatch(changeStyle({
                border: '#000 solid 1px',
                borderStyle: 'solid',
                borderColor: '#000',
                borderWidth: '1px',
            }));
        } else {
            store.dispatch(changeStyle({
                border: 'none',
            }));
        }
    };
    changeBorderWidth = e => {
        store.dispatch(changeStyle({
            borderWidth: Number.parseInt(e.target.value),
        }));
    };
    changeBorderRadius = e => {
        store.dispatch(changeStyle({
            borderRadius: Number.parseInt(e.target.value),
        }));
    };
    changeBorderColor = color => {
        store.dispatch(changeStyle({
            borderColor: color.hex,
        }));
        this.setState({
            borderColorTool: false,
        });
    };
    changeRotate = rotate => {
        store.dispatch(changeStyle({
            transform: `rotate(${rotate}deg)`,
        }));
    };
    handleBorderTool = () => {
        this.setState({
            borderColorTool: !this.state.borderColorTool,
        });
    };
    changeShadowOpacity = opc => {
        const shadow = this.props.focus.style.shadow ? this.props.focus.style.shadow : { r: 0, g: 0, b: 0, a: 0 };
        store.dispatch(changeStyle({
            shadow: {
                r: shadow.r,
                g: shadow.g,
                b: shadow.b,
                a: opc,
            },
        }));
    };

    changeShadowColor = color => {
        const shadow = this.props.focus.style.shadow ? this.props.focus.style.shadow : { r: 0, g: 0, b: 0, a: 0 };
        store.dispatch(changeStyle({
            shadow: {
                r: color.rgb.r,
                g: color.rgb.g,
                b: color.rgb.b,
                a: shadow.a,
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
        const { style } = this.props.focus;
        return (
            <div className="shapePanelBody imagePanel">
                <div className="previewImg"><img src={API_URL.upload + this.props.focus.src} alt="" /></div>
                <div className="flex_row_around action">
                    <button onClick={this.showCropper}>{t('image_clip')}</button>
                    <button onClick={this.showAddImage}>{t('image_change')}</button>
                </div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor">
                    <div className="width flex_row_around flex_vertical_middle">
                        {t('width')}
                        <input
                            type="number" className="inputClass" min={0} value={Number.parseInt(style.width)}
                            onChange={this.changeWidth}
                        />
                        px
                    </div>
                    <div className="height flex_row_around flex_vertical_middle">
                        {t('height')}<input type="number" className="inputClass" min={0} value={Number.parseInt(style.height)} onChange={this.changeHeight} />px
                    </div>
                </div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor opacity">
                    {t('opacity')}
                    <Slider onChange={this.changeOpacity} min={0} max={1} step={0.1} value={style.opacity} />
                    <span>{Number.parseInt(style.opacity * 100)}%</span>
                </div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor opacity">
                    {t('rotation')}
                    <Slider
                        onChange={this.changeRotate} min={-180} max={180} step={1}
                        value={Number.parseInt(style.transform.substring(7))}
                    />
                    <span>{Number.parseInt(style.transform.substring(7))}</span>
                </div>
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor">
                    {t('border')}
                     <Select
                         name="form-field-name1"
                         onChange={this.changeBorder}
                         value={style.border === 'none' ? 'none' : 'border'}
                         clearable={false}
                         searchable={false}
                         options={[{ value: 'none', label: t('border_none') }, { value: 'border', label: t('border_line') }]}
                     />
                </div>
                {
                    style.border !== 'none' ?
                        <div>
                            <div className="flex_row_between flex_vertical_middle line fs14 blackColor">
                                <div className="width flex_row_around flex_vertical_middle">
                                    {t('width')}
                                    <input type="number" className="inputClass" min={0} value={parseInt(style.borderWidth)} onChange={this.changeBorderWidth} />px
                                </div>
                                <div className="height flex_row_around flex_vertical_middle">
                                    {t('border_radius')}<input type="number" className="inputClass" min={0} value={parseInt(style.borderRadius)} onChange={this.changeBorderRadius} />px
                                </div>
                            </div>
                        </div> : null
                }
                {
                    style.border !== 'none' ?
                        <div className="flex_row_end flex_vertical_middle line fs14 blackColor border">
                            <div className="flex_row_start flex_vertical_middle">
                                <div className="colorDiv" style={{ backgroundColor: style.borderColor }} />
                                <button
                                    className="colorBtn flex_row_center flex_vertical_middle"
                                    onClick={this.handleBorderTool}
                                >
                                    <img alt="" src={require('./images/color.png')} />
                                </button>
                            </div>
                        </div> : null
                }
                {
                    this.state.borderColorTool ?
                        <div style={{ position: 'absolute', top: '160px', left: 0, zIndex: 20 }}><SketchPicker onChangeComplete={this.changeBorderColor} color={style.borderColor} /></div> : null
                }
                <div className="flex_row_between flex_vertical_middle line fs14 blackColor opacity">
                    {t('shadow')}
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
                <AddImageDialog ref={com => { this.addImageModal = com; }} focus={this.props.focus} />
                <CropperDialog ref={com => { this.cropperModal = com; }} type="image" focus={this.props.focus} />
            </div>
        );
    }
}
