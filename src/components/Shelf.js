import React from 'react';
import { ScrollView } from 'react-native';
import FadeIn from './FadeIn';

export default function Shelf({ children, gap = 14 }) {
  const items = React.Children.toArray(children);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap }}>
      {items.map((c, i) => <FadeIn key={i} delay={i * 50}>{c}</FadeIn>)}
    </ScrollView>
  );
}
