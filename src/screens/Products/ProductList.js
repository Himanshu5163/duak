import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  Alert
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ApplyProductModal from "./ApplyProductModal";
import { useDispatch, useSelector } from "react-redux";
import { Strings } from "../../theme/Strings";
import { fetchProductList } from "../../redux/productListSlice";
import { getToken } from "../../utils/storage";

const { width } = Dimensions.get('window');

// const products = [
//   {
//     id: 1,
//     category: "Cables & Accessories",
//     name: "Solar Street Light 40W",
//     model: "SSL-40",
//     brand: "Havells",
//     watt: "40",
//     voltage: "12",
//     price: "8,500.00",
//     stock: "25",
//     warranty: "2 Years",
//     description: "Integrated solar street light with dusk to dawn sensor. Integrated solar street light with dusk to dawn sensor. Integrated solar street light with dusk to dawn sensor.",
//     icon: "lightbulb-on-outline",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 2,
//     category: "Mounting Structures",
//     name: "Solar Water Pump 2HP",
//     model: "PUMP-2HP",
//     brand: "Shakti",
//     watt: "48",
//     voltage: "24",
//     price: "55,000.00",
//     stock: "15",
//     warranty: "2 Years",
//     description: "Submersible solar water pump ideal for agriculture.",
//     icon: "pump",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 3,
//     category: "Batteries",
//     name: "Tubular Battery 150Ah",
//     model: "BAT-150T",
//     brand: "Amaron",
//     watt: "12",
//     voltage: "12",
//     price: "14,500.00",
//     stock: "60",
//     warranty: "3 Years",
//     description: "Tubular battery designed for solar off-grid systems.",
//     icon: "battery-80",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 4,
//     category: "Batteries",
//     name: "Lithium Battery 100Ah",
//     model: "BAT-100L",
//     brand: "Exide",
//     watt: "12",
//     voltage: "12",
//     price: "32,000.00",
//     stock: "40",
//     warranty: "5 Years",
//     description: "Long-lasting lithium battery with fast charging support.",
//     icon: "battery-charging",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 5,
//     category: "Solar Panels",
//     name: "Monocrystalline Panel 330W",
//     model: "SP-330M",
//     brand: "Luminous",
//     watt: "330",
//     voltage: "24",
//     price: "8,500.00",
//     stock: "50",
//     warranty: "10 Years",
//     description: "High efficiency solar panel for residential installations.",
//     icon: "solar-panel",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 6,
//     category: "Inverters",
//     name: "Solar Inverter 5kW",
//     model: "INV-5000",
//     brand: "MicroTek",
//     watt: "5000",
//     voltage: "48",
//     price: "45,000.00",
//     stock: "20",
//     warranty: "3 Years",
//     description: "Hybrid solar inverter with grid and battery support.",
//     icon: "power-plug",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 1,
//     category: "Cables & Accessories",
//     name: "Solar Street Light 40W",
//     model: "SSL-40",
//     brand: "Havells",
//     watt: "40",
//     voltage: "12",
//     price: "8,500.00",
//     stock: "25",
//     warranty: "2 Years",
//     description: "Integrated solar street light with dusk to dawn sensor. Integrated solar street light with dusk to dawn sensor. Integrated solar street light with dusk to dawn sensor.",
//     icon: "lightbulb-on-outline",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 2,
//     category: "Mounting Structures",
//     name: "Solar Water Pump 2HP",
//     model: "PUMP-2HP",
//     brand: "Shakti",
//     watt: "48",
//     voltage: "24",
//     price: "55,000.00",
//     stock: "15",
//     warranty: "2 Years",
//     description: "Submersible solar water pump ideal for agriculture.",
//     icon: "pump",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 3,
//     category: "Batteries",
//     name: "Tubular Battery 150Ah",
//     model: "BAT-150T",
//     brand: "Amaron",
//     watt: "12",
//     voltage: "12",
//     price: "14,500.00",
//     stock: "60",
//     warranty: "3 Years",
//     description: "Tubular battery designed for solar off-grid systems.",
//     icon: "battery-80",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 4,
//     category: "Batteries",
//     name: "Lithium Battery 100Ah",
//     model: "BAT-100L",
//     brand: "Exide",
//     watt: "12",
//     voltage: "12",
//     price: "32,000.00",
//     stock: "40",
//     warranty: "5 Years",
//     description: "Long-lasting lithium battery with fast charging support.",
//     icon: "battery-charging",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 5,
//     category: "Solar Panels",
//     name: "Monocrystalline Panel 330W",
//     model: "SP-330M",
//     brand: "Luminous",
//     watt: "330",
//     voltage: "24",
//     price: "8,500.00",
//     stock: "50",
//     warranty: "10 Years",
//     description: "High efficiency solar panel for residential installations.",
//     icon: "solar-panel",
//     color: ["#024495ff", "#1b5068ff"]
//   },
//   {
//     id: 6,
//     category: "Inverters",
//     name: "Solar Inverter 5kW",
//     model: "INV-5000",
//     brand: "MicroTek",
//     watt: "5000",
//     voltage: "48",
//     price: "45,000.00",
//     stock: "20",
//     warranty: "3 Years",
//     description: "Hybrid solar inverter with grid and battery support.",
//     icon: "power-plug",
//     color: ["#024495ff", "#1b5068ff"]
//   },
// ];

 
// const categories = ["All", ...new Set(products.map(p => p.category))];
const PAGE_SIZE = 10;

