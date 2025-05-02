import React from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { selectProductsByCategory, selectProductLoading, selectProductError } from '../redux/slice/productSlice';
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
    const { categoryName, title = 'Products' } = useLocalSearchParams();
    const router = useRouter();
    const products = useSelector((state) =>
        selectProductsByCategory(state, categoryName));

    const loading = useSelector(selectProductLoading);
    const error = useSelector(selectProductError);

    const handleProductPress = (productId) => {
        router.push({
            pathname: 'ProductDetail',
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
                products={products}
                onProductPress={handleProductPress}
                scrollEnabled={true}
            />
        </Container>
    );
};

export default ProductListScreen;