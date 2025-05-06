import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../Styles/appStyle';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalView = styled.View`
  background-color: ${colors.white};
  border-radius: 20px;
  padding: 20px;
  width: 85%;
  align-items: center;
  shadow-color: ${colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const MessageText = styled.Text`
  font-size: ${props => props.size || 16}px;
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;

const ModalActionGroup = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
`;

const ModalAction = styled.TouchableOpacity`
  width: 120px;
  height: 40px;
  background-color: ${props => props.color || colors.primary};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const ActionText = styled.Text`
  color: ${colors.textOnPrimary};
  font-size: 16px;
  font-weight: bold;
`;

const ConfirmationModal = ({
  visible,
  onConfirm,
  onCancel,
  message,
  messageSize,
  confirmButtonColor = colors.primary,
  cancelButtonColor = colors.textSecondary,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableOpacity 
        style={{ flex: 1 }} 
        activeOpacity={1} 
        onPress={onCancel}
      >
        <ModalContainer>
          <ModalView>
            <MessageText size={messageSize}>{message}</MessageText>
            <ModalActionGroup>
              <ModalAction color={cancelButtonColor} onPress={onCancel}>
                <ActionText>{cancelButtonText}</ActionText>
              </ModalAction>
              <ModalAction color={confirmButtonColor} onPress={onConfirm}>
                <ActionText>{confirmButtonText}</ActionText>
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </TouchableOpacity>
    </Modal>
  );
};

export default ConfirmationModal;