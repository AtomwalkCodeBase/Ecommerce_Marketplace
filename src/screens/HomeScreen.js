import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, Text, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import BannerImg from '../../assets/images/banner.png';
import { getProductCategoryList, productList } from '../services/productServices';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_Product_Category } from '../redux/slice/product_category_Slice';

const HeaderContainer = styled.View`
  padding: 12px 18px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 60px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const IconButton = styled.TouchableOpacity`
  padding: 8px;
`;

const LeftIcon = styled(IconButton)`
  position: absolute;
  left: 18px;
  top: 12px;
`;

const RightIconsContainer = styled.View`
  position: absolute;
  right: 18px;
  top: 12px;
  flex-direction: row;
  align-items: center;
`;

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();
  const { products, categories, isLoading, isError } = useSelector((state) => state.Product_Category);

  // const fetchCategories = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await getProductCategoryList();
  //     setCategoryList(res.data);
  //     console.log('Category - List', res.data);
  //   } catch (error) {
  //     console.log('Error fetching categories:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await productList();
  //     setProducts(res.data);
  //     console.log('Product - List', res.data);
  //   } catch (error) {
  //     console.log('Error fetching products:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    dispatch(fetch_Product_Category());
  }, []);

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {isError}</Text>;

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleBellPress = () => {
    console.log('Bell pressed');
  };

  const handleSeeMorePress = (section) => {
    console.log(`See more pressed for ${section}`);
  };

  const handleProductPress = (productId) => {
    router.push({
      pathname: 'ProductDetail',
      params: { productId: productId },
    });
  };

  const renderProductItem = ({ item }) => (
    <ProductCard onPress={() => handleProductPress(item.id)}>
      <ProductImage source={{ uri: item.image }} />
      <ProductName>{item.product_name.substring(0, 20)}{item.product_name.length > 20 ? '...' : ''}</ProductName>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ProductPrice>₹{item.discounted_price}</ProductPrice>
        {item.is_discounted && <OriginalPrice>₹{item.selling_price}</OriginalPrice>}
      </View>
    </ProductCard>
  );

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <Header title={"AW-Ecommerce"} />

      <BannerImage source={BannerImg} />

      <CategoryScroll horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item) => (
          <CategoryContainer key={item.id} onPress={() => console.log(`Category ${item.name} pressed`)}>
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
      <ProductList
        data={products.slice(0, 6)}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />

      <SectionHeader>
        <SectionTitle>Top Trending</SectionTitle>
        <SeeMoreText onPress={() => handleSeeMorePress('Top Trending')}>
          <Text style={{ color: '#FF5500', fontSize: 14, fontWeight: 'bold' }}>See more</Text>
        </SeeMoreText>
      </SectionHeader>
      <ProductList
        data={products.slice(6, 10)}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </ScrollView>
  );
};

export default HomeScreen;