import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import ProductListScreen from '../../src/screens/ProductListScreen';

const index = () => {
    return (
        <View style={{ flex: 1 }}>
            <ProductListScreen />
        </View>
    )
}

export default index;

const styles = StyleSheet.create({})