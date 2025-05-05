import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BannerSlider = ({
  images = [],
  height = 160,
  borderRadius = 10,
  autoSlide = true,
  slideInterval = 3000,
}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValues = useRef(images.map(() => new Animated.Value(1))).current;

  const animateIndicator = (activeIndex) => {
    animatedValues.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index === activeIndex ? 1.4 : 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  };

  useEffect(() => {
    animateIndicator(currentIndex % images.length);

    if (autoSlide && images.length > 1) {
      const interval = setInterval(() => {
        let nextIndex = currentIndex + 1;

        if (nextIndex >= images.length) {
          // Reset scroll without animation
          flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
          nextIndex = 0;
        } else {
          flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }

        setCurrentIndex(nextIndex);
        animateIndicator(nextIndex % images.length);
      }, slideInterval);

      return () => clearInterval(interval);
    }
  }, [autoSlide, currentIndex, images.length, slideInterval]);

  const onScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
    animateIndicator(index % images.length);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.imageWrapper, { height, borderRadius }]}>
      <Image
        source={item}
        style={[styles.image, { height, borderRadius }]}
        resizeMode="cover"
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
    </View>
  );

  return (
    <View style={{ alignItems: 'center', paddingBottom: 20 }}>
      <View style={[styles.container, { height }]}>
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderItem}
          keyExtractor={(_, index) => `banner-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />
      </View>

      {/* Indicator outside below image */}
      {images.length > 1 && (
        <View style={styles.indicatorWrapper}>
          {images.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  transform: [{ scale: animatedValues[index] }],
                  backgroundColor:
                    index === (currentIndex % images.length) ? '#FF5500' : '#ccc',
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    alignSelf: 'center',
    position: 'relative',
    marginTop: 16,
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '92%',
    borderRadius: 10,
  },
  indicatorWrapper: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default BannerSlider;
