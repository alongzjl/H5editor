import './disableScroll.less';

export default function (bodyCls = 'modal-open') {
    let scrollTop;
    return {
        afterOpen() {
            scrollTop = document.scrollingElement.scrollTop;
            document.body.classList.add(bodyCls);
            document.body.style.top = `${-scrollTop}px`;
        },
        beforeClose() {
            document.body.classList.remove(bodyCls);
            document.scrollingElement.scrollTop = scrollTop;
        },
    };
}
