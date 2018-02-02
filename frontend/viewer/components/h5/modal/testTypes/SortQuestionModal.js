import BaseModal from '../BaseModal';

export default class SortQuestionModal extends BaseModal {
    constructor(style, num, answer = '', answerShow = '') {
        super();
        this.name = 'SortQuestionModal';
        this.style = {
            width: '70px',
            height: '32px',
            background: '#fff',
            cursor: 'pointer',
            position: 'absolute',
            ...style,
        };
        this.num = num;
        this.answer = answer;
        this.answerShow = answerShow;
    }
}
