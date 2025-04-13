import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from '../Styles/CustomPopupStyles';

const CustomPopup = ({ isVisible, title, message, onConfirm, onCancel }) => {
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View style={styles.popupContainer}>
        <Text style={styles.popupTitle}>{title}</Text>
        <Text style={styles.popupMessage}>{message}</Text>
        <View style={styles.buttonContainer}>
          {onCancel && (
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomPopup;