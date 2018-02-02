/**
 * Created by sunlong on 2017/3/20.
 */
import BaseModal from './BaseModal';

export default class HighlightModal extends BaseModal {
    constructor(element) {
        super();
        this.style = { ...element.style, opacity: 0.5, backgroundColor: '#000' };
        this.name = 'HighlightModal';
    }
}
