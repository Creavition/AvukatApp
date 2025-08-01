import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Calendar from '../components/Calendar';
import Timeline from '../components/Timeline';
import { deadlines, events } from "../data/DavaData"

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Home() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: 'Kullanıcı', 
        title: 'Avukat'
    });

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userName = await AsyncStorage.getItem('userName');
                if (userName) {
                    setCurrentUser(prev => ({
                        ...prev,
                        name: userName
                    }));
                }
            } catch (error) {
                console.error('Kullanıcı bilgisi alınamadı:', error);
            }
        };

        getUserInfo();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

            {/* Header Gradient */}
            <LinearGradient
                colors={['#2196F3', '#2196F3', '#42A5F5']}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Hoşgeldiniz Av. {currentUser.name}</Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Search Section */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <View style={styles.searchIconContainer}>
                            <Ionicons name="search" size={20} color="#6B73FF" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder='Dava No, Müvekkil Adı Ara...'
                            placeholderTextColor="#A0A0A0"
                        />

                    </View>

                    {/* Calendar Button with Modern Design */}
                    <TouchableOpacity
                        style={styles.calendarButton}
                        onPress={() => setShowCalendar(true)}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#2196F3', '#2196F3']}
                            style={styles.calendarGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <MaterialIcons name="calendar-today" size={22} color="#fff" />
                            <Text style={styles.calendarButtonText}>Ajanda Takvimi</Text>
                            <View style={styles.eventCount}>
                                <Text style={styles.eventCountText}>
                                    {Object.keys(events).length}
                                </Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    {/* Today's Events Card */}
                    <View style={styles.todayEventsCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.todayIconContainer}>
                                <MaterialIcons name="today" size={22} color="#fff" />
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle}>Bugünün Programı</Text>
                                <Text style={styles.cardSubtitle}>
                                    {new Date().toLocaleDateString('tr-TR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.todayEventsList}>
                            {events[new Date().toISOString().split('T')[0]] ? (
                                events[new Date().toISOString().split('T')[0]].map((event, index) => (
                                    <View key={index} style={styles.eventItem}>
                                        <View style={styles.eventDot} />
                                        <Text style={styles.eventText}>{event}</Text>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.noEventsContainer}>
                                    <MaterialIcons name="check-circle" size={48} color="#E8F5E8" />
                                    <Text style={styles.noEventsText}>Bugün için etkinlik yok</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.quickActionsCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.quickActionIconContainer}>
                                <Ionicons name="flash" size={22} color="#fff" />
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle}>Hızlı İşlemler</Text>
                            </View>
                        </View>

                        <View style={styles.quickActionsGrid}>
                            <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#4CAF50', '#45A049']}
                                    style={styles.quickActionGradient}
                                >
                                    <Entypo name="plus" size={24} color="white" />
                                </LinearGradient>
                                <Text style={styles.quickActionText}>Yeni Dava</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#2196F3', '#1976D2']}
                                    style={styles.quickActionGradient}
                                >
                                    <AntDesign name="addfile" size={24} color="white" />
                                </LinearGradient>
                                <Text style={styles.quickActionText}>Dosya Yükle</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#FF9800', '#F57C00']}
                                    style={styles.quickActionGradient}
                                >
                                    <MaterialIcons name="note-add" size={24} color="white" />
                                </LinearGradient>
                                <Text style={styles.quickActionText}>Not Al</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#E91E63', '#C2185B']}
                                    style={styles.quickActionGradient}
                                >
                                    <AntDesign name="star" size={24} color="white" />
                                </LinearGradient>
                                <Text style={styles.quickActionText}>Favoriler</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Timeline Component */}
                    <Timeline deadlines={deadlines} />
                </View>

                {/* Calendar Component */}
                <Calendar
                    visible={showCalendar}
                    onClose={() => setShowCalendar(false)}
                    events={events}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerGradient: {
        paddingTop: Platform.OS === 'android' ? 15 : 10
    },
    headerContent: {
        alignItems: 'center',
        paddingBottom: 10
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#E3F2FD',
        opacity: 0.9,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: screenHeight * 0.08,
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    searchBar: {
        flexDirection: "row",
        height: 52,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F4F8',
    },
    searchIconContainer: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#334155',
        fontWeight: '500',
    },
    filterButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
    },
    calendarButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    calendarGradient: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
        flex: 1,
    },
    eventCount: {
        backgroundColor: 'red',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderWidth: 2,
        borderColor: 'red',
    },
    eventCountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    todayEventsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F0F4F8',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    todayIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    todayEventsList: {
        marginTop: 8,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        marginBottom: 8,
    },
    eventDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2196F3',
        marginRight: 12,
    },
    eventText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
        flex: 1,
    },
    noEventsContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    noEventsText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 12,
    },
    noEventsSubtext: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 4,
    },
    quickActionsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F4F8',
    },
    quickActionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    quickActionItem: {
        alignItems: 'center',
        width: '18%',
    },
    quickActionGradient: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
        textAlign: 'center',
        lineHeight: 16,
    },
});