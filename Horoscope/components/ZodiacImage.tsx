import React from 'react';
import { Image, ImageStyle, StyleSheet } from 'react-native';

type ZodiacImageProps = {
  sign: string;
  size?: number;
  style?: ImageStyle;
};

export function ZodiacImage({ sign, size = 40, style }: ZodiacImageProps) {
  // Using Aries image as template for all signs
  const imageSource = require('../assets/images/Signs/Aries.jpg');

  return (
    <Image
      source={imageSource}
      style={[
        styles.image,
        { width: size, height: size },
        style
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    borderRadius: 20, // Make the image circular
  },
});
