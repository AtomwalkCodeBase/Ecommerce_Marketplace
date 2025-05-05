import React from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  font-size: 16px;
  color: red;
`;

const ProductListScreen = () => {
  const { categoryName, searchQuery, title = 'Products' } = useLocalSearchParams();
  const router = useRouter();
  
  // Get all products and filter based on searchQuery or categoryName
  const allProducts = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.productLoading);
  const error = useSelector((state) => state.product.productError);

  // Filter products based on searchQuery or categoryName
  const filteredProducts = searchQuery
    ? allProducts.filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryName
    ? allProducts.filter((product) => product.category === categoryName)
    : allProducts;

  const handleProductPress = (productId) => {
    router.push({
      pathname: '/ProductDetail',
      params: { productId: productId.toString() },
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Text>Loading...</Text>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>Error: {error}</ErrorText>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <Header isHomePage={false} title={title} />
      <ProductGrid
        products={filteredProducts}
        onProductPress={handleProductPress}
        scrollEnabled={true}
      />
    </Container>
  );
};

export default ProductListScreen;