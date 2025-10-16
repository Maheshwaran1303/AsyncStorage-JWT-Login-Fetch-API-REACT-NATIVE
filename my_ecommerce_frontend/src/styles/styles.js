import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // LoginScreen
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20 
    },

    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center' 
    },

    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5, 
        padding: 10, 
        marginBottom: 10 
    },

    // ProductItem
    productItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
    },
    name: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    price: { 
        fontSize: 16, 
        color: '#007bff', 
        marginTop: 5 
    },
    category: { 
        fontSize: 14, 
        color: '#666', 
        marginTop: 3 
    },
});

export default styles;