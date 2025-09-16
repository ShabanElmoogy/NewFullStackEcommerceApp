
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

// Enhanced toast configuration with attractive designs
export const toastConfig = {
  success: (props) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.subtitle}>{props.text2}</Text>}
      </View>
    </View>
  ),
  
  error: (props) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✕</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.subtitle}>{props.text2}</Text>}
      </View>
    </View>
  ),
  
  info: (props) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>ℹ</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.subtitle}>{props.text2}</Text>}
      </View>
    </View>
  ),
  
  warning: (props) => (
    <View style={[styles.toastContainer, styles.warningToast]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.subtitle}>{props.text2}</Text>}
      </View>
    </View>
  ),

  // Custom gradient toast
  gradient: (props) => (
    <View style={[styles.toastContainer, styles.gradientToast]}>
      <View style={styles.gradientOverlay} />
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🎉</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: 'white' }]}>{props.text1}</Text>
        {props.text2 && <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.9)' }]}>{props.text2}</Text>}
      </View>
    </View>
  ),
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 60,
  },
  
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  
  // Toast type specific styles
  successToast: {
    backgroundColor: '#10B981', // Emerald green
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  
  errorToast: {
    backgroundColor: '#EF4444', // Red
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  
  infoToast: {
    backgroundColor: '#3B82F6', // Blue
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  
  warningToast: {
    backgroundColor: '#F59E0B', // Amber
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  
  gradientToast: {
    backgroundColor: '#8B5CF6', // Purple base
    position: 'relative',
    overflow: 'hidden',
  },
  
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // You can use react-native-linear-gradient here for actual gradients
    // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
})