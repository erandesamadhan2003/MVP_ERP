import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Card,
  Divider,
  IconButton,
} from 'react-native-paper';

import { NewsAndAnnouncementsService } from '../api/services/newsAndAnnouncements/newsAndAnnouncementsService';
import { NewsAnnouncement } from '../types/newsAndAnnouncements.types';

const ITEM_HEIGHT = 82; // approx height per news item (adjust if needed)
const VISIBLE_HEIGHT = 450; // height of the news viewport
const SCROLL_STEP = 0.6; // pixels per tick (lower = slower)
const INTERVAL_MS = 20; // timer tick (ms)

export default function HomeScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState<NewsAnnouncement[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const positionRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const fetchNews = async () => {
    try {
      const res = await NewsAndAnnouncementsService();
      setNewsList(res?.ResponseData || []);
    } catch (error) {
      console.log('fetchNews error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Start auto scroll once news loaded
  useEffect(() => {
    // clear any previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!loading && newsList.length > 0) {
      // position reference
      positionRef.current = 0;

      // duplicate list to allow smooth wrap-around
      const totalHeight = newsList.length * ITEM_HEIGHT;

      intervalRef.current = setInterval(() => {
        positionRef.current += SCROLL_STEP;

        // reset when we've scrolled through one full original list
        if (positionRef.current >= totalHeight) {
          positionRef.current = 0;
          // jump without animation
          scrollRef.current?.scrollTo({ y: 0, animated: false });
        } else {
          // scroll smoothly (animated: false yields instant; we emulate smooth by frequent small increments)
          scrollRef.current?.scrollTo({ y: positionRef.current, animated: false });
        }
      }, INTERVAL_MS) as unknown as number;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, newsList]);

  const renderLoginCard = (label: string, navigateTo: string, iconName: string, iconColor: string) => (
    <TouchableOpacity
      key={label}
      onPress={() => navigation.navigate(navigateTo)}
      activeOpacity={0.85}
      style={styles.loginCardWrapper}
    >
      <Card style={styles.loginCard}>
        <Card.Content style={styles.loginCardContent}>
          <IconButton icon={iconName} size={32} iconColor={iconColor} />
          <Text style={styles.loginLabel}>{label}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // Duplicate array to render twice for seamless loop
  const duplicatedNews = [...newsList, ...newsList];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>मराठा विद्या प्रसारक समाज, नाशिक</Text>
        <Text style={styles.subtitle}>Est. 1914 | Nashik</Text>
      </View>

      {/* Login Row (three cards in a single row) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Login As</Text>
        <View style={styles.loginRow}>
          {renderLoginCard('Student', 'StudentLogin', 'account-school', '#0A84FF')}
          {renderLoginCard('Faculty', 'FacultyLogin', 'account-tie', '#0BB24A')}
          {renderLoginCard('Institute', 'InstituteLogin', 'office-building', '#F2A400')}
        </View>
      </View>

      {/* News & Announcements */}
      <View style={styles.section}>
        <Card style={styles.newsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>News & Announcements</Text>

            {loading ? (
              <ActivityIndicator />
            ) : (
              <View style={{ height: VISIBLE_HEIGHT, overflow: 'hidden' }}>
                <ScrollView
                  ref={ref => (scrollRef.current = ref)}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: Platform.OS === 'android' ? 8 : 0 }}
                >
                  {duplicatedNews.map((item, idx) => (
                    <View key={`${item.ID ?? idx}-${idx}`} style={styles.newsItem}>
                      <Text style={styles.newsHeader}>• {item.MessageHeader}</Text>
                      <Text style={styles.newsDetails}>{item.Details?.slice(0, 120)}...</Text>
                      <Divider style={{ marginTop: 10 }} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef4ff' },

  headerContainer: { alignItems: 'center', paddingVertical: 18 },
  logo: { width: 95, height: 95, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: '700', color: '#08306b', marginTop: 8, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#666' },

  section: { paddingHorizontal: 16, marginTop: 18 },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#003566', marginBottom: 10, textAlign: 'center' },

  // login row: three cards in a single row
  loginRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' },
  loginCardWrapper: { flex: 1, marginHorizontal: 6 },
  loginCard: { borderRadius: 10, backgroundColor: '#fff', elevation: 3 },
  loginCardContent: { alignItems: 'center', paddingVertical: 12 },
  loginLabel: { marginTop: 2, fontSize: 14, fontWeight: '600', color: '#08306b' },

  // news
  newsCard: { borderRadius: 10, backgroundColor: '#fff', elevation: 3 },
  newsItem: { paddingVertical: 10, paddingRight: 8 },
  newsHeader: { fontSize: 14, fontWeight: '700', color: '#003566' },
  newsDetails: { fontSize: 13, color: '#666', marginTop: 4 },
});
