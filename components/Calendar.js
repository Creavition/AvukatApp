import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const Calendar = ({ visible, onClose, events = {} }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [calendarMode, setCalendarMode] = useState('month');

    const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const isToday = (date) => {
        const today = new Date();
        return formatDate(date) === formatDate(today);
    };

    
    const getDaysInMonth = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

        const days = [];

        
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = adjustedStartingDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }

        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day: day,
                isCurrentMonth: true,
                date: new Date(year, month, day)
            });
        }

        
        const remainingCells = 42 - days.length;
        for (let day = 1; day <= remainingCells; day++) {
            days.push({
                day: day,
                isCurrentMonth: false,
                date: new Date(year, month + 1, day)
            });
        }

        return days;
    };

    const getMonthsForYear = (year) => {
        const months = [];
        for (let month = 0; month < 12; month++) {
            months.push({
                name: monthNames[month],
                number: month,
                days: getDaysInMonth(year, month)
            });
        }
        return months;
    };

    const changeYear = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(currentDate.getFullYear() + direction);
        setCurrentDate(newDate);
    };


    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };


    const selectDate = (date) => {
        setSelectedDate(date);
        const dateString = formatDate(date);
        if (events[dateString]) {
            Alert.alert(
                `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} - Etkinlikler`,
                events[dateString].join('\n\n'),
                [{ text: 'Tamam' }]
            );
        }
    };

    
    const renderMonthCalendar = () => {
        const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const weeks = [];

        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return (
            <View style={styles.monthCalendar}>
                {/* Ay başlığı */}
                <View style={styles.monthHeader}>
                    <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCalendarMode('year')}>
                        <Text style={styles.monthTitle}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
                        <Ionicons name="chevron-forward" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Gün isimleri */}
                <View style={styles.dayNamesRow}>
                    {dayNames.map((dayName, index) => (
                        <Text key={index} style={styles.dayName}>{dayName}</Text>
                    ))}
                </View>

                {/* Günler */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {weeks.map((week, weekIndex) => (
                        <View key={weekIndex} style={styles.weekRow}>
                            {week.map((dayObj, dayIndex) => {
                                const dateString = formatDate(dayObj.date);
                                const hasEvent = events[dateString];
                                const isSelectedDay = selectedDate && formatDate(selectedDate) === dateString;
                                const isTodayDay = isToday(dayObj.date);

                                return (
                                    <TouchableOpacity
                                        key={dayIndex}
                                        style={[
                                            styles.dayCell,
                                            !dayObj.isCurrentMonth && styles.otherMonthDay,
                                            isTodayDay && styles.todayCell,
                                            isSelectedDay && styles.selectedCell,
                                            hasEvent && styles.eventCell
                                        ]}
                                        onPress={() => selectDate(dayObj.date)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.dayCellText,
                                            !dayObj.isCurrentMonth && styles.otherMonthText,
                                            isTodayDay && styles.todayText,
                                            isSelectedDay && styles.selectedText
                                        ]}>
                                            {dayObj.day}
                                        </Text>
                                        {hasEvent && <View style={styles.eventDot} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    };

    const renderYearCalendar = () => {
        const months = getMonthsForYear(currentDate.getFullYear());

        return (
            <View style={styles.yearCalendar}>
                {/* Yıl başlığı */}
                <View style={styles.yearHeader}>
                    <TouchableOpacity onPress={() => changeYear(-1)} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.yearTitle}>{currentDate.getFullYear()}</Text>
                    <TouchableOpacity onPress={() => changeYear(1)} style={styles.navButton}>
                        <Ionicons name="chevron-forward" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.monthsContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.monthsGrid}>
                        {months.map((month, monthIndex) => (
                            <TouchableOpacity
                                key={monthIndex}
                                style={styles.miniMonth}
                                onPress={() => {
                                    const newDate = new Date(currentDate);
                                    newDate.setMonth(month.number);
                                    setCurrentDate(newDate);
                                    setCalendarMode('month');
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.miniMonthName}>{month.name}</Text>
                                <View style={styles.miniMonthGrid}>
                                    {month.days.slice(0, 35).map((dayObj, dayIndex) => {
                                        const dateString = formatDate(dayObj.date);
                                        const hasEvent = events[dateString];
                                        const isTodayDay = isToday(dayObj.date);

                                        return (
                                            <View
                                                key={dayIndex}
                                                style={[
                                                    styles.miniDayCell,
                                                    !dayObj.isCurrentMonth && styles.miniOtherMonth,
                                                    isTodayDay && styles.miniToday,
                                                    hasEvent && styles.miniEventDay
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.miniDayText,
                                                    !dayObj.isCurrentMonth && styles.miniOtherMonthText,
                                                    isTodayDay && styles.miniTodayText
                                                ]}>
                                                    {dayObj.day}
                                                </Text>
                                                {hasEvent && <View style={styles.miniEventDot} />}
                                            </View>
                                        );
                                    })}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Ajanda Takvimi</Text>
                    <TouchableOpacity
                        onPress={() => setCalendarMode(calendarMode === 'month' ? 'year' : 'month')}
                        style={styles.modeButton}
                    >
                        <MaterialIcons
                            name={calendarMode === 'month' ? 'view-module' : 'view-day'}
                            size={28}
                            color="#333"
                        />
                    </TouchableOpacity>
                </View>

                {calendarMode === 'month' ? renderMonthCalendar() : renderYearCalendar()}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: screenWidth * 0.05,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: screenWidth * 0.12,
        backgroundColor: '#f8f9fa',
    },
    modalTitle: {
        fontSize: screenWidth * 0.05,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: screenWidth * 0.015,
    },
    modeButton: {
        padding: screenWidth * 0.015,
    },
    navButton: {
        padding: screenWidth * 0.025,
    },

    monthCalendar: {
        flex: 1,
        padding: screenWidth * 0.05,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: screenWidth * 0.05,
        paddingHorizontal: screenWidth * 0.025,
    },
    monthTitle: {
        fontSize: screenWidth * 0.045,
        fontWeight: 'bold',
        color: '#333',
        textDecorationLine: 'underline',
    },
    dayNamesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: screenWidth * 0.04,
        paddingVertical: screenWidth * 0.03,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dayName: {
        width: screenWidth * 0.1,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#666',
        fontSize: screenWidth * 0.035,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: screenWidth * 0.02,
    },
    dayCell: {
        width: screenWidth * 0.1,
        height: screenWidth * 0.1,
        borderRadius: screenWidth * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    dayCellText: {
        fontSize: screenWidth * 0.04,
        color: '#333',
        fontWeight: '500',
    },
    otherMonthDay: {
        opacity: 0.3,
    },
    otherMonthText: {
        color: '#999',
    },
    todayCell: {
        backgroundColor: '#2196F3',
        elevation: 2,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    todayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    selectedCell: {
        backgroundColor: '#FF9800',
        elevation: 2,
        shadowColor: '#FF9800',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    eventCell: {
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    eventDot: {
        position: 'absolute',
        bottom: 2,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F44336',
    },

    yearCalendar: {
        flex: 1,
        padding: 20,
    },
    yearHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    yearTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    monthsContainer: {
        flex: 1,
    },
    monthsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    miniMonth: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    miniMonthName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    miniMonthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    miniDayCell: {
        width: '13.5%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
        borderRadius: 2,
        position: 'relative',
    },
    miniDayText: {
        fontSize: 10,
        color: '#333',
        fontWeight: '500',
    },
    miniOtherMonth: {
        opacity: 0.3,
    },
    miniOtherMonthText: {
        color: '#999',
    },
    miniToday: {
        backgroundColor: '#2196F3',
        borderRadius: 3,
    },
    miniTodayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    miniEventDay: {
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 3,
    },
    miniEventDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#F44336',
    },
});

export default Calendar;