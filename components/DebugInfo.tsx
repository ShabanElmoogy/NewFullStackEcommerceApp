import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from './ui/text';

interface DebugInfoProps {
  data: any;
  title: string;
}

export default function DebugInfo({ data, title }: DebugInfoProps) {
  return (
    <View style={{ 
      backgroundColor: '#f0f0f0', 
      padding: 16, 
      margin: 16, 
      borderRadius: 8,
      maxHeight: 300
    }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
        {title}
      </Text>
      <ScrollView>
        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
          {JSON.stringify(data, null, 2)}
        </Text>
      </ScrollView>
    </View>
  );
}