import Noty from 'noty';
import 'noty/lib/noty.css';
import t from '../../i18n';

const noty = {
    success(msg) {
        const notyItem = new Noty({
            layout: 'topCenter',
            type: 'success',
            text: msg || t('success'),
            // modal: true,
            timeout: 500,
            progressBar: false,
        });
        notyItem.show();
    },
    error(msg) {
        const notyItem = new Noty({
            layout: 'topCenter',
            type: 'error',
            text: msg || t('failed'),
            // modal: true,
            timeout: 1000,
            progressBar: false,
        });
        notyItem.show();
    },
};
export default noty;
