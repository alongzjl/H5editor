    
    const cancelLine = () => {
    	const lineList = document.getElementsByClassName('lineCanvasShow');
    	const dom = lineList[lineList.length-1];
        dom.style.visibility = 'hidden';
    };
    const adjustLine = (from, to) => {
    	const lineList = document.getElementsByClassName('lineCanvasShow');
    	const line = lineList[lineList.length-1];
    	const fT = parseInt(from.style.top) + parseInt(from.style.height) / 2;
        const tT = parseInt(to.style.top) + parseInt(to.style.height) / 2;
        const fL = parseInt(from.style.left) + parseInt(from.style.width) / 2;
        const tL = parseInt(to.style.left) + parseInt(to.style.width) / 2;
        const CA = Math.abs(tT - fT);
        const CO = Math.abs(tL - fL);
        const H = Math.sqrt(CA * CA + CO * CO);
        let ANG = 180 / Math.PI * Math.acos(CA / H);

        if (tT > fT) {
            var top = (tT - fT) / 2 + fT;
        } else {
            var top = (fT - tT) / 2 + tT;
        }
        if (tL > fL) {
            var left = (tL - fL) / 2 + fL;
        } else {
            var left = (fL - tL) / 2 + tL;
        }

        if ((fT < tT && fL < tL) || (tT < fT && tL < fL) || (fT > tT && fL > tL) || (tT > fT && tL > fL)) {
            ANG *= -1;
        }
        top -= H / 2;

        line.style['-webkit-transform'] = `rotate(${ANG}deg)`;
        line.style['-moz-transform'] = `rotate(${ANG}deg)`;
        line.style['-ms-transform'] = `rotate(${ANG}deg)`;
        line.style['-o-transform'] = `rotate(${ANG}deg)`;
        line.style['-transform'] = `rotate(${ANG}deg)`;
        line.style.top = `${top}px`;
        line.style.left = `${left}px`;
        line.style.height = `${H}px`;
        line.style.visibility = 'visible';
    };
    export {adjustLine,cancelLine}
