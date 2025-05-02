import React from 'react';
import styled from "styled-components/native";
import Constants from "expo-constants";

// Colors
// export const colors = {
//   primary: "#FF5500",
//   secondary: "##ff550033",
//   tertiary: "#E6E6E6",
//   alternative: "#999999",
//   lightblue: "#00B6FF",
//   navyblue: "#1C0C3E",
//   white: '#fff',
//   black: '#000',
//   blue: '#5D5FEE',
//   lightgreen:'#90EE90',
//   grey: '#BABBC3',
//   light: '#F3F4FB',
//   darkBlue: '#7978B5',
//   yellow:'#FFC300',
//   lightyellow:'#F7F9D1',
//   offwhite: '#F8F6F0',
//   red: '#ff2400',
//   green: '#32cd32',
//   darkred: '#ff2020',
//   darkgrey: '#4c4c4c',
// };



// export const colors = {
//   primary: "#FF5500",          // Main orange color used in active indicators and buttons
//   secondary: "#ff550033",      // Fixed single # (was ##ff550033)
//   tertiary: "#E6E6E6",         // Light gray used in backgrounds
//   alternative: "#999999",      // Medium gray for secondary text
//   lightblue: "#00B6FF",        // Blue accent color
//   navyblue: "#1C0C3E",         // Dark blue for contrasting elements
//   white: '#FFFFFF',            // White for backgrounds and text
//   black: '#000000',            // Black for primary text
//   blue: '#5D5FEE',             // Accent blue
//   lightGray: '#F0F0F0',        // Light gray for cards and backgrounds (seen in product cards)
//   gray: '#8A8A8A',             // Medium gray for secondary text (price descriptions)
//   darkGray: '#4C4C4C',         // Darker gray for important text
//   light: '#F7F7F7',            // Very light gray for page backgrounds
//   orange: '#FF5500',           // Main brand color (same as primary)
//   lightOrange: '#FFF3EE',      // Light orange for highlights
//   activeOrange: '#FF7733',     // Slightly lighter orange for active states
//   borderColor: '#E0E0E0',      // Color for borders
//   red: '#FF3B30',              // Red for notifications, alerts, badges
//   green: '#32CD32',            // Green for success states
//   yellow: '#FFC300',           // Yellow for warnings
//   bottomTabActive: '#FF5500',  // Active tab color
//   bottomTabInactive: '#8E8E93', // Inactive tab color
//   text: '#33302E'
// };

export const colors = {
  // Brand & Primary
  primary: '#FF5500',
  primaryTransparent: '#ff550033',

  // Text
  textPrimary: '#000000',
  textSecondary: '#777E90',
  textOnPrimary: '#FFFFFF',

  // Backgrounds
  background: '#FFFFFF',
  backgroundDark: '#353945',
  backgroundDarker: '#1E1E1E',

  // Borders & Divider
  border: '#9B9B9A',

  // Status
  error: '#ED1010',
  success: 'green',
  warning: '#FFC300',
  muted: '#eee',

  // Utility
  black: '#000000',
  white: '#FFFFFF',
};


const statusBarHeight = Constants.statusBarHeight;

export const Container = styled.SafeAreaView`
  background-color: ${colors.primary};
  padding: 20px;
  padding-bottom: 0px;
  flex: 1;
  padding-top: ${statusBarHeight}px;
`;

// Header
export const HeaderView = styled.View`
  padding-vertical: 10px;
  padding-top: 15px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.white};
  /* Shadow for iOS */
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;

  /* Shadow for Android */
  elevation: 3;
`;

export const HeaderSubTitle = styled.View`
  margin-bottom: 10px;
  flex-direction: row;
  padding-left: 20px;
  justify-content: space-between;
  align-items: center;
  /* background-color: ${colors.white}; */
  color:${colors.black};
`;

export const HeaderTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: ${colors.black};
  letter-spacing: 1px;
`;
export const HeaderTitleLong = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.white};
  letter-spacing: 1px;
  font-style: italic;
`;
export const HeaderSubTitleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.black};
  letter-spacing: 1px;
  font-style: italic;
`;

export const HeaderButton = styled.TouchableOpacity`
  font-weight: bold;
  color: ${colors.tertiary};
  padding: 10px;
`;

export const HeaderLogo = styled.View`
  padding: 10px;
`;

// List
export const ListContainer = styled.View`
  margin-bottom: 30px;
  flex: 1;
  padding-bottom: 40px;
`;

export const ListView = styled.TouchableHighlight`
  background-color: ${colors.white};
  color: #454545;
  min-height: 85px;
  width: 100%;
  padding: 15px;
  justify-content: space-around;
  margin-bottom: 15px;
  border-radius: 10px;
`;

export const ListRowView = styled.View`
flex-direction: row;
justify-content: flex-end;
margin-top: 20px;
`;

export const ListViewHidden = styled.View`
  background-color: ${colors.tertiary};
  min-height: 85px;
  width: 100%;
  padding: 15px;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 15px;
  border-radius: 11px;
`;

export const ListButton = styled.TouchableOpacity`
  font-weight: bold;
  color: ${colors.tertiary};
  margin-left: 15px;
  margin-bottom: 10px;
`;

export const HiddenButton = styled.TouchableOpacity`
  width: 55px;
  align-items: center;
`;

export const TodoText = styled.Text`
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 500;
  color: ${colors.black};
`;

export const TodoDate = styled.Text`
  font-size: 10px;
  letter-spacing: 1px;
  color: ${colors.black};
  text-align: right;
  text-transform: uppercase;
`;

// Text for swiped todo row
export const SwipedTodoText = styled(TodoText)`
  color: ${colors.secondary};
  font-style: italic;
  text-decoration: line-through;
`;

// Modal
export const ModalButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  background-color: ${colors.tertiary};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  align-self: center;
  position: absolute;
  bottom: 15px;
`;

export const ModalContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #f2f2f2;
`;

export const ModalView = styled.View`
  background-color: #4491FE;
  border-radius: 20px;
  padding: 35px;
`;

export const StyledInput = styled.TextInput`
  width: 300px;
  height: 50px;
  background-color: ${colors.tertiary};
  padding: 10px;
  font-size: 16px;
  border-radius: 10px;
  color: ${colors.black};
  letter-spacing: 1px;
`;

export const ModalAction = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.color};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

export const ModalActionGroup = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 30px;
`;

export const ModalIcon = styled.View`
  align-items: center;
  margin-bottom: 30px;
`;
