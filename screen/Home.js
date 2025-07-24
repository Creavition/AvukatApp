import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import Calendar from '../components/Calendar';
import Timeline from '../components/Timeline';
import { deadlines, events } from "../data/Data"

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Home() {
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: "center" }}>
                {/* Arama Çubuğu */}
                <View style={styles.searchBar}>
                    <Ionicons
                        style={{ paddingRight: 10, paddingTop: 10, alignItems: "center" }}
                        name="search"
                        size={24}
                        color="black"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Dava No, Müvekkil Adı'
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Takvim Butonu */}
                <TouchableOpacity
                    style={styles.calendarButton}
                    onPress={() => setShowCalendar(true)}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="calendar-today" size={24} color="#fff" />
                    <Text style={styles.calendarButtonText}>Ajanda Takvimi</Text>
                    <View style={styles.eventCount}>
                        <Text style={styles.eventCountText}>
                            {Object.keys(events).length}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {/* Bugünün Etkinlikleri */}
                <View style={styles.todayEvents}>
                    <View style={styles.todayHeader}>
                        <MaterialIcons name="today" size={20} color="#333" />
                        <Text style={styles.todayTitle}>Bugün</Text>
                    </View>
                    {events[new Date().toISOString().split('T')[0]] ? (
                        events[new Date().toISOString().split('T')[0]].map((event, index) => (
                            <Text key={index} style={styles.todayEvent}>
                                • {event}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.noEvents}>Bugün için etkinlik bulunmuyor</Text>
                    )}
                </View>

                {/* Hızlı İşlemler */}
                <View style={styles.quickActionsContainer}>
                    <View style={styles.quickActionsHeader}>
                        <Ionicons name="flash" size={24} color="black" />
                        <Text style={styles.quickActionsTitle}>Hızlı İşlemler</Text>
                    </View>

                    <View style={styles.quickActionsList}>
                        <TouchableOpacity style={styles.quickActionItem}>
                            <Entypo name="plus" size={24} color="black" />
                            <Text style={styles.quickActionText}>Yeni Dava Ekle</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionItem}>
                            <AntDesign name="addfile" size={24} color="black" />
                            <Text style={styles.quickActionText}>Dosya Yükle</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.quickActionsList}>
                        <TouchableOpacity style={styles.quickActionItem}>
                            <MaterialIcons name="note-add" size={24} color="black" />
                            <Text style={styles.quickActionText}>Not Al</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionItem}>
                            <AntDesign name="star" size={24} color="black" />
                            <Text style={styles.quickActionText}>Favori Davalar</Text>
                        </TouchableOpacity>
                    </View>


                </View>
                {/* İtiraz Süreleri Timeline */}
                <Timeline deadlines={deadlines} />

                {/* Takvim Component'i */}
                <Calendar
                    visible={showCalendar}
                    onClose={() => setShowCalendar(false)}
                    events={events}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingVertical: screenWidth * 0.08,
        paddingHorizontal: screenWidth * 0.05,
    },
    searchBar: {
        flexDirection: "row",
        height: screenHeight * 0.06,
        width: screenWidth * 0.9,
        maxWidth: 400,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "black",
        margin: screenHeight * 0.07,
        paddingHorizontal: screenWidth * 0.03,
        marginBottom: screenWidth * 0.05,
        backgroundColor: '#fff',
    },
    input: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        fontSize: screenWidth * 0.04,
        color: '#333',
    },
    calendarButton: {
        flexDirection: 'row',
        backgroundColor: '#2196F3',
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth * 0.04,
        borderRadius: 12,
        alignItems: 'center',
        width: screenWidth * 0.9,
        maxWidth: 400,
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    calendarButtonText: {
        color: '#fff',
        fontSize: screenWidth * 0.04,
        fontWeight: 'bold',
        marginLeft: screenWidth * 0.02,
    },
    eventCount: {
        position: 'absolute',
        right: screenWidth * 0.04,
        backgroundColor: '#FF4444',
        borderRadius: 12,
        minWidth: screenWidth * 0.06,
        height: screenWidth * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    eventCountText: {
        color: '#fff',
        fontSize: screenWidth * 0.03,
        fontWeight: 'bold',
    },
    todayEvents: {
        width: screenWidth * 0.9,
        maxWidth: 400,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: screenWidth * 0.04,
        marginBottom: screenWidth * 0.03,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    todayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: screenWidth * 0.025,
    },
    todayTitle: {
        fontSize: screenWidth * 0.04,
        fontWeight: 'bold',
        marginLeft: screenWidth * 0.015,
        color: '#333',
    },
    todayEvent: {
        fontSize: screenWidth * 0.035,
        color: '#666',
        marginBottom: screenWidth * 0.015,
        lineHeight: screenWidth * 0.05,
    },
    noEvents: {
        fontSize: screenWidth * 0.035,
        color: '#999',
        fontStyle: 'italic',
    },
    quick: {
        borderWidth: 2,
        paddingHorizontal: screenWidth * 0.04,
        paddingVertical: screenWidth * 0.03,
        marginHorizontal: screenWidth * 0.025,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    textStyle: {
        paddingLeft: screenWidth * 0.025,
        fontSize: screenWidth * 0.035,
        fontWeight: '500',
        color: '#333',
    },
    quickActionsContainer: {
        width: screenWidth * 0.9,
        maxWidth: 400,
        alignSelf: 'flex-start',
        marginTop: screenWidth * 0.05,
    },
    quickActionsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: screenWidth * 0.04,
    },
    quickActionsTitle: {
        fontSize: screenWidth * 0.04,
        fontWeight: 'bold',
        marginLeft: screenWidth * 0.02,
        color: '#333',
    },
    quickActionsList: {
        justifyContent: "space-between",
        flexDirection: "row",
        width: '100%',
    },
    quickActionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d3e0eeff',
        marginRight: screenWidth * 0.02,
        padding: screenWidth * 0.035,
        width: screenWidth * 0.42,
        marginBottom: screenWidth * 0.025,
        borderRadius: 10,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    quickActionText: {
        fontSize: screenWidth * 0.032,
        fontWeight: '500',
        marginLeft: screenWidth * 0.02,
        color: '#333',
        flexShrink: 1,
    },
});