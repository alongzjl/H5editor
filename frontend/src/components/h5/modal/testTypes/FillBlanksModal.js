import BaseModal from '../BaseModal';

export default class FillBlanksModal extends BaseModal {
    constructor(style, num, selectList = '填加／答案') {
        super();
        this.name = 'FillBlanksModal';
        this.style = {
            width: '180px',
            height: '32px',
            ...style,
        };
        this.num = num;
        this.selectList = selectList;
        this.answerIndex = 0;
    }
}
