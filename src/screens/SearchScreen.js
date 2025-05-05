import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  StatusBar,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../Styles/appStyle';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'expo-router';

const STORAGE_KEY = '@recent_searches';

const SearchScreen = () => {
  const pathname = usePathname();
  console.log("kjdsbc", pathname)
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { categories, categoryLoading, categoryError } = useSelector((state) => state.category);
  const router = useRouter();

  // Load recent searches from AsyncStorage on component mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedSearches !== null) {
          setRecentSearches(JSON.parse(storedSearches));
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentSearches();
  }, []);

  // Save recent searches to AsyncStorage whenever it changes
  const saveRecentSearches = async (searches) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const handleSearch = () => {
    if (searchText.trim() === '') return;
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(searchText)) {
      const updatedSearches = [searchText, ...recentSearches].slice(0, 10);
      setRecentSearches(updatedSearches);
      saveRecentSearches(updatedSearches);
    }
    
    // Navigate to ProductListScreen with the search query
    router.push({
      pathname: '/ProductListScreen',
      params: { searchQuery: searchText, title: `Search Results for "${searchText}"` },
    });

    // Reset search text
    setSearchText('');
  };

  const handleCategorySelect = (category) => {
    setShowDropdown(false);
    if (category) {
      router.push({
        pathname: '/ProductListScreen',
        params: { categoryName: category.name, title: category.name },
      });
    }
  };

  const removeSearch = (index) => {
    const updatedSearches = [...recentSearches];
    updatedSearches.splice(index, 1);
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const clearAllSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      <Header title="Search" isHomePage={false} />
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for clothes..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
            <Feather name="mic" size={20} color={colors.textSecondary} style={styles.micIcon} />
          </View>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setShowDropdown(true)}
          >
            <Feather name="sliders" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showDropdown}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.bottomSheet}>
                  <View style={styles.sheetHandle} />
                  <Text style={styles.sheetTitle}>Select Category</Text>
                  <ScrollView>
                    <TouchableOpacity 
                      style={styles.categoryItem} 
                      onPress={() => handleCategorySelect(null)}
                    >
                      <Text style={styles.categoryText}>All Categories</Text>
                    </TouchableOpacity>
                    {categories.map((cat, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.categoryItem}
                        onPress={() => handleCategorySelect(cat)}
                      >
                        <Text style={styles.categoryText}>{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        ) : (
          <>
            {recentSearches.length > 0 && (
              <View style={styles.recentSearchesHeader}>
                <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearAllSearches} hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                  <Feather name="trash-2" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.recentSearchesList}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.searchTag}
                  onPress={() => {
                    setSearchText(search);
                    handleSearch();
                  }}
                >
                  <Text style={styles.searchTagText}>{search}</Text>
                  <TouchableOpacity 
                    onPress={() => removeSearch(index)} 
                    style={styles.removeButton}
                    hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                  >
                    <Feather name="x" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
  },
  loader: {
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  micIcon: {
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: '#FFF2EC',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  recentSearchesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  searchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  searchTagText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 8,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});

export default SearchScreen;