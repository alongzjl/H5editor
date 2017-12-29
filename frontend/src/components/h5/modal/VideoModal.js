import BaseModal from './BaseModal';

export default class VideoModal extends BaseModal {
    constructor(code = '') {
        super();
        this.code = code;
        this.name = 'VideoModal';
        this.style = {
            width: '375px',
            height: 'auto',
            position: 'absolute',
            top: 0,
            left: 0,
        };
    }
}
