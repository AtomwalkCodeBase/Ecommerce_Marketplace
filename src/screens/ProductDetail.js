import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProductDetails } from '../services/productServices';
import HeaderComponent from '../components/HeaderComponent';
import { Ionicons, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
`;

const ImageContainer = styled.View`
  width: 100%;
  height: ${width}px;
  position: relative;
  background-color: #f8f8f8;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const ImageSlider = styled.ScrollView`
  width: 100%;
  height: 100%;
`;

const ImageActions = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
  flex-direction: row;
  gap: 12px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.8);
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const DotContainer = styled.View`
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? '#FF5500' : '#ccc'};
  margin: 0 4px;
`;

const ProductInfo = styled.View`
  padding: 16px;
`;

const CategoryText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const ProductTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const SellingPrice = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #FF5500;
`;

const DescriptionContainer = styled.View`
  padding: 16px;
`;

const ReadMoreContainer = styled.View`
  align-items: flex-end;
  margin-top: 8px;
`;

const ReadMoreText = styled.Text`
  color: #FF5500;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  padding: 16px 16px 8px;
  color: #333;
  border-top-width: 1px;
  border-top-color: #eee;
`;

const ReviewsContainer = styled.View`
  padding: 16px;
  border-top-width: 1px;
  border-top-color: #eee;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  padding: 16px;
  gap: 16px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #eee;
`;

const PrimaryButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #FF5500;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

const SecondaryButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #fff;
  border: 1px solid #FF5500;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${props => props.secondary ? '#FF5500' : '#fff'};
  font-weight: bold;
  font-size: 16px;
`;

const ProductDetail = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
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
    // Implement share functionality
    console.log('Share product');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF5500" />
        <Text style={{ marginTop: 16 }}>Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ff0000', fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  if (!product) return null;

  const images = product.c_images && product.c_images.length > 0 
    ? product.c_images 
    : product.image 
      ? [product.image] 
      : []; // Fallback for no images

  const shortDescription = product.description && product.description.length > 175 
    ? product.description.substring(0, 175) + '...' 
    : product.description || 'No description available';

  return (
    <View style={{ flex: 1 }}>
      <Container>
        <HeaderComponent 
          title="Product Details" 
          onLeftPress={() => router.back()} 
        />

        {/* Image Slider - Only render if we have images */}
        {images.length > 0 ? (
          <ImageContainer>
            <ImageSlider
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
            >
              {images.map((img, index) => (
                <View key={index} style={{ width, height: width }}>
                  <ProductImage source={{ uri: img }} />
                </View>
              ))}
            </ImageSlider>

            <ImageActions>
              <ActionButton onPress={handleShare}>
                <Feather name="share-2" size={20} color="#333" />
              </ActionButton>
              <ActionButton onPress={toggleFavorite}>
                <MaterialIcons 
                  name={isFavorite ? "favorite" : "favorite-border"} 
                  size={20} 
                  color={isFavorite ? "#FF5500" : "#333"} 
                />
              </ActionButton>
            </ImageActions>

            {images.length > 1 && (
              <DotContainer>
                {images.map((_, index) => (
                  <Dot key={index} active={index === currentImageIndex} />
                ))}
              </DotContainer>
            )}
          </ImageContainer>
        ) : (
          <ImageContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>No image available</Text>
          </ImageContainer>
        )}

        <ProductInfo>
          <CategoryText>{product.category || 'Uncategorized'}</CategoryText>
          <ProductTitle>{product.product_name || 'Untitled Product'}</ProductTitle>
          <PriceContainer>
            <SellingPrice>₹{product.selling_price}</SellingPrice>
          </PriceContainer>
          <Text style={{ marginTop: 8, color: product.available_qty > 0 ? 'green' : 'red' }}>
            {product.available_qty > 0 ? 'In Stock' : 'Out of Stock'}
          </Text>
        </ProductInfo>

        {/* Description Section */}
        <SectionTitle>Description</SectionTitle>
        <DescriptionContainer>
          <Text style={{ fontSize: 16, lineHeight: 24, color: '#555' }}>
            {showFullDescription ? product.description : shortDescription}
          </Text>
          {product.description && product.description.length > 150 && (
            <ReadMoreContainer>
              <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                <ReadMoreText>
                  {showFullDescription ? 'Show less' : 'Read more'}
                </ReadMoreText>
              </TouchableOpacity>
            </ReadMoreContainer>
          )}
        </DescriptionContainer>

        {/* Similar Products Section */}
        <SectionTitle>Similar Products</SectionTitle>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            No similar products found
          </Text>
        </View>

        {/* Reviews Section */}
        <ReviewsContainer>
          <SectionTitle>Reviews (0)</SectionTitle>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            No reviews yet
          </Text>
        </ReviewsContainer>

        {/* Action Buttons */}
        <ButtonContainer>
          <SecondaryButton>
            <ButtonText secondary>Add to Cart</ButtonText>
          </SecondaryButton>
          <PrimaryButton disabled={product.available_qty <= 0}>
            <ButtonText>Buy Now</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </Container>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  imageSlide: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});