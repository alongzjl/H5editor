import BaseModal from './BaseModal';

export default class ImageModal extends BaseModal {
    constructor(src = '') {
        super();
        this.src = src;
        this.name = 'ImageModal';
        this.style = {
            width: '100px',
            height: '100px',
            opacity: 1,
            transform: 'rotate(0deg)',
            shadow: { r: 0, g: 0, b: 0, a: 0 },
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
        };
        this.animations = [];
        this.action = {};
    }
}
