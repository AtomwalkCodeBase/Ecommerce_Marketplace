import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../Styles/appStyle";

const HeaderContainer = styled.View`
  padding: 12px 18px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 60px;
  shadowOpacity: 0.1;
  shadowRadius: 4;
  elevation: 2;
  shadowColor: '#000';
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const IconButton = styled.TouchableOpacity`
  padding: 8px;
`;

const LeftIcon = styled(IconButton)`
  position: absolute;
  left: 18px;
  top: 12px;
`;

const RightIconsContainer = styled.View`
  position: absolute;
  right: 18px;
  top: 12px;
  flex-direction: row;
  align-items: center;
`;

const styles = StyleSheet.create({
  sidebarContainer: {
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
  },
  sidebar: {
    width: '70%',
    height: '100%',
    backgroundColor: colors.white,
    padding: 8,
    paddingTop: 40,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  overlay: {
    flex: 1, // Takes up the remaining space outside the sidebar
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  highlightedItem: {
    backgroundColor: colors.primaryTransparent,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: colors.textSecondary,
  },
  highlightedText: {
    color: colors.primary,
    fontWeight: 'semibold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 20,
    // marginTop: 50,
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    color: colors.error,
  },
  drawerContentContainer: {
    flex: 1,
  }
});

const Header = ({ isHomePage = true, onBackPress, title, currentRoute }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  const handleMenuPress = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLeftIconPress = () => {
    if (isHomePage) {
      handleMenuPress();
    } else {
      onBackPress();
    }
  };

  onBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    // console.log("Search pressed");
    router.push('/SearchScreen')
  };

  const handleBellPress = () => {
    console.log("Bell pressed");
  };

  const handleOverlayPress = () => {
    setIsSidebarOpen(false); // Close sidebar when clicking outside
  };

  
  const mainMenuItems = [
    { name: 'Homepage', icon: 'home', route: '/home', highlight: currentRoute === '/home' },
    { name: 'Discover', icon: 'search', route: '/discover', highlight: currentRoute === '/discover' },
    { name: 'My Order', icon: 'shopping-bag', route: '/orders', highlight: currentRoute === '/orders'},
    { name: 'My profile', icon: 'user', route: '/profile', highlight: currentRoute === '/profile' },
  ];
  
  const otherMenuItems = [
    { name: 'Setting', icon: 'settings', route: '/settings', highlight: currentRoute === '/settings' },
    { name: 'Support', icon: 'mail', route: '/support',  highlight: currentRoute === '/support' },
    { name: 'About us', icon: 'info', route: '/about', highlight: currentRoute === '/about' },
  ];

  return (
    <>
      <HeaderContainer>
        <LeftIcon onPress={handleLeftIconPress}>
          <Feather
            name={isHomePage ? 'menu' : 'arrow-left'}
            size={24}
            color="black"
          />
        </LeftIcon>

        <Title>{title}</Title>

        {isHomePage && (
          <RightIconsContainer>
            <IconButton onPress={handleSearchPress}>
              <Feather name="search" size={24} color="black" />
            </IconButton>
            <IconButton onPress={handleBellPress}>
              <Feather name="bell" size={24} color="black" />
            </IconButton>
          </RightIconsContainer>
        )}
      </HeaderContainer>

      {isSidebarOpen && (
        <SafeAreaView style={styles.sidebarContainer}>
          <View style={styles.sidebar}>
          <View style={styles.drawerContentContainer}>
              <View style={styles.profileSection}>
                <View style={styles.avatar}>
                  <Feather name="user" size={22} color="#FF6347" />
                </View>
                <View>
                  <Text style={styles.profileName}>John Doe</Text>
                  <Text style={styles.profileEmail}>johndoe@gmail.com</Text>
                </View>
              </View>

             {mainMenuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    currentRoute === item.route && styles.highlightedItem,
                  ]}
                  onPress={() => {
                    setIsSidebarOpen(false);
                    router.push(item.route);
                  }}
              >
                <Feather
                  name={item.icon}
                  size={20}
                  color={item.highlight ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.menuText,
                    item.highlight && styles.highlightedText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}

<Text style={styles.sectionTitle}>OTHER</Text>

{otherMenuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    currentRoute === item.route && styles.highlightedItem,
                  ]}
                  onPress={() => {
                    setIsSidebarOpen(false);
                    router.push(item.route);
                  }}
              >
                <Feather
                  name={item.icon}
                  size={20}
                  color={item.highlight ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.menuText,
                    item.highlight && styles.highlightedText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.logoutButton} onPress={() => setIsSidebarOpen(false)}>
              <Feather name="log-out" size={20} color={colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          </View>
          <TouchableOpacity style={styles.overlay} onPress={handleOverlayPress} />
        </SafeAreaView>
      )}
    </>
  );
};


export default Header;