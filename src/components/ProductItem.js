import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/CartReducer";

const ProductItem = ({ item, navigation }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  // const dispatch = useDispatch();
  // const addItemToCart = (item) => {
  //  setAddedToCart(true);
  //  dispatch(addToCart(item));
  //  setTimeout(() => {
  //    setAddedToCart(false);
  //  }, 60000);
  // };
  // console.log(navigation);
  const handleNavigation = () => {
    navigation.navigate('ProductInfo', {id: item.id, item: item});
  }
  return (
    <View style={{ marginHorizontal: 20, marginVertical: 25 }}>
    <Pressable
        onPress={handleNavigation}
    >
        
      <Image
        style={{ width: 150, height: 150, resizeMode: "contain" }}
        source={{ uri: item?.image }}
      />
      <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>
        {item?.product_name}
      </Text>
      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          ₹{item?.selling_price}
        </Text>
        <Text style={{ color: "#FFC72C", fontWeight: "bold" }}>
          {item?.rating?.rate} ratings
        </Text>
      </View>
      </Pressable>
      <Pressable
        // onPress={() => handleNavigation(item)}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        {addedToCart ? (
          <View>
            <Text>Added to Cart</Text>
          </View>
        ) : (
          <Text>Add to Cart</Text>
        )}
      </Pressable>
    
    </View>
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
