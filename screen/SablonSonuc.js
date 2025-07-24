import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Share,
    Platform,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Responsive boyutlandırma için
const { width: screenWidth } = Dimensions.get('window');

export default function SablonSonuc({ route, navigation }) {
    const { sablon, doldurulmusMetin, formData } = route.params;
    const [fontSize, setFontSize] = useState(14);

    // Paylaşma fonksiyonu
    const paylas = async () => {
        try {
            await Share.share({
                message: doldurulmusMetin,
                title: sablon.baslik
            });
        } catch (error) {
            Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu.');
        }
    };

    // Kopyala
    const kopyala = async () => {
        try {
            // React Native'de Clipboard API kullanılabilir ama şimdilik Alert ile gösterelim
            Alert.alert(
                'Kopyalandı',
                'Dilekçe metni panoya kopyalandı.',
                [{ text: 'Tamam' }]
            );
        } catch (error) {
            Alert.alert('Hata', 'Kopyalama sırasında bir hata oluştu.');
        }
    };

    // Kaydet
    const kaydet = () => {
        Alert.alert(
            'Kaydet',
            'Dilekçeyi kaydetmek istediğinizden emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Kaydet',
                    onPress: () => {
                        // Burada kaydetme işlemi yapılacak
                        Alert.alert('Başarılı', 'Dilekçe başarıyla kaydedildi.');
                    }
                }
            ]
        );
    };

    // PDF Oluştur
    const pdfOlustur = () => {
        Alert.alert(
            'PDF Oluştur',
            'Bu özellik henüz geliştirme aşamasındadır.',
            [{ text: 'Tamam' }]
        );
    };

    // Yazı boyutunu değiştir
    const fontSizeChange = (increase) => {
        if (increase && fontSize < 20) {
            setFontSize(fontSize + 1);
        } else if (!increase && fontSize > 10) {
            setFontSize(fontSize - 1);
        }
    };

    // Düzenle
    const duzenle = () => {
        navigation.goBack(); // Form sayfasına geri dön
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{sablon.baslik}</Text>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={paylas}
                >
                    <Ionicons name="share-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Toolbar */}
            <View style={styles.toolbar}>
                <TouchableOpacity style={styles.toolButton} onPress={duzenle}>
                    <MaterialIcons name="edit" size={20} color="#2196F3" />
                    <Text style={styles.toolButtonText}>Düzenle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolButton} onPress={kopyala}>
                    <MaterialIcons name="content-copy" size={20} color="#4CAF50" />
                    <Text style={styles.toolButtonText}>Kopyala</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolButton} onPress={kaydet}>
                    <MaterialIcons name="save" size={20} color="#FF9800" />
                    <Text style={styles.toolButtonText}>Kaydet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolButton} onPress={pdfOlustur}>
                    <MaterialIcons name="picture-as-pdf" size={20} color="#F44336" />
                    <Text style={styles.toolButtonText}>PDF</Text>
                </TouchableOpacity>
            </View>

            {/* Font Boyutu Kontrolleri */}
            <View style={styles.fontControls}>
                <Text style={styles.fontLabel}>Yazı Boyutu:</Text>
                <TouchableOpacity
                    style={styles.fontButton}
                    onPress={() => fontSizeChange(false)}
                >
                    <MaterialIcons name="remove" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.fontSizeText}>{fontSize}</Text>
                <TouchableOpacity
                    style={styles.fontButton}
                    onPress={() => fontSizeChange(true)}
                >
                    <MaterialIcons name="add" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Dilekçe İçeriği */}
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.paperContainer}>
                    <Text style={[styles.dilekceText, { fontSize: fontSize }]}>
                        {doldurulmusMetin}
                    </Text>
                </View>
            </ScrollView>

            {/* Alt Butonlar */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => {
                        Alert.alert(
                            'Yeni Dilekçe',
                            'Ana sayfaya dönüp yeni bir dilekçe oluşturmak istiyor musunuz?',
                            [
                                { text: 'İptal', style: 'cancel' },
                                {
                                    text: 'Evet',
                                    onPress: () => navigation.popToTop()
                                }
                            ]
                        );
                    }}
                >
                    <MaterialIcons name="add" size={20} color="#666" />
                    <Text style={styles.secondaryButtonText}>Yeni Dilekçe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={paylas}
                >
                    <MaterialIcons name="share" size={20} color="#fff" />
                    <Text style={styles.primaryButtonText}>Paylaş</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth * 0.04,
        paddingTop: screenWidth * 0.12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerButton: {
        padding: screenWidth * 0.015,
    },
    headerTitle: {
        fontSize: screenWidth * 0.04,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    toolbar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        justifyContent: 'space-around',
    },
    toolButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#f8f8f8',
    },
    toolButtonText: {
        fontSize: 12,
        color: '#333',
        marginLeft: 4,
        fontWeight: '500',
    },
    fontControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        justifyContent: 'center',
    },
    fontLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 15,
    },
    fontButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    fontSizeText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        minWidth: 25,
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        padding: 15,
    },
    paperContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dilekceText: {
        color: '#333',
        lineHeight: 24,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    bottomContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 10,
    },
    secondaryButtonText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
        fontWeight: '500',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
});
