import { createIcon } from '@/components/ui/icon';
import React from 'react';
import { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// Modern gradient version
export const SignInIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Defs>
        <LinearGradient id="doorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#667EEA" />
          <Stop offset="100%" stopColor="#764BA2" />
        </LinearGradient>
        <LinearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#4FACFE" />
          <Stop offset="100%" stopColor="#00F2FE" />
        </LinearGradient>
      </Defs>
      
      {/* Door frame with gradient */}
      <Path
        d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10"
        stroke="url(#doorGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Door handle */}
      <Circle
        cx="12"
        cy="12"
        r="1"
        fill="#FFD700"
      />
      
      {/* Arrow with gradient */}
      <Path
        d="M10 17L15 12L10 7"
        stroke="url(#arrowGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M15 12H3"
        stroke="url(#arrowGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});