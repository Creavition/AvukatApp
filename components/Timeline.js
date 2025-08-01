import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Timeline = ({ deadlines = [] }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatShortDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };

    const getDaysRemaining = (dateString) => {
        const today = new Date();
        const targetDate = new Date(dateString);
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getUrgencyColor = (daysRemaining) => {
        if (daysRemaining < 0) return '#9E9E9E';
        if (daysRemaining <= 3) return '#F44336';
        if (daysRemaining <= 7) return '#FF9800';
        if (daysRemaining <= 15) return '#FFC107';
        return '#4CAF50';
    };

    const getUrgencyIcon = (daysRemaining) => {
        if (daysRemaining < 0) return 'check-circle';
        if (daysRemaining <= 3) return 'error';
        if (daysRemaining <= 7) return 'warning';
        if (daysRemaining <= 15) return 'schedule';
        return 'access-time';
    };


    const getUrgencyText = (daysRemaining) => {
        if (daysRemaining < 0) return `${Math.abs(daysRemaining)} gün geçti`;
        if (daysRemaining === 0) return 'Bugün';
        if (daysRemaining === 1) return 'Yarın';
        return `${daysRemaining} gün kaldı`;
    };

    const renderTimelineCard = (item, index) => {
        const daysRemaining = getDaysRemaining(item.date);
        const urgencyColor = getUrgencyColor(daysRemaining);
        const urgencyIcon = getUrgencyIcon(daysRemaining);
        const urgencyText = getUrgencyText(daysRemaining);

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.timelineCard,
                    {
                        borderLeftColor: urgencyColor,
                        borderColor: urgencyColor
                    }
                ]}
                onPress={() => {
                    setSelectedItem(item);
                    setShowModal(true);
                }}
                activeOpacity={0.7}
            >
                {/* Üst kısım - Tarih ve durum */}
                <View style={styles.cardHeader}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>
                            {formatShortDate(item.date)} {new Date(item.date).getFullYear()}
                        </Text>

                    </View>
                    <View style={[styles.statusIcon, { backgroundColor: urgencyColor }]}>
                        <MaterialIcons
                            name={urgencyIcon}
                            size={16}
                            color="#fff"
                        />
                    </View>
                </View>

                {/* Orta kısım - Başlık */}
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.title}
                    </Text>

                    <View style={styles.caseInfo}>
                        <MaterialIcons name="gavel" size={14} color="#666" />
                        <Text style={styles.caseNumber} numberOfLines={1}>
                            {item.caseNumber}
                        </Text>
                    </View>

                    <View style={styles.clientInfo}>
                        <MaterialIcons name="person" size={14} color="#666" />
                        <Text style={styles.clientName} numberOfLines={1}>
                            {item.clientName}
                        </Text>
                    </View>
                </View>

                {/* Alt kısım - Aciliyet durumu */}
                <View style={styles.cardFooter}>
                    <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
                        <Text style={styles.urgencyText}>
                            {urgencyText}
                        </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={16} color="#999" />
                </View>
            </TouchableOpacity>
        );
    };

    const renderModal = () => {
        if (!selectedItem) return null;

        const daysRemaining = getDaysRemaining(selectedItem.date);
        const urgencyColor = getUrgencyColor(daysRemaining);
        const urgencyText = getUrgencyText(daysRemaining);

        return (
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Modal başlık */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>İtiraz Süresi Detayı</Text>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* İçerik */}
                        <View style={styles.modalBody}>
                            <View style={[styles.modalUrgencyBadge, { backgroundColor: urgencyColor }]}>
                                <MaterialIcons
                                    name={getUrgencyIcon(daysRemaining)}
                                    size={20}
                                    color="#fff"
                                />
                                <Text style={styles.modalUrgencyText}>
                                    {urgencyText}
                                </Text>
                            </View>

                            <Text style={styles.modalItemTitle}>
                                {selectedItem.title}
                            </Text>

                            <View style={styles.modalInfoRow}>
                                <MaterialIcons name="gavel" size={20} color="#666" />
                                <Text style={styles.modalInfoText}>
                                    {selectedItem.caseNumber}
                                </Text>
                            </View>

                            <View style={styles.modalInfoRow}>
                                <MaterialIcons name="person" size={20} color="#666" />
                                <Text style={styles.modalInfoText}>
                                    {selectedItem.clientName}
                                </Text>
                            </View>

                            <View style={styles.modalInfoRow}>
                                <MaterialIcons name="event" size={20} color="#666" />
                                <Text style={styles.modalInfoText}>
                                    {formatDate(selectedItem.date)}
                                </Text>
                            </View>

                            {selectedItem.description && (
                                <View style={styles.modalDescription}>
                                    <Text style={styles.modalDescriptionTitle}>Açıklama:</Text>
                                    <Text style={styles.modalDescriptionText}>
                                        {selectedItem.description}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Alt butonlar */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setShowModal(false);
                                    console.log('Detay sayfasına git:', selectedItem.id);
                                }}
                            >
                                <MaterialIcons name="open-in-new" size={20} color="#2196F3" />
                                <Text style={styles.modalButtonText}>Detaya Git</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSecondary]}
                                onPress={() => {
                                    setShowModal(false);
                                    console.log('Hatırlatma ekle:', selectedItem.id);
                                }}
                            >
                                <MaterialIcons name="notification-add" size={20} color="#666" />
                                <Text style={[styles.modalButtonText, { color: '#666' }]}>
                                    Hatırlatma Ekle
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const sortedDeadlines = deadlines
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 20);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerIconContainer}>
                    <MaterialIcons name="schedule" size={22} color="#fff" />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Yaklaşan İtiraz Süreleri</Text>
                </View>
                {sortedDeadlines.length > 0 && (
                    <View style={styles.countBadgeContainer}>
                        <Text style={styles.countBadge}>{sortedDeadlines.length}</Text>
                    </View>
                )}
            </View>

            {sortedDeadlines.length > 0 ? (
                <ScrollView
                    horizontal={true}
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToInterval={CARD_WIDTH + 12}
                    snapToAlignment="start"
                    pagingEnabled={false}
                >
                    {sortedDeadlines.map(renderTimelineCard)}
                </ScrollView>
            ) : (
                <View style={styles.emptyState}>
                    <MaterialIcons name="check-circle" size={32} color="#4CAF50" />
                    <Text style={styles.emptyStateText}>
                        Yaklaşan itiraz süresi bulunmuyor
                    </Text>
                </View>
            )}

            {renderModal()}
        </View>
    );
};

