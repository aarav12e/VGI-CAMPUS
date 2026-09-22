import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const imgMaleShadow = require('../../assets/avatar_male.jpg');
const imgFemaleShadow = require('../../assets/avatar_female.jpg');

/**
 * Intelligent gender detection based on user profile and naming conventions
 */
export function detectUserGender(user) {
  if (!user) return 'MALE';

  // 1. Explicit gender property
  if (user.gender) {
    const g = String(user.gender).trim().toUpperCase();
    if (g.startsWith('F') || g === 'WOMAN' || g === 'GIRL') return 'FEMALE';
    if (g.startsWith('M') || g === 'MAN' || g === 'BOY') return 'MALE';
  }

  // 2. Name-based heuristics
  const name = (user.fullName || user.name || '').trim().toLowerCase();
  if (!name) return 'MALE';

  const firstName = name.split(' ')[0] || '';

  // Common female names in Indian institutions
  const femaleNames = new Set([
    'priya', 'ananya', 'pooja', 'sneha', 'neha', 'ritu', 'sunita', 'kavita',
    'shweta', 'divya', 'isha', 'riya', 'tanvi', 'aditi', 'meera', 'radha',
    'shreya', 'mansi', 'simran', 'pallavi', 'anjali', 'aarti', 'jyoti', 'kavya',
    'sakshi', 'khushi', 'muskan', 'tanya', 'komal', 'diksha', 'nidhi', 'deepika',
    'alka', 'rekha', 'mamta', 'monika', 'swati', 'preeti', 'geeta', 'seema',
    'sapna', 'sonia', 'vandana', 'rashmi', 'megha', 'shikha', 'archana', 'bhavna'
  ]);

  if (femaleNames.has(firstName)) return 'FEMALE';

  // Suffix checks
  if (
    name.endsWith(' devi') ||
    name.endsWith(' kaur') ||
    name.endsWith(' kumari') ||
    name.endsWith(' shree') ||
    name.endsWith('vati')
  ) {
    return 'FEMALE';
  }

  return 'MALE';
}

/**
 * Empty Shadow Silhouette Avatar Component (Male / Female aware)
 */
export default function UserShadowAvatar({
  user,
  size = 72,
  style,
  ringColor = 'rgba(255, 255, 255, 0.35)'
}) {
  const gender = detectUserGender(user);
  const avatarSource = gender === 'FEMALE' ? imgFemaleShadow : imgMaleShadow;

  return (
    <View
      style={[
        styles.ringContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: ringColor
        },
        style
      ]}
    >
      <Image
        source={avatarSource}
        style={{
          width: size - 4,
          height: size - 4,
          borderRadius: (size - 4) / 2
        }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ringContainer: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4
  }
});
