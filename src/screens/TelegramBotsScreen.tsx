import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const TelegramBotsScreen: React.FC = () => {
  const { theme } = useTheme();

  const handleOpenBot = async (botUrl: string, botName: string) => {
    try {
      const supported = await Linking.canOpenURL(botUrl);
      
      if (supported) {
        await Linking.openURL(botUrl);
      } else {
        Alert.alert(
          'Error',
          `No se puede abrir el link de ${botName}. Asegúrate de tener Telegram instalado.`
        );
      }
    } catch (error) {
      console.error('Error opening bot:', error);
      Alert.alert(
        'Error',
        'Ocurrió un error al intentar abrir el bot de Telegram.'
      );
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nuestros Bots de Telegram</Text>
          <Text style={styles.headerSubtitle}>
            Conecta con nuestros bots para acceder a meditaciones personalizadas directamente desde Telegram
          </Text>
        </View>

        {/* Bot 1: CalmaBot (Texto) */}
        <View style={styles.botCard}>
          <View style={styles.botHeader}>
            <View style={styles.botIconContainer}>
              <Text style={styles.botIcon}>💬</Text>
            </View>
            <View style={styles.botInfo}>
              <Text style={styles.botName}>CalmaBot</Text>
              <Text style={styles.botType}>Bot de Texto</Text>
            </View>
          </View>

          <View style={styles.botDescription}>
            <Text style={styles.descriptionTitle}>¿Qué ofrece?</Text>
            <Text style={styles.descriptionText}>
              • Consejos de meditación y mindfulness{'\n'}
              • Guías rápidas de relajación{'\n'}
              • Respuestas a tus preguntas sobre bienestar{'\n'}
              • Técnicas de respiración y manejo del estrés
            </Text>
          </View>

          <TouchableOpacity
            style={styles.openButton}
            onPress={() => handleOpenBot('https://t.me/BetterCalmTalkBot', 'CalmaBot')}
            activeOpacity={0.8}
          >
            <Text style={styles.telegramIcon}>✈️</Text>
            <Text style={styles.openButtonText}>Abrir en Telegram</Text>
            <Text style={styles.openButtonArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.botFooter}>
            <Text style={styles.footerText}>@BetterCalmTalkBot</Text>
          </View>
        </View>

        {/* Bot 2: Bot de Meditación (Audio) */}
        <View style={styles.botCard}>
          <View style={styles.botHeader}>
            <View style={styles.botIconContainer}>
              <Text style={styles.botIcon}>🎵</Text>
            </View>
            <View style={styles.botInfo}>
              <Text style={styles.botName}>Bot de Meditación</Text>
              <Text style={styles.botType}>Bot de Audio</Text>
            </View>
          </View>

          <View style={styles.botDescription}>
            <Text style={styles.descriptionTitle}>¿Qué ofrece?</Text>
            <Text style={styles.descriptionText}>
              • Meditaciones personalizadas con IA{'\n'}
              • Audios generados según tus necesidades{'\n'}
              • Voces femenina y masculina disponibles{'\n'}
              • Duraciones de 5, 10 y 15 minutos{'\n'}
              • Objetivos: Reducir estrés, mejorar concentración, ayudar a dormir
            </Text>
          </View>

          <TouchableOpacity
            style={styles.openButton}
            onPress={() => handleOpenBot('https://t.me/betterMeditation', 'Bot de Meditación')}
            activeOpacity={0.8}
          >
            <Text style={styles.telegramIcon}>✈️</Text>
            <Text style={styles.openButtonText}>Abrir en Telegram</Text>
            <Text style={styles.openButtonArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.botFooter}>
            <Text style={styles.footerText}>@betterMeditation</Text>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoTitle}>¿Cómo usar los bots?</Text>
          <Text style={styles.infoText}>
            1. Presiona el botón "Abrir en Telegram" del bot que prefieras{'\n'}
            2. Se abrirá Telegram con el bot{'\n'}
            3. Presiona "START" o envía /start{'\n'}
            4. Sigue las instrucciones del bot
          </Text>
        </View>

        {/* Nota sobre Telegram */}
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            📱 Necesitas tener Telegram instalado en tu dispositivo para usar estos bots.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 20,
    backgroundColor: theme.card,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  botCard: {
    backgroundColor: theme.card,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  botIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  botIcon: {
    fontSize: 32,
  },
  botInfo: {
    flex: 1,
  },
  botName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  botType: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  botDescription: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: theme.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 12,
  },
  telegramIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  openButtonArrow: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  botFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: theme.textSecondary,
    fontFamily: 'monospace',
  },
  infoCard: {
    backgroundColor: theme.primary + '15',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  noteCard: {
    backgroundColor: theme.surface,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  noteText: {
    fontSize: 13,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TelegramBotsScreen;

