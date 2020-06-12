import React from 'react';
import {Image, Text, StyleProp, ImageStyle} from 'react-native';

import {SvgUri} from 'react-native-svg';

interface Props {
  style: any;
  source: {
    uri?: string;
    local?: string;
  };
  width?: number;
  height?: number;
}

const ImageOrSvg: React.FC<Props> = ({style, source, width, height}) => {
  const render = () => {
    if (source?.uri) {
      const image = source.uri;
      if (image.includes('.svg')) {
        return (
          <SvgUri
            width={width || 30}
            height={height || 30}
            uri={image}></SvgUri>
        );
      } else {
        return <Image style={style} source={{uri: image}}></Image>;
      }
    }

    if (source?.local) {
    }
  };

  return render();
};

export default ImageOrSvg;
