import React from 'react';
import './video.less';

export default class Video extends React.Component {
   
    render() {
        const { value } = this.props;
        const srcIndex = value.code.indexOf('src=');
        const srcEnd = value.code.indexOf(' ', srcIndex);
        const src = value.code.substring(srcIndex + 5, srcEnd - 1);
		 return (
                <div className={value.className} style={value.style}>
                    <iframe width={value.style.width} height={value.style.height} src={src} allowFullScreen frameBorder={0} />
                </div>
            );
       }
}

