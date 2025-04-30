import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import ProductDetail from '../../src/screens/ProductDetail';

const index = () => {
    return (
        <View style={{ flex: 1 }}>
            <ProductDetail />
        </View>
    )
}

export default index;

const styles = StyleSheet.create({})