const CARD_WIDTH = width * 0.37;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#F0F4F8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    countBadgeContainer: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    countBadge: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    scrollContainer: {
        marginHorizontal: -6,
        marginTop: 8,
    },
    scrollContent: {
        paddingHorizontal: 6,
        paddingRight: 18,
    },
    timelineCard: {
        width: CARD_WIDTH,
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#F0F4F8',
        borderLeftWidth: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    dateContainer: {
        alignItems: 'flex-start',
        paddingTop: 2,
        paddingRight: 4
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        lineHeight: 20,
    },
    yearText: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    statusIcon: {
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    cardBody: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        lineHeight: 18,
        marginBottom: 8,
        minHeight: 36,
    },
    caseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    caseNumber: {
        fontSize: 11,
        color: '#64748B',
        marginLeft: 4,
        flex: 1,
        fontWeight: '500',
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    clientName: {
        fontSize: 11,
        color: '#64748B',
        marginLeft: 4,
        flex: 1,
        fontWeight: '500',
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    clientName: {
        fontSize: 11,
        color: '#64748B',
        marginLeft: 4,
        flex: 1,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F4F8',
        paddingTop: 8,
        marginTop: 4,
    },
    urgencyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    urgencyText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyState: {
        alignItems: 'center',
        padding: 20,
        paddingVertical: 30,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        marginTop: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
        fontWeight: '500',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: '100%',
        maxWidth: 350,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    modalBody: {
        padding: 20,
    },
    modalUrgencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 15,
    },
    modalUrgencyText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 14,
    },
    modalItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        lineHeight: 22,
    },
    modalInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalInfoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
        flex: 1,
    },
    modalDescription: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    modalDescriptionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    modalDescriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    modalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        backgroundColor: '#f0f8ff',
    },
    modalButtonSecondary: {
        backgroundColor: '#f5f5f5',
    },
    modalButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
        color: '#2196F3',
    },
});

export default Timeline;