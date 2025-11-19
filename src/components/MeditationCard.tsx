import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MeditationSession } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface MeditationCardProps {
  session: MeditationSession;
  onPress: () => void;
  style?: any;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  session,
  onPress,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: session.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.categoryContainer}>
          <Text style={[styles.category, { backgroundColor: session.category.color }]}>
            {session.category.icon} {session.category.name}
          </Text>
        </View>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {session.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.duration}>
            {(session.duration || 0).toFixed(2)} min
          </Text>
          {session.isCompleted && (
            <Text style={styles.completed}>✓ Completada</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  category: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  completed: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '600',
  },
});