const ProductList = () => {

    const dispatch = useDispatch();
    const API_URL = Strings.APP_BASE_URL || '';
    const [token, setToken] = useState(null);
    useEffect(() => {
      const loadToken = async () => {
        const storedToken = await getToken();
        setToken(storedToken);
      };
      loadToken();
    }, []);
    useEffect(() => {
        if (!API_URL || !token) return;

        // load once immediately
        dispatch(fetchProductList({ API_URL, token }));

        // then refresh every 30 seconds (adjust time as needed)
        const interval = setInterval(() => {
            dispatch(fetchProductList({ API_URL, token }));
        }, 10000);

        // cleanup interval when component unmounts
        return () => clearInterval(interval);
    }, [API_URL, token, dispatch]);
    const products = useSelector(state => state.productList.productList || []);
    const { user } = useSelector(state => state.auth);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    // 🔹 Update function to accept params
const handleCartCreate = async (product_id, modal_type) => {
  try {
    const token = await getToken();
    const formDataToSend = new FormData();

    formDataToSend.append('client_id', user.id);       // client ID
    formDataToSend.append('product_id', product_id);   // product ID
    formDataToSend.append('modal_type', modal_type);   // modal type

    const response = await fetch(`${Strings.APP_BASE_URL}/cart-create`, {
      method: 'POST',
      body: formDataToSend,
      headers: {
        'Authorization': `Bearer ${token}`,
        // Do not set Content-Type manually
      },
    });

    const data = await response.json();

    if (response.ok) {
      if (data.status) {
        // ✅ success case
        Alert.alert('Success', data.message || 'Product added to cart.');
        setFormData({ subject: '', description: '' });
        setSelectedImage(null);
      } else {
        // ❌ failure case but API responded
        Alert.alert('Failed', data.message || 'Unable to add product to cart.');
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } else {
      // ❌ API/network error
      Alert.alert('Error', data.message || 'Something went wrong.');
    }
  } catch (error) {
    console.error('Error submitting cart:', error);
    Alert.alert('Error', 'Unexpected error occurred.');
  } finally {
    setIsSubmitting(false);
  }
};



    // reset pagination if products change
    useEffect(() => {
      setCurrentPage(1);
    }, [products]);

    const filteredProducts = useMemo(() => {
      return products.filter(
        (p) =>
          (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())) &&
          (selectedCategory === "All" || p.category === selectedCategory)
      );
    }, [products, search, selectedCategory]); // ✅ added products

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9}>
      <LinearGradient
  colors={["#024495ff", "#1b5068ff"]}
  style={styles.card}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>

        {/* Header Section */}
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
  <Image
    source={{
      uri:
        item.images?.[0]?.image_url ||
        "https://www.tatagreenbattery.com/wp-content/uploads/2020/12/46B24LS-1.png",
    }}
    style={styles.iconImage}
    resizeMode="cover"
  />
</View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <View >
            <Text style={styles.brandModel}>{item.brand} • {item.model_no}</Text>
          </View>
        </View>

        {/* Specifications Row */}
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Icon name="flash" size={16} color="#FFD700" />
            <Text style={styles.specText}>{item.watt_capacity ? item.watt_capacity : "-"} W</Text>
          </View>
          <View style={styles.specItem}>
            <Icon name="battery" size={16} color="#FFD700" />
            <Text style={styles.specText}>{item.voltage ? item.voltage : "-"} V</Text>
          </View>
          <View style={styles.specItem}>
            <Icon name="shield-check" size={16} color="#FFD700" />
            <Text style={styles.specText}>{item.warranty ? item.warranty : "-"}Yrs</Text>
          </View>
        </View>

        {/* Description */}
        <Text ellipsizeMode='tail' numberOfLines={2} style={styles.description}>{item.description}</Text>

        {/* Bottom Section */}
        <View style={styles.cardFooter}>
          {/* <View style={styles.priceContainer}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View> */}
          
          {/* <View style={styles.stockContainer}>
            <Icon 
              name={"check-circle"} 
            //   name={parseInt(item.stock) > 30 ? "check-circle" : parseInt(item.stock) > 10 ? "alert-circle" : "close-circle"} 
              size={16} 
              color={"#4CAF50" } 
            //   color={parseInt(item.stock) > 30 ? "#4CAF50" : parseInt(item.stock) > 10 ? "#FF9800" : "#F44336"} 
            />
            <Text style={[
              styles.stockText,
              { color: "#4CAF50" }
            //   { color: parseInt(item.stock) > 30 ? "#4CAF50" : parseInt(item.stock) > 10 ? "#FF9800" : "#F44336" }
            ]}>
              {item.stock} in stock
            </Text>
          </View> */}
          <TouchableOpacity 
  style={styles.actionButton} 
  activeOpacity={0.8}  
  onPress={() => handleCartCreate(item.id, "Cart")}
