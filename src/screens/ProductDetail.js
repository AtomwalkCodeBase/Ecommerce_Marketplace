import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProductDetails } from '../services/productServices';
import HeaderComponent from '../components/HeaderComponent';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slice/CartSlice';
import { colors } from '../Styles/appStyle';
import { buttonStyles } from '../Styles/ButtonStyles';

const { width } = Dimensions.get('window');

const ProductDetail = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const cartItems = useSelector((state) => state.cart.cartItems);


  const isInCart = cartItems.some((item) => item.id === parseInt(productId));

  const fetchProductDetails = async () => {
    try {
        const res = await getProductDetails(productId);
        setProduct(res.data);
    } catch (error) {
      setError('Failed to load product details');
      console.log('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleImageScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffset / width);
    setCurrentImageIndex(newIndex);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    console.log('Share product');
  };

  const handleAddToCart = () => {
    if (isInCart) {
      router.push('/cart');
    } else {
      dispatch(addToCart(product));
    }
  };

  const handleBuyNow = () => {
    // navigation.navigate('Checkout');
    router.push('/DeliveryAddressScreen')
  };


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: colors.error, fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  if (!product) return null;

  const images =
    product.c_images?.length > 0
      ? product.c_images
      : product.image
      ? [product.image]
      : [];

  const shortDescription =
    product.description && product.description.length > 175
      ? product.description.substring(0, 175) + '...'
      : product.description || 'No description available';

  return (
    <ScrollView style={styles.container}>
      <HeaderComponent title="Product Details" onLeftPress={() => router.back()} />

      {/* Image Slider */}
      {images.length > 0 ? (
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <View key={index} style={{ width, height: width }}>
                <Image source={{ uri: img }} style={styles.productImage} />
              </View>
            ))}
          </ScrollView>

          {/* Share and Favorite */}
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Feather name="share-2" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <MaterialIcons
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={20}
                color={isFavorite ? colors.primary : '#333'}
              />
            </TouchableOpacity>
          </View>

          {/* Dots */}
          {images.length > 1 && (
            <View style={styles.dotContainer}>
              {images.map((_, index) => (
                <View key={index} style={styles.dot(index === currentImageIndex)} />
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.imageContainer, styles.centered]}>
          <Text>No image available</Text>
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.categoryText}>{product.category || 'Uncategorized'}</Text>
        <Text style={styles.productTitle}>{product.product_name || 'Untitled Product'}</Text>
        <Text style={styles.sellingPrice}>₹{product.selling_price}</Text>
        <Text
          style={[
            styles.stockText,
            { color: product.available_qty > 0 ? 'green' : 'red' },
          ]}
        >
          {product.available_qty > 0 ? 'In Stock' : 'Out of Stock'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {showFullDescription ? product.description : shortDescription}
        </Text>
        {product.description && product.description.length > 150 && (
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.readMoreText}>
              {showFullDescription ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Similar Products</Text>
      <View style={styles.similarContainer}>
        <Text style={styles.similarText}>No similar products found</Text>
      </View>

      <View style={styles.reviewsContainer}>
        <Text style={styles.sectionTitle}>Reviews (0)</Text>
        <Text style={styles.similarText}>No reviews yet</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={buttonStyles.secondary} onPress={handleAddToCart}>
          <Text style={buttonStyles.secondaryText}>
            {isInCart ? 'Go to cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            buttonStyles.primary,
            { opacity: product.available_qty <= 0 ? 0.6 : 1 },
          ]}
          disabled={product.available_qty <= 0}
          onPress={handleBuyNow}
        >
          <Text style={buttonStyles.primaryText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: width,
    position: 'relative',
    // backgroundColor: colors.muted,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    marginLeft: 12,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: (active) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: active ? colors.primary : colors.muted,
    marginHorizontal: 4,
  }),
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 16,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sellingPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stockText: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.muted,
    color: colors.textPrimary,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  readMoreText: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: colors.primary,
    textAlign: 'right',
  },
  similarContainer: {
    padding: 16,
  },
  similarText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  reviewsContainer: {
    paddingVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.muted,
  },
});
