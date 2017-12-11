import React from 'react';
import store from '../../../store';
import { addElements } from '../../../actions/h5Actions';
import ShapeModal from '../modal/ShapeModal';
import * as Shapes from '../elements/shapes/Shapes';
import './shapePanel.less';

const RecentShapeList = ({ onSelected }) => {
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
    const shapes = localStorage.getItem('shapes') ? JSON.parse(localStorage.getItem('shapes')) : [];
    return (
        <div className="shapeList flex_row_start">
            {
                shapes && shapes.map((shapeName, index) => {
                    switch (shapeName) {
                    case 'Triangle':
                        return (
                            <div key={`${shapeName}${index}`}>
                                <Shapes.Triangle style={style} onSelected={clickShape} />
                            </div>
                        );
                    case 'Circle':
                        return (
                            <div key={`${shapeName}${index}`}>
                                <Shapes.Circle style={style} onSelected={clickShape} />
                            </div>
                        );
                    case 'Square':
                        return (
                            <div key={`${shapeName}${index}`}>
                                <Shapes.Square style={style} onSelected={clickShape} />
                            </div>
                        );
                    case 'CircleSquare':
                        return (
                            <div key={`${shapeName}${index}`}>
                                <Shapes.CircleSquare style={style} onSelected={clickShape} />
                            </div>
                        );
                    case 'Polygon8':
                        return (
                            <div key={`${shapeName}${index}`}>
                                <Shapes.Polygon8 style={style} onSelected={clickShape} />
                            </div>
                        );
                    case 'Polygon5':
                        return (
                            <div key={`${shapeName}${index}`}>
                                <Shapes.Polygon5 style={style} onSelected={clickShape} />
                            </div>
                        );
                    case 'Star':
                        return (
                            <div key={`${shapeName}${index}`}>
                                <Shapes.Star style={style} onSelected={clickShape} />
                            </div>
                        );
                    case 'LineArrow':
                        return (
                            <div key={`${shapeName}${index}`}>
                                <Shapes.LineArrow style={style} onSelected={clickShape} />
                            </div>
                        );
                    default:
                        return null;
                    }
                })
            }
        </div>
    );
};

export default class RecentShapePanel extends React.Component {
    addShape = shape => {
        store.dispatch(addElements(new ShapeModal(shape).plainObject()));
    };

    render() {
        return (
            <div className="shapePanelBody">
                <RecentShapeList onSelected={this.addShape} />
            </div>
        );
    }
}
