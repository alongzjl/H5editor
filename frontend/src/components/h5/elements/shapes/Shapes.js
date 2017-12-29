import React from 'react';
import './shapes.less';

const Shapes = ({ name, style }) => {
    switch (name) {
    case 'Triangle':
        return <Triangle style={style} />;
    case 'Circle':
        return <Circle style={style} />;
    case 'Square':
        return <Square style={style} />;
    case 'CircleSquare':
        return <CircleSquare style={style} />;
    case 'Polygon8':
        return <Polygon8 style={style} />;
    case 'Polygon5':
        return <Polygon5 style={style} />;
    case 'Star':
        return <Star style={style} />;
    case 'LineArrow':
        return <LineArrow style={style} />;
    default:
        break;
    }
};
export default Shapes;

export const Triangle = ({ style, onSelected = () => {} }) => {
    const selectShape = () => {
        onSelected('Triangle');
    };
    return (
        <svg width={`${parseInt(style.width)}`} height={`${parseInt(style.height)}`} onClick={selectShape}>
            <polygon
                strokeDasharray={style.strokeDasharray}
                strokeLinejoin={style.strokeLinecap ? style.strokeLinecap : 'inherit'}
                points={`${parseInt(style.width) / 2},0 ${parseInt(style.width)},${parseInt(style.height)} 0,${parseInt(style.height)}`}
                fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth} fillOpacity={style.fillOpacity}
            />
        </svg>
    );
};

export const Circle = ({ style, onSelected = () => {} }) => {
    const selectShape = () => {
        onSelected('Circle');
    };
    const width = parseInt(style.width);
    const height = parseInt(style.height);
    const defaultLong = width >= height ? height : width;
    return (
        <svg width={`${defaultLong}`} height={`${defaultLong}`} onClick={selectShape}>
            <circle
                strokeDasharray={style.strokeDasharray}
                strokeLinejoin={style.strokeLinecap}
                cx={`${width / 2}`} cy={`${height / 2}`}
                r={`${defaultLong / 2}`} fill={style.fill} stroke={style.stroke}
                strokeWidth={style.strokeWidth}
                fillOpacity={style.fillOpacity}
            />
        </svg>
    );
};

export const Square = ({ style, onSelected = () => {} }) => {
    const selectShape = () => {
        onSelected('Square');
    };
    const width = parseInt(style.width);
    const height = parseInt(style.height);
    const defaultLong = width >= height ? height : width;
    return (
        <svg width={`${width}`} height={`${height}`} onClick={selectShape}>
            <rect
                strokeDasharray={style.strokeDasharray}
                strokeLinejoin={style.strokeLinecap}
                width="100%" height="100%" fill={style.fill} stroke={style.stroke}
                strokeWidth={style.strokeWidth} fillOpacity={style.fillOpacity}
            />
        </svg>
    );
};

export const CircleSquare = ({ style, onSelected = () => {} }) => {
    const selectShape = () => {
        onSelected('CircleSquare');
    };
    const width = parseInt(style.width);
    const height = parseInt(style.height);
    const defaultLong = width >= height ? height : width;
    return (
        <svg width={`${width}`} height={`${height}`} onClick={selectShape}>
            <rect
                strokeDasharray={style.strokeDasharray}
                strokeLinejoin={style.strokeLinecap}
                rx={`${width / 10}`} ry={`${height / 10}`}
                width="100%" height="100%" fill={style.fill} stroke={style.stroke}
                strokeWidth={style.strokeWidth} fillOpacity={style.fillOpacity}
            />
        </svg>
    );
};

export const Polygon5 = ({ style, onSelected = () => {} }) => {
    const selectShape = () => {
        onSelected('Polygon5');
    };
    const w = parseInt(style.width);
    const h = parseInt(style.height);
    const defaultLong = w >= h ? h : w;
    return (
        <svg width={`${w}`} height={`${h}`} onClick={selectShape}>
            <polygon
                strokeDasharray={style.strokeDasharray}
                strokeLinejoin={style.strokeLinecap}
                points={`${0.5 * w},0 ${w},${0.4 * h} ${0.8 * w},${h} ${0.2 * w},${h} 0,${0.4 * h}`}
                fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth}
                fillOpacity={style.fillOpacity}
            />
        </svg>
    );
};
export const Polygon8 = ({ style, onSelected = () => {} }) => {
    const selectShape = () => {
        onSelected('Polygon8');
    };
    const w = parseInt(style.width);
    const h = parseInt(style.height);
    const defaultLong = w >= h ? h : w;
    return (
        <svg width={`${w}`} height={`${h}`} onClick={selectShape}>
            <polygon
                strokeDasharray={style.strokeDasharray}
                strokeLinecap={style.strokeLinecap}
                points={`${0.5 * w},0 ${0.85 * w},${0.15 * h} ${w},${0.5 * h} ${0.85 * w},${0.85 * h} ${0.5 * w},${h} ${0.15 * w},${0.85 * h} 0,${0.5 * h} ${0.15 * w},${0.15 * h}`}
                fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth}
                fillOpacity={style.fillOpacity}
            />
        </svg>
    );
};
export const Star = ({ style, onSelected = () => {} }) => {
    const selectShape = () => {
        onSelected('Star');
    };
    const w = parseInt(style.width);
    const h = parseInt(style.height);
    const defaultLong = w >= h ? h : w;
    return (
        <svg width={`${w}`} height={`${h}`} onClick={selectShape}>
            <polygon
                strokeDasharray={style.strokeDasharray}
                strokeLinecap={style.strokeLinecap}
                points={`${0.5 * w},0 ${0.65 * w},${0.35 * h} ${w},${0.4 * h} ${0.75 * w},${0.65 * h} ${0.8 * w},${h} ${0.5 * w},${0.85 * h} ${0.2 * w},${h} ${0.25 * w},${0.65 * h} 0,${0.4 * h} ${0.35 * w},${0.35 * h}`}
                fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth}
                fillOpacity={style.fillOpacity}
            />
        </svg>
    );
};
export const LineArrow = ({ style, onSelected = () => {} }) => {
    const selectShape = () => {
        onSelected('LineArrow');
    };
    const w = parseInt(style.width);
    const h = parseInt(style.height);
    const defaultLong = w >= h ? h : w;
    return (
        <svg width={`${w}`} height={`${h}`} onClick={selectShape}>
            <defs>
                <marker
                    id="arrow"
                    markerUnits="strokeWidth"
                    markerWidth="12"
                    markerHeight="12"
                    viewBox="0 0 12 12"
                    refX="6"
                    refY="6"
                    orient="auto"
                >
                    <path d="M2,2 L10,6 L2,10 L6,6 L2,2" fill={style.fill} />
                </marker>
            </defs>
            <line
                strokeDasharray={style.strokeDasharray}
                strokeLinecap={style.strokeLinecap}
                x1="0" y1={h} x2={w - 5} y2="5" fill={style.fill} stroke={style.fill}
                strokeWidth={style.strokeWidth ? style.strokeWidth : '1'} markerEnd="url(#arrow)"
                fillOpacity={style.fillOpacity}
            />
        </svg>
    );
};
