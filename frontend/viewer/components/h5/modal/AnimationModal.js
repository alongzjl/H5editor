import BaseModal from './BaseModal';

export default class AnimationModal extends BaseModal {
    constructor() {
        super();
        this.name = 'AnimationModal';
        this.className = '';
        this.animationIterationCount = 1;
        this.animationDelay = '0s';
        this.animationDuration = '1s';
    }
}
