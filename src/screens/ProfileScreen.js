import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, Entypo, AntDesign } from '@expo/vector-icons';
import { AppContext } from '../../context/AppContext';
import { getProfileInfo } from '../services/authServices';
import { useNavigation, usePathname, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { colors } from '../Styles/appStyle';

// Styled components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileInfoContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
   
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffcccb',
  },
  profileTextInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: `${colors.text}`,
  },
  arrowContainer: {
    width: 24,
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  logoutIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: `${colors.text}`,
  },
});

const ProfileScreen = () => {
  const { logout } = useContext(AppContext);
  const [profile, setProfile] = useState({});
  const pathname = usePathname();
  // const [isManager, setIsManager] = useState(false);
  const [userPin, setUserPin] = useState(null);
  

    useEffect(() => {
        const fetchUserPin = async () => {
            const storedPin = await AsyncStorage.getItem('userPin');
            setUserPin(storedPin); // storedPin will be `null` if no value is found
        };
        fetchUserPin();
    }, []);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    getProfileInfo().then((res) => {
      setProfile(res.data);
      setIsManager(res.data.user_group.is_manager);
    });
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePressPassword = () => {
    router.push({ pathname: 'ResetPassword' });
  };

  const menuItems = [
    {
      icon: <Entypo name="location-pin" size={24} color={colors.primary} />,
      title: 'Address',
      onPress: () => {router.push("/LocationScreen")},
      // onPress: () => {router.push("PersonalInfo")}
    },
    {
      icon: <MaterialIcons name="payment" size={24} color={colors.primary} />,
      title: 'Payment method',
      onPress: () =>console.log("Press Payment button"),
    },
    {
      icon: <FontAwesome name="ticket" size={24} color={colors.primary} />,
      title: 'Voucher',
      onPress: () => console.log("Press Voucher button"),
    },
    {
      icon: <AntDesign name="heart" size={24} color={colors.primary} />,
      title: 'My Wishlist',
      onPress: () => console.log("Press Wishlist button"),
    },
    {
      icon: <AntDesign name="star" size={24} color={colors.primary} />,
      title: 'Rate this app',
      onPress: () => console.log("Press Rate button"),
    },
  ];

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9fb' }}>
    //   <HeaderComponent 
    //   title={"Profile"}
    //   onLeftPress={handleBackPress}      
    //   />
    //   <Container>
    //     <AvatarContainer entering={FadeIn.duration(700)} exiting={FadeOut.duration(500)}>
    //       <ProfileImage source={{ uri: profile?.image }} />
    //     </AvatarContainer>

    //     <UserName entering={FadeIn.duration(500)}>{profile?.emp_data?.name}</UserName>
    //     <UserName entering={FadeIn.duration(600)}>{profile?.user_name}</UserName>

    //     <IsManagerContainer entering={SlideInLeft.delay(300).duration(400)}>
    //       <ManagerText>Is Manager:</ManagerText>
    //       <MaterialCommunityIcons
    //         name={isManager ? "check-circle" : "cancel"}
    //         size={24}
    //         color={isManager ? "lightblue" : "red"}
    //       />
    //     </IsManagerContainer>

    //     <DetailsContainer>
        

    //     {profile?.emp_data?.emp_id && (
    //       <InfoContainer entering={SlideInLeft.delay(400)}>
    //         <InfoIcon name="badge-account-horizontal" size={24} color="#555" />
    //         <InfoText entering={FadeIn.duration(300)}>Employee ID: {profile.emp_data.emp_id}</InfoText>
    //       </InfoContainer>
    //     )}
    //     {profile?.emp_data?.department_name && (
    //       <InfoContainer entering={SlideInLeft.delay(500)}>
    //         <InfoIcon name="office-building" size={24} color="#555" />
    //         <InfoText entering={FadeIn.duration(400)}>Department: {profile.emp_data.department_name}</InfoText>
    //       </InfoContainer>
    //     )}
    //     {profile?.mobile_number && (
    //       <InfoContainer entering={SlideInLeft.delay(600)}>
    //         <InfoIcon name="phone" size={24} color="#555" />
    //         <InfoText entering={FadeIn.duration(500)}>Mobile: {profile.mobile_number}</InfoText>
    //       </InfoContainer>
    //     )}

    //     </DetailsContainer>

    //     <LogOutButton onPress={logout} entering={FadeIn.delay(700)}>
    //       <MaterialCommunityIcons name="logout" size={24} color="#d9534f" />
    //       <LogOutText>Log Out</LogOutText>
    //     </LogOutButton>

    //     <ChangePasswordButton onPress={handlePressPassword} entering={FadeIn.delay(800)}>
    //       <ChangePasswordText>{userPin?"Update Your Pin":"Set Your Pin"}</ChangePasswordText>
    //     </ChangePasswordButton>
    //   </Container>
    // </SafeAreaView>
    <SafeAreaView style={styles.container}>
    
    {/* Header */}
    <Header isHomePage={true} title={"Profile"} currentRoute={pathname} />

    {/* Profile Info */}
    <View style={styles.profileInfoContainer}>
      <View style={styles.profileInfo}>
      <Image 
        source={{ uri: profile?.image }} 
        style={styles.profileImage}
      />
      <View style={styles.profileTextInfo}>
        <Text style={styles.profileName}>{profile?.user_name}</Text>
        <Text style={styles.profileEmail}>JohnDoe@gmail.com</Text>
      </View>
      </View>
    
      <View>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings-outline" size={24} color="#000" />
      </TouchableOpacity>
      </View>
    </View>

    {/* Menu Items */}
    <View style={styles.menuContainer}>
    {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          icon={item.icon}
          title={item.title}
          onPress={() => item.onPress(navigation)}
        />
      ))}

    {/* Log Out Button */}
    <TouchableOpacity 
      style={styles.logoutButton}
      onPress={logout}
    >
      <View style={styles.menuItemRow}>
        <View style={styles.logoutIconContainer}>
          <MaterialIcons name="logout" size={24} color="#FF0000" />
        </View>
        <Text style={styles.logoutText}>Log out</Text>
        <View style={styles.arrowContainer}></View>
      </View>
    </TouchableOpacity>

    </View>

  </SafeAreaView>
);
};


const MenuItem = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemRow}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileScreen;
