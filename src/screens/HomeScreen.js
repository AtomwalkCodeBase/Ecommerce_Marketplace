import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import BannerImg from '../../assets/images/banner.png';
import BannerImg2 from '../../assets/images/banner2.png';
import BannerImg3 from '../../assets/images/Atom_walk_logo.jpg';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slice/productSlice';
import { fetchCategories } from '../redux/slice/categorySlice';
import BannerSlider from '../components/BannerSlider';


const CategoryScroll = styled.ScrollView`
  margin-top: 8px;
  padding-left: 16px;
`;

const CategoryContainer = styled.TouchableOpacity`
  align-items: center;
  margin-right: 16px;
`;

const CategoryImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-bottom: 6px;
  resize-mode: cover;
  background-color: #ddd;
`;

const CategoryText = styled.Text`
  font-size: 12px;
  text-align: center;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px 16px 8px 16px;
  padding-top: 8px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const SeeMoreText = styled(TouchableOpacity)`
  padding: 4px 8px;
`;

const HomeScreen = () => {
  const bannerImages = [BannerImg, BannerImg2]; 
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, productLoading, productError } = useSelector((state) => state.product);
  const { categories, categoryLoading, categoryError } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  if (productLoading || categoryLoading) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>;
  }
  if (productError || categoryError) {
    return (
      <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>
        Error: {productError || categoryError}
      </Text>
    );
  }

  const handleCategoryPress = (category) => {
    const params = { categoryName: category.name, title: category.name };
    router.push({
      pathname: 'ProductListScreen',
      params,
    });
  };

  const handleSeeMorePress = (section) => {
    const params = { categoryName: undefined, title: section };
    router.push({
      pathname: 'ProductListScreen',
      params,
    });
  };

  const handleProductPress = (productId) => {
    router.push({
      pathname: 'ProductDetail',
      params:{productId: productId},
    });
  };

  return (
    <>
      <Header title="AW-Ecommerce" />
      <ScrollView style={{ backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
        <BannerSlider images={bannerImages} />

        <CategoryScroll horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((item) => (
            <CategoryContainer key={item.id} onPress={() => handleCategoryPress(item)}>
              <CategoryImage source={{ uri: item.image }} />
              <CategoryText>{item.name}</CategoryText>
            </CategoryContainer>
          ))}
        </CategoryScroll>

        <SectionHeader>
          <SectionTitle>New Arrivals</SectionTitle>
          <SeeMoreText onPress={() => handleSeeMorePress('New Arrivals')}>
            <Text style={{ color: '#FF5500', fontSize: 14, fontWeight: 'bold' }}>See more</Text>
          </SeeMoreText>
        </SectionHeader>
        <ProductGrid
          products={products.slice(0, 6)}
          onProductPress={handleProductPress}
          scrollEnabled={false}
        />

        <SectionHeader>
          <SectionTitle>Top Trending</SectionTitle>
          <SeeMoreText onPress={() => handleSeeMorePress('Top Trending')}>
            <Text style={{ color: '#FF5500', fontSize: 14, fontWeight: 'bold' }}>See more</Text>
          </SeeMoreText>
        </SectionHeader>
        <ProductGrid
          products={products.slice(6, 10)}
          onProductPress={handleProductPress}
          scrollEnabled={false}
        />
      </ScrollView>
    </>
  );
};

export default HomeScreen;