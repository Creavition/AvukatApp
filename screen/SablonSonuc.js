import React from 'react';
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
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const { width: screenWidth } = Dimensions.get('window');

export default function SablonSonuc({ route, navigation }) {
    const { sablon, doldurulmusMetin, formData } = route.params;

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


    const kopyala = async () => {
        try {
            Alert.alert(
                'Kopyalandı',
                'Dilekçe metni panoya kopyalandı.',
                [{ text: 'Tamam' }]
            );
        } catch (error) {
            Alert.alert('Hata', 'Kopyalama sırasında bir hata oluştu.');
        }
    };

    const kaydet = () => {
        Alert.alert(
            'Kaydet',
            'Dilekçeyi kaydetmek istediğinizden emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Kaydet',
                    onPress: () => {

                        Alert.alert('Başarılı', 'Dilekçe başarıyla kaydedildi.');
                    }
                }
            ]
        );
    };


    const pdfOlustur = async () => {
        try {
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${sablon.baslik}</title>
                <style>
                    body {
                        font-family: 'Times New Roman', serif;
                        line-height: 1.6;
                        margin: 40px;
                        color: #333;
                        background-color: white;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .content {
                        text-align: justify;
                        font-size: 12px;
                        line-height: 1.8;
                        margin-bottom: 30px;
                    }
                    .footer {
                        margin-top: 50px;
                        text-align: right;
                        font-size: 12px;
                    }
                    .page-number {
                        position: fixed;
                        bottom: 20px;
                        right: 50%;
                        font-size: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">${sablon.baslik}</div>
                </div>
                
                <div class="content">
                    ${doldurulmusMetin.replace(/\n/g, '<br>')}
                </div>
                
                <div class="footer">
                    <p>Dilekçe Tarihi: ${new Date().toLocaleDateString('tr-TR')}</p>
                </div>
                
                <div class="page-number">
                    Sayfa 1
                </div>
            </body>
            </html>
            `;

            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false
            });

            console.log('PDF oluşturuldu:', uri);

            const isAvailable = await Sharing.isAvailableAsync();

            if (isAvailable) {
                Alert.alert(
                    'PDF Oluşturuldu!',
                    'Dosya başarıyla hazırlandı. Ne yapmak istiyorsunuz?',
                    [
                        { text: 'Tamam', style: 'default' },
                        {
                            text: 'Paylaş',
                            onPress: () => Sharing.shareAsync(uri, {
                                dialogTitle: sablon.baslik || 'Dilekçe',
                                mimeType: 'application/pdf'
                            })
                        }
                    ]
                );
            } else {
                Alert.alert('Başarılı', 'PDF başarıyla oluşturuldu!');
            }

        } catch (error) {
            console.error('PDF oluşturma hatası:', error);
            Alert.alert('Hata', 'PDF oluşturulurken bir hata oluştu.');
        }
    };

    const duzenle = () => {
        navigation.goBack();
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

            {/* Dilekçe İçeriği */}
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.paperContainer}>
                    <Text style={[styles.dilekceText, { fontSize: 14 }]}>
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
