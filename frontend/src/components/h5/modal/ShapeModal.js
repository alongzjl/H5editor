import BaseModal from './BaseModal';

export default class ShapeModal extends BaseModal {
    constructor(name = '') {
        super();
        this.shapeName = name;
        this.name = 'ShapeModal';
        this.style = {
            width: '100px',
            height: '100px',
            fill: '#00BCD3',
            stroke: 'none',
            strokeWidth: 0,
            fillOpacity: 1,
            shadow: { r: 0, g: 0, b: 0, a: 0 },
            transform: 'rotate(0deg)',
        };
        this.animations = [];
        this.action = {};
    }
}