>
  <Icon name="cart-plus" size={18} color="#fff" />
  <Text style={styles.actionButtonText}>Apply</Text>
</TouchableOpacity>

        </View>

        {/* Action Button */}
        
      </LinearGradient>
    </TouchableOpacity>
  );

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      {/* <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="solar-power" size={32} color="#fff" />
          <Text style={styles.headerTitle}>Solar Products</Text>
          <Text style={styles.headerSubtitle}>Renewable Energy Solutions</Text>
        </View>
      </LinearGradient> */}

      {/* Search Section */}
      <View style={styles.searchSection}>
        {/* <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#666" />
          <TextInput
            placeholder="Search products, brands, models..."
            style={styles.searchInput}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              resetPage();
            }}
            placeholderTextColor="#999"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Icon name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View> */}


       
      </View>

      {/* Results Info */}
      {/* <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          Showing {Math.min(paginatedProducts.length, filteredProducts.length)} of {filteredProducts.length} products
        </Text>
      </View> */}

      {/* Product List */}
      <FlatList
        data={paginatedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="package-variant" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or filter</Text>
          </View>
        )}
      />

      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <LinearGradient colors={["#f8f9fa", "#ffffff"]} style={styles.paginationWrapper}>
            <TouchableOpacity 
              style={[styles.paginationBtn, currentPage === 1 && styles.disabledBtn]} 
              onPress={prevPage}
              disabled={currentPage === 1}
              activeOpacity={0.7}
            >
              <Icon name="chevron-left" size={20} color={currentPage === 1 ? "#ccc" : "#fd7e14"} />
            </TouchableOpacity>

            <View style={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <TouchableOpacity
                  key={pageNum}
                  style={[
                    styles.pageNumBtn,
                    currentPage === pageNum && styles.activePageBtn
                  ]}
                  onPress={() => goToPage(pageNum)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pageNumText,
                    currentPage === pageNum && styles.activePageText
                  ]}>
                    {pageNum}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.paginationBtn, currentPage === totalPages && styles.disabledBtn]} 
              onPress={nextPage}
              disabled={currentPage === totalPages}
              activeOpacity={0.7}
            >
              <Icon name="chevron-right" size={20} color={currentPage === totalPages ? "#ccc" : "#fd7e14"} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
       
      {/* Apply Product Modal */}
      <ApplyProductModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  
  // Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e8eafd",
    marginTop: 4,
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },

  // Category Filter
  categoryContainer: {
    marginBottom: 10,
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCategoryChip: {
    backgroundColor: "#667eea",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedCategoryChipText: {
    color: "#fff",
  },

  // Results Info
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
  },

  // List Container
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // Card Styles
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'flex-start'
  },
  iconContainer: {
    padding: 0,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  badgeText: { 
    color: "#fff", 
    fontSize: 12, 
    fontWeight: "600" 
  },

  // Product Info
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 4,
    lineHeight: 24,
  },
  brandModel: {
    fontSize: 14,
    color: "#f0f0f0",
    marginBottom: 12,
  },

  // Specifications
  specsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  specText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 4,
  },

  // Description
  description: { 
    fontSize: 14, 
    color: "#f0f0f0", 
    marginBottom: 16,
    lineHeight: 20,
  },

  // Card Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
    marginLeft: 2,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  // Action Button
  actionButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    width:'30%'
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Load More
  loadMoreContainer: {
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loadMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadMoreText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16,
    marginLeft: 8,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  paginationContainer: {
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  paginationWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  paginationBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledBtn: {
    backgroundColor: "#f8f9fa",
    shadowOpacity: 0,
    elevation: 0,
  },
  paginationBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fd7e14",
    marginHorizontal: 4,
  },
  disabledText: {
    color: "#ccc",
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageNumBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activePageBtn: {
    backgroundColor: "#fd7e14",
  },
  pageNumText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fd7e14",
  },
  activePageText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // bottom
    backgroundColor: "rgba(0,0,0,0.5)", // dim background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  modalButtonSection:{
    flexDirection:'row',
    width:'100%',
    gap:8
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width:'30%'
  },
  closeButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width:'30%'
  },
  iconImage: {
    width: 50,
    height: 50,
  },
});

export default ProductList;