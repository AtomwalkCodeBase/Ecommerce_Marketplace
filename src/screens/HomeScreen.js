import { Feather } from '@expo/vector-icons';
import React from 'react';
import styled from 'styled-components/native';

const HeaderContainer = styled.View`
  padding: 12px 18px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 60px;
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

const HomeScreen = () => {
  const handleMenuPress = () => {
    console.log("Menu pressed");
  };

  const handleSearchPress = () => {
    console.log("Search pressed");
  };

  const handleBellPress = () => {
    console.log("Bell pressed");
  };

  return (
    <HeaderContainer>
      <LeftIcon onPress={handleMenuPress}>
        <Feather name="menu" size={24} color="black" />
      </LeftIcon>

      <Title>AW-Ecommerce</Title>

      <RightIconsContainer>
        <IconButton onPress={handleSearchPress}>
          <Feather name="search" size={24} color="black" />
        </IconButton>
        <IconButton onPress={handleBellPress}>
          <Feather name="bell" size={24} color="black" />
        </IconButton>
      </RightIconsContainer>
    </HeaderContainer>
  );
};

export default HomeScreen;
