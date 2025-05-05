import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SearchComponent = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  placeholder = "Search...",
  showClearButton = false,
  containerStyle,
  inputStyle,
}) => {
  const handleClear = () => {
    setSearchQuery("");
    onSearch(""); // Trigger reset
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons
        name="search"
        size={20}
        color="#777"
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#777"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          onSearch(text); // Call onSearch with every change
        }}
      />
      {showClearButton && searchQuery && (
        <TouchableOpacity onPress={handleClear}>
          <MaterialIcons name="clear" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5", // Default to ProductView's style
    borderRadius: 24,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
});

export default SearchComponent;