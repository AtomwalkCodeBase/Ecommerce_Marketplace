import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { getOrderList } from '../services/productServices'; // Make sure to have this API call
import Header from '../components/Header';
import { usePathname } from 'expo-router';

const Orders = () => {
  const pathname = usePathname();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await getOrderList();
		console.log("Orders response: ", response); // Debugging line to check the API response
        setOrders(response.data); // Assuming the API returns an array of orders
        setLoading(false);
      } catch (error) {
        console.log("Error fetching orders: ", error);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Display loading spinner until orders are fetched
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <Header isHomePage={true} title={"Orders"} currentRoute={pathname} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {orders?.length > 0 ? (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <Text style={styles.invoiceNumber}>Invoice: {order.invoice_number}</Text>
              <Text style={styles.customerName}>Customer: {order.customer_name}</Text>
              <Text style={styles.invoiceDate}>Invoice Date: {order.invoice_date}</Text>
              <Text style={styles.dueDate}>Due Date: {order.invoice_due_date}</Text>
              <Text style={styles.outstandingAmount}>
                Outstanding Amount: {order.currency_symbol}{order.outstanding_amt}
              </Text>
              <Text style={styles.status}>
                Status: {order.is_over_due ? 'Overdue' : 'Paid'}
              </Text>
              <ScrollView horizontal={true} style={styles.productList}>
                {order.order_items.map((item, index) => (
                  <View key={index} style={styles.productItem}>
                    <Image source={{ uri: item.product.image }} style={styles.productImage} />
                    <Text style={styles.productName}>{item.product.product_name}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Price: {order.currency_symbol}{item.price}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No orders found</Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  invoiceNumber: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  customerName: {
    fontSize: 14,
    marginTop: 5,
  },
  invoiceDate: {
    fontSize: 12,
    marginTop: 5,
  },
  dueDate: {
    fontSize: 12,
    marginTop: 5,
  },
  outstandingAmount: {
    fontSize: 14,
    marginTop: 5,
    color: '#e74c3c',
  },
  status: {
    fontSize: 12,
    marginTop: 5,
    color: order => (order.is_over_due ? '#e74c3c' : '#2ecc71'), // Red if overdue, Green if paid
  },
  productList: {
    marginTop: 10,
  },
  productItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  productName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#7f8c8d',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Orders;
