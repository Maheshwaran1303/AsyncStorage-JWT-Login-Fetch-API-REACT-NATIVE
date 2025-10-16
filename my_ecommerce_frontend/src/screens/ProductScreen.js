import { useContext, useState } from 'react';
import { View, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import { fetchProducts } from '../api/productApi';
import ProductItem from '../components/ProductItem';
import { AuthContext } from '../context/AuthContext';

export default function ProductScreen() {
  const { logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Fetch Products" onPress={loadProducts} />
      <Button title="Logout" onPress={logout} color="red" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
            <FlatList 
              data={products} 
              keyExtractor={
                (item) => item.id.toString()
              } 
              renderItem={
                ({ item }) => <ProductItem item={item}/>
              } 
            />
          )}
    </View>
  );
}
