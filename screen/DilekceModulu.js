import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    Alert,
    Share,
    Platform,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { dilekceKategorileri } from '../data/DilekceData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function DilekceModulu({ navigation }) {
    const [selectedKategori, setSelectedKategori] = useState(null);
    const [selectedSablon, setSelectedSablon] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [searchText, setSearchText] = useState('');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const generatePDF = async () => {
        if (!editedContent.trim()) {
            Alert.alert('Uyarı', 'PDF oluşturmak için önce içerik girmelisiniz.');
            return;
        }

        setIsGeneratingPDF(true);

        try {
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @page {
                        size: A4;
                        margin: 40px;
                    }
                    
                    body {
                        font-family: 'Times New Roman', serif;
                        font-size: 14px;
                        line-height: 1.6;
                        margin: 0;
                        padding: 20px;
                        color: #000;
                        background: white;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        border-bottom: 2px solid #000;
                        padding-bottom: 20px;
                    }
                    
                    .header h1 {
                        font-size: 18px;
                        font-weight: bold;
                        margin: 0;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .date {
                        font-size: 12px;
                        color: #666;
                        margin-top: 10px;
                        font-style: italic;
                    }
                    
                    .content {
                        text-align: justify;
                        line-height: 1.8;
                        margin-bottom: 60px;
                        white-space: pre-line;
                        font-size: 14px;
                    }
                    
                    .signature {
                        margin-top: 80px;
                        text-align: right;
                        page-break-inside: avoid;
                    }
                    
                    .signature-line {
                        border-top: 1px solid #000;
                        width: 200px;
                        margin-left: auto;
                        padding-top: 10px;
                        text-align: center;
                        font-size: 12px;
                    }
                    
                    .footer {
                        position: fixed;
                        bottom: 30px;
                        left: 0;
                        right: 0;
                        text-align: center;
                        font-size: 10px;
                        color: #888;
                        border-top: 1px solid #eee;
                        padding-top: 10px;
                    }
                    
                    .highlight {
                        background-color: #ffeb3b;
                        padding: 2px 4px;
                        border-radius: 3px;
                        font-weight: bold;
                    }
                    
                    .page-info {
                        position: fixed;
                        bottom: 15px;
                        right: 40px;
                        font-size: 10px;
                        color: #666;
                    }
                    
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${selectedSablon?.baslik || 'DİLEKÇE'}</h1>
                    <div class="date">
                        Tarih: ${new Date().toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
                    </div>
                </div>
                
                <div class="content">
                    ${editedContent
                    .replace(/\n/g, '<br>')
                    .replace(/{{([^}]+)}}/g, '<span class="highlight">{{$1}}</span>')
                }
                </div>
                
                <div class="signature">
                    <div class="signature-line">
                        İmza
                    </div>
                </div>
                
                <div class="footer">
                    Bu belge HukukApp ile oluşturulmuştur - ${new Date().getFullYear()}
                </div>
                
                <div class="page-info">
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
                                dialogTitle: selectedSablon?.baslik || 'Dilekçe',
                                mimeType: 'application/pdf'
                            })
                        },
                        {
                            text: 'Yazdır',
                            onPress: () => Print.printAsync({ uri })
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'PDF Oluşturuldu!',
                    'Dosya başarıyla hazırlandı.',
                    [
                        { text: 'Tamam' },
                        {
                            text: 'Yazdır',
                            onPress: () => Print.printAsync({ uri })
                        }
                    ]
                );
            }

        } catch (error) {
            console.error('PDF oluşturma hatası:', error);
            Alert.alert(
                'Hata',
                `PDF oluşturulamadı: ${error.message}`,
                [
                    { text: 'Tamam' },
                    { text: 'Tekrar Dene', onPress: generatePDF }
                ]
            );
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const kategoriSec = (kategori) => {
        setSelectedKategori(kategori);
        setSelectedSablon(null);
    };

    const sablonSec = (sablon) => {
        setSelectedSablon(sablon);
        setEditedContent(sablon.sablon);
        setShowEditor(true);
    };

    const sablonuDoldur = () => {
        Alert.alert(
            'Şablon Doldurma',
            'Şablondaki {{}} işaretli alanları doldurmak için form sayfası açılsın mı?',
            [
                { text: 'İptal', style: 'cancel' },
                { text: 'Evet', onPress: () => navigation.navigate('SablonForm', { sablon: selectedSablon }) }
            ]
        );
    };

    const dilekcePaylas = async () => {
        try {
            await Share.share({
                message: editedContent,
                title: selectedSablon?.baslik || 'Dilekçe'
            });
        } catch (error) {
            Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu.');
        }
    };

    const filterSablonlar = (sablonlar) => {
        if (!searchText) return sablonlar;
        return sablonlar.filter(sablon =>
            sablon.baslik.toLowerCase().includes(searchText.toLowerCase()) ||
            sablon.aciklama.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const renderKategori = ({ item }) => (
        <TouchableOpacity
            style={[styles.kategoriKart, { borderLeftColor: item.renk }]}
            onPress={() => kategoriSec(item)}
            activeOpacity={0.7}
        >
            <View style={styles.kategoriHeader}>
                <MaterialIcons name={item.ikon} size={32} color={item.renk} />
                <View style={styles.kategoriInfo}>
                    <Text style={styles.kategoriBaslik}>{item.baslik}</Text>
                    <Text style={styles.kategoriSayi}>{item.sablonlar.length} şablon</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#999" />
            </View>
        </TouchableOpacity>
    );

    const renderSablon = ({ item }) => (
        <TouchableOpacity
            style={styles.sablonKart}
            onPress={() => sablonSec(item)}
            activeOpacity={0.7}
        >
            <View style={styles.sablonHeader}>
                <MaterialIcons name="description" size={24} color="#2196F3" />
                <View style={styles.sablonInfo}>
                    <Text style={styles.sablonBaslik}>{item.baslik}</Text>
                    <Text style={styles.sablonAciklama}>{item.aciklama}</Text>
                </View>
                <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => sablonSec(item)}
                >
                    <Ionicons name="eye-outline" size={20} color="#666" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (showEditor) {
        return (
            <View style={styles.container}>
                {/* Editor Header */}
                <View style={styles.editorHeader}>
                    <TouchableOpacity onPress={() => setShowEditor(false)}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.editorTitle}>{selectedSablon?.baslik}</Text>
                    <TouchableOpacity onPress={dilekcePaylas}>
                        <Ionicons name="share-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Toolbar */}
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolButton} onPress={sablonuDoldur}>
                        <MaterialIcons name="edit" size={20} color="#2196F3" />
                        <Text style={styles.toolButtonText}>Doldur</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toolButton, isGeneratingPDF && styles.toolButtonDisabled]}
                        onPress={generatePDF}
                        disabled={isGeneratingPDF}
                    >
                        <MaterialIcons
                            name="picture-as-pdf"
                            size={20}
                            color={isGeneratingPDF ? "#999" : "#F44336"}
                        />
                        <Text style={[
                            styles.toolButtonText,
                            isGeneratingPDF && styles.toolButtonTextDisabled
                        ]}>
                            {isGeneratingPDF ? 'PDF Hazırlanıyor...' : 'PDF Oluştur'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Text Editor */}
                <ScrollView
                    style={styles.editorContainer}
                    contentContainerStyle={styles.editorContent}
                    showsVerticalScrollIndicator={false}
                >
                    <TextInput
                        style={styles.textEditor}
                        multiline
                        value={editedContent}
                        onChangeText={setEditedContent}
                        placeholder="Dilekçe içeriği..."
                        textAlignVertical="top"
                        editable={!isGeneratingPDF}
                    />
                </ScrollView>
            </View>
        );
    }

    if (selectedKategori) {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSelectedKategori(null)}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{selectedKategori.baslik}</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Arama */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Şablon ara..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* Şablon Listesi */}
                <FlatList
                    data={filterSablonlar(selectedKategori.sablonlar)}
                    renderItem={renderSablon}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.sablonList}
                    contentContainerStyle={styles.sablonListContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ width: 24 }} />
                <Text style={styles.headerTitle}>Dilekçe Şablonları</Text>
                <TouchableOpacity>
                    <Ionicons name="add-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* İstatistikler */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                        {dilekceKategorileri.reduce((total, kat) => total + kat.sablonlar.length, 0)}
                    </Text>
                    <Text style={styles.statLabel}>Toplam Şablon</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{dilekceKategorileri.length}</Text>
                    <Text style={styles.statLabel}>Kategori</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Özel Şablon</Text>
                </View>
            </View>

            {/* Kategori Listesi */}
            <FlatList
                data={dilekceKategorileri}
                renderItem={renderKategori}
                keyExtractor={(item) => item.id.toString()}
                style={styles.kategoriList}
                contentContainerStyle={styles.kategoriListContent}
                showsVerticalScrollIndicator={false}
            />
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
        paddingVertical: screenHeight * 0.02,
        marginBottom: screenHeight * 0.02,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: screenWidth * 0.045,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenHeight * 0.02,
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: screenWidth * 0.03,
        padding: screenWidth * 0.04,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: screenWidth * 0.01,
        elevation: 2,
        minHeight: screenHeight * 0.1,
        justifyContent: 'center',
    },
    statNumber: {
        fontSize: screenWidth * 0.06,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    statLabel: {
        fontSize: screenWidth * 0.03,
        color: '#666',
        marginTop: screenHeight * 0.005,
        textAlign: 'center',
    },
    kategoriList: {
        flex: 1,
        paddingHorizontal: screenWidth * 0.05,
    },
    kategoriListContent: {
        paddingBottom: Platform.OS === 'android' ? 80 : 70,
    },
    kategoriKart: {
        backgroundColor: '#fff',
        borderRadius: screenWidth * 0.03,
        padding: screenWidth * 0.04,
        marginBottom: screenHeight * 0.015,
        elevation: 2,
        borderLeftWidth: 4,
        minHeight: screenHeight * 0.08,
    },
    kategoriHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    kategoriInfo: {
        flex: 1,
        marginLeft: screenWidth * 0.04,
    },
    kategoriBaslik: {
        fontSize: screenWidth * 0.04,
        fontWeight: 'bold',
        color: '#333',
    },
    kategoriSayi: {
        fontSize: screenWidth * 0.03,
        color: '#666',
        marginTop: screenHeight * 0.003,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: screenWidth * 0.05,
        marginBottom: screenHeight * 0.025,
        paddingHorizontal: screenWidth * 0.04,
        paddingVertical: screenHeight * 0.006,
        borderRadius: screenWidth * 0.025,
        elevation: 2,
        minHeight: screenHeight * 0.04,
    },
    searchInput: {
        flex: 1,
        marginLeft: screenWidth * 0.025,
        fontSize: screenWidth * 0.04,
    },
    sablonList: {
        flex: 1,
        paddingHorizontal: screenWidth * 0.05,
    },
    sablonListContent: {
        paddingBottom: Platform.OS === 'android' ? 80 : 70,
    },
    sablonKart: {
        backgroundColor: '#fff',
        borderRadius: screenWidth * 0.03,
        padding: screenWidth * 0.04,
        marginBottom: screenHeight * 0.012,
        elevation: 1,
        minHeight: screenHeight * 0.07,
    },
    sablonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sablonInfo: {
        flex: 1,
        marginLeft: screenWidth * 0.04,
    },
    sablonBaslik: {
        fontSize: screenWidth * 0.035,
        fontWeight: 'bold',
        color: '#333',
    },
    sablonAciklama: {
        fontSize: screenWidth * 0.03,
        color: '#666',
        marginTop: screenHeight * 0.003,
    },
    previewButton: {
        padding: screenWidth * 0.012,
    },
    editorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenHeight * 0.01,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        minHeight: screenHeight * 0.08,
    },
    editorTitle: {
        fontSize: screenWidth * 0.04,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: screenWidth * 0.02,
    },
    toolbar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: "space-evenly",
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenHeight * 0.012,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexWrap: 'wrap',
    },
    toolButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: screenWidth * 0.03,
        paddingVertical: screenHeight * 0.01,
        borderRadius: screenWidth * 0.02,
        backgroundColor: '#f0f0f0',
        marginRight: screenWidth * 0.02,
        marginBottom: screenHeight * 0.01,
        minHeight: screenHeight * 0.045,
    },
    toolButtonDisabled: {
        backgroundColor: '#e0e0e0',
        opacity: 0.6,
    },
    toolButtonText: {
        fontSize: screenWidth * 0.03,
        color: '#333',
        marginLeft: screenWidth * 0.012,
        fontWeight: '500',
    },
    toolButtonTextDisabled: {
        color: '#999',
    },
    editorContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    editorContent: {
        paddingBottom: Platform.OS === 'android' ? 80 : 70,
    },
    textEditor: {
        flex: 1,
        padding: screenWidth * 0.05,
        fontSize: screenWidth * 0.035,
        lineHeight: screenWidth * 0.05,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        minHeight: screenHeight * 0.5,
    },
});