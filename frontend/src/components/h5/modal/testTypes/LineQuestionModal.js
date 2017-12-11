import BaseModal from '../BaseModal';

export default class LineQuestionModal extends BaseModal {
    constructor(num, text = '双击输入文字或长按选择图片', style, position) {
        super();
        this.name = 'LineQuestionModal';
        this.text = text;
        this.contenteditable = false;
        this.src = undefined;
        this.num = num;
        this.position = position;
        this.style = {
            height: '26px',
            lineHeight: '26px',
            width: '92px',
            fontSize: '14px',
            textAlign: 'center',
            opacity: 1,
            transform: 'rotate(0deg)',
            border: 'none',
            ...style,
        };
        this.to = undefined;
    }
}
