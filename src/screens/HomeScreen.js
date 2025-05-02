import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import BannerImg from '../../assets/images/banner.png';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slice/productSlice';
import { fetchCategories } from '../redux/slice/categorySlice';
import { colors } from "../Styles/appStyle";
import { FlatList } from 'react-native';
import { RefreshControl } from 'react-native';


const BannerImage = styled.Image`
  width: 92%;
  height: 160px;
  border-radius: 10px;
  margin: 16px;
  resize-mode: cover;
`;

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
  resize-mode: contain;
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

const ProductList = styled(FlatList)`
  margin: 0 16px;
`;

const ProductCard = styled.TouchableOpacity`
  width: 48%;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 16px;
  align-items: center;
`;

const ProductImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  margin-bottom: 8px;
  resize-mode: cover;
`;

const ProductName = styled.Text`
  font-size: 12px;
  text-align: center;
  color: black;
  margin-bottom: 4px;
`;

const ProductPrice = styled.Text`
  font-size: 14px;
  color: black;
  font-weight: bold;
`;

const OriginalPrice = styled.Text`
  font-size: 12px;
  color: #888;
  text-decoration: line-through;
  margin-left: 4px;
`;

const HomeScreen = () => {
  const pathname = usePathname();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, productLoading, productError } = useSelector((state) => state.product);
  const { categories, categoryLoading, categoryError } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  if (productLoading && categoryLoading) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>;
  }
  if (productError && categoryError) {
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

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([dispatch(fetchProducts()), dispatch(fetchCategories())]);
    setRefreshing(false);
  };

  return (
    <>
      <Header title="AW-Ecommerce" isHomePage={true} currentRoute={pathname} />
      <ScrollView style={{ backgroundColor: '#fff' }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
        <BannerImage source={BannerImg} />

        <CategoryScroll horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((item) => (
            <CategoryContainer key={item.id} onPress={() => handleCategoryPress(item)}>
              <CategoryImage source={{ uri: item.image }} />
              <CategoryText>{item.name}</CategoryText>
            </CategoryContainer>
          ))}
        </CategoryScroll>

        <SectionHeader>
          <SectionTitle>New Arrivals 🔥</SectionTitle>
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
          <SectionTitle>Top Trending 🔥</SectionTitle>
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