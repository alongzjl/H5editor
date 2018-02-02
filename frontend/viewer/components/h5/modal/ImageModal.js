import BaseModal from './BaseModal';

export default class ImageModal extends BaseModal {
    constructor(src = '',style) {
        super();
        this.src = src;
        this.name = 'ImageModal';
        this.style = {
            opacity: 1,
            transform: 'rotate(0deg)',
            shadow: { r: 0, g: 0, b: 0, a: 0 },
            border: 'none',
            position: 'absolute',
             top: 0,
            left: 0,
            ...style
        };
        this.animations = [];
        this.action = {};
        this.to = undefined;
        this.showColor = '#000';
    }
}
