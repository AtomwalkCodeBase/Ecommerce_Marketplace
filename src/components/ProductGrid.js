import React from 'react';
import styled from 'styled-components/native';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';

const ProductList = styled(FlatList)`
  margin: 15px 16px;
`;

const ProductCard = styled(TouchableOpacity)`
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

const ProductGrid = ({
  products,
  onProductPress,
  showsVerticalScrollIndicator = false,
  scrollEnabled = false,
  numColumns = 2,
  columnWrapperStyle = { justifyContent: 'space-between' },
}) => {
  const renderProductItem = ({ item }) => (
    <ProductCard onPress={() => onProductPress(item.id)}>
      <ProductImage source={{ uri: item.image }} />
      <ProductName>
        {item.product_name.substring(0, 20)}
        {item.product_name.length > 20 ? '...' : ''}
      </ProductName>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ProductPrice>₹{item.discounted_price}</ProductPrice>
        {item.is_discounted && <OriginalPrice>₹{item.selling_price}</OriginalPrice>}
      </View>
    </ProductCard>
  );

  return (
    <ProductList
      data={products}
      renderItem={renderProductItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      columnWrapperStyle={columnWrapperStyle}
    />
  );
};

export default ProductGrid;