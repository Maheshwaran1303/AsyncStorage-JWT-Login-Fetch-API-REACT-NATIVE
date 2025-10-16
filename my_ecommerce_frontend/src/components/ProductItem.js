import { View, Text } from 'react-native';
import styles from '../styles/styles';

const ProductItem = ({ item }) => (
  <View style={styles.productItem}>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.price}> ${Number(item.price || 0).toFixed(2)}</Text>
    <Text style={styles.category}>{item.category}</Text>
  </View>
);



export default ProductItem;
