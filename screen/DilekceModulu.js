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
import RNPrint from 'react-native-print';

// Responsive boyutlandırma için
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Dilekçe şablonları veri yapısı
const dilekceKategorileri = [
    {
        id: 1,
        baslik: "Dava Dilekçeleri",
        ikon: "gavel",
        renk: "#2196F3",
        sablonlar: [
            {
                id: 11,
                baslik: "Boşanma Davası Dilekçesi",
                aciklama: "Anlaşmalı/çekişmeli boşanma davası için",
                sablon: `{{mahkeme_adi}}'ne

DAVA DİLEKÇESİ

Davacı    : {{davaci_ad_soyad}}
           {{davaci_adres}}
           T.C. Kimlik No: {{davaci_tc}}

Davalı    : {{davali_ad_soyad}}
           {{davali_adres}}
           T.C. Kimlik No: {{davali_tc}}

Vekili    : {{avukat_ad_soyad}}
           {{avukat_adres}}
           Baro Sicil No: {{baro_sicil}}

KONU     : BOŞANMA DAVASI

AÇIKLAMALAR:
Davacı ile davalı {{evlilik_tarihi}} tarihinde {{evlilik_yeri}}'nde evlenmişlerdir. 

{{cocuk_durumu}}

Taraflar arasında {{ayrilik_tarihi}} tarihinden itibaren fiili ayrılık başlamış olup, evlilik birliği temelinden sarsılmıştır.

HUKUKİ SEBEPLER:
Türk Medeni Kanunu'nun 166. maddesi gereğince...

TALEP:
Bu nedenlerle, tarafların boşanmalarına karar verilmesini talep ederim.

Tarih: {{tarih}}
                                          {{avukat_ad_soyad}}
                                            Avukat`
            },
            {
                id: 12,
                baslik: "Alacak Davası Dilekçesi",
                aciklama: "Sözleşmeli alacak davası için",
                sablon: `{{mahkeme_adi}}'ne

DAVA DİLEKÇESİ

Davacı    : {{davaci_ad_soyad}}
           {{davaci_adres}}
           T.C. Kimlik No: {{davaci_tc}}

Davalı    : {{davali_ad_soyad}}
           {{davali_adres}}
           T.C. Kimlik No: {{davali_tc}}

Vekili    : {{avukat_ad_soyad}}
           {{avukat_adres}}
           Baro Sicil No: {{baro_sicil}}

KONU     : ALACAK DAVASI

AÇIKLAMALAR:
Davacı ile davalı arasında {{sozlesme_tarihi}} tarihinde {{sozlesme_konusu}} konusunda sözleşme yapılmıştır.

Sözleşme gereği davalının {{odeme_tarihi}} tarihinde {{alacak_miktari}} TL ödeme yapması gerekirken, yapılmamıştır.

HUKUKİ SEBEPLER:
Türk Borçlar Kanunu'nun 117. maddesi gereğince...

TALEP:
Bu nedenlerle, davalının davacıya {{alacak_miktari}} TL asıl alacak ile birlikte yasal faiz ve vekalet ücretini ödemesine karar verilmesini talep ederim.

Tarih: {{tarih}}
                                          {{avukat_ad_soyad}}
                                            Avukat`
            }
        ]
    },
    {
        id: 2,
        baslik: "Şikayet Dilekçeleri",
        ikon: "warning",
        renk: "#FF5722",
        sablonlar: [
            {
                id: 21,
                baslik: "Savcılığa Şikayet Dilekçesi",
                aciklama: "Suç duyurusu için genel şablon",
                sablon: `{{cumhuriyet_savciligi}}'na

SUÇ DUYURUSU DİLEKÇESİ

Şikayetçi : {{sikayetci_ad_soyad}}
           {{sikayetci_adres}}
           T.C. Kimlik No: {{sikayetci_tc}}
           Telefon: {{sikayetci_telefon}}

Şüpheli   : {{supheli_ad_soyad}}
           {{supheli_adres}}
           T.C. Kimlik No: {{supheli_tc}}

KONU     : {{suc_turu}} SUÇUNDAN DOLAYI SUÇ DUYURUSU

AÇIKLAMALAR:
{{olay_tarihi}} tarihinde {{olay_yeri}}'nde meydana gelen olayda şüpheli {{olay_aciklamasi}}

Bu fiil Türk Ceza Kanunu'nun {{madde_no}}. maddesi kapsamında suç teşkil etmektedir.

TALEP:
Şüpheli hakkında soruşturma açılması ve gerekli yasal işlemin yapılmasını talep ederim.

Tarih: {{tarih}}
                                          {{sikayetci_ad_soyad}}
                                             İmza`
            }
        ]
    }
];

export default function DilekceModulu({ navigation }) {
    const [selectedKategori, setSelectedKategori] = useState(null);
    const [selectedSablon, setSelectedSablon] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [searchText, setSearchText] = useState('');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // HTML template oluşturma - Print için optimize edilmiş
    const createPrintHTML = (content, title) => {
        // Metni HTML formatına çevirme
        const htmlContent = content
            .replace(/\n/g, '<br>')
            .replace(/\s{4,}/g, (match) => '&nbsp;'.repeat(match.length))
            .replace(/{{([^}]+)}}/g, '<span style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px; font-weight: bold;">{{$1}}</span>');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                @page {
                    size: A4 portrait;
                    margin: 2cm;
                }
                
                * {
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Times New Roman', 'Times', serif;
                    font-size: 12pt;
                    line-height: 1.6;
                    color: #000;
                    margin: 0;
                    padding: 0;
                    background: white;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                .document-container {
                    max-width: 210mm;
                    margin: 0 auto;
                    padding: 20px;
                    min-height: 297mm;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                }
                
                .header h1 {
                    font-size: 16pt;
                    font-weight: bold;
                    margin: 0 0 10px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .header .subtitle {
                    font-size: 11pt;
                    color: #333;
                    margin: 0;
                    font-style: italic;
                }
                
                .content {
                    text-align: left;
                    line-height: 1.8;
                    white-space: pre-line;
                    font-size: 12pt;
                    margin-bottom: 50px;
                }
                
                .signature-area {
                    margin-top: 60px;
                    text-align: right;
                    page-break-inside: avoid;
                }
                
                .signature-line {
                    border-top: 1px solid #000;
                    width: 200px;
                    margin-left: auto;
                    padding-top: 10px;
                    text-align: center;
                    font-size: 10pt;
                }
                
                .footer {
                    position: fixed;
                    bottom: 1cm;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 8pt;
                    color: #666;
                    border-top: 1px solid #eee;
                    padding-top: 10px;
                }
                
                .watermark {
                    position: fixed;
                    bottom: 0.5cm;
                    right: 1cm;
                    font-size: 8pt;
                    color: #ccc;
                    opacity: 0.5;
                    z-index: -1;
                }
                
                .page-number {
                    position: fixed;
                    bottom: 1cm;
                    right: 2cm;
                    font-size: 10pt;
                    color: #666;
                }
                
                /* Responsive ve yazdırma için özel stiller */
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                    
                    .page-break {
                        page-break-before: always;
                    }
                }
                
                @media screen and (max-width: 768px) {
                    .document-container {
                        padding: 10px;
                    }
                    
                    .header h1 {
                        font-size: 14pt;
                    }
                    
                    .content {
                        font-size: 11pt;
                    }
                }
            </style>
        </head>
        <body>
            <div class="document-container">
                <div class="header">
                    <h1>${title}</h1>
                    <p class="subtitle">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</p>
                </div>
                
                <div class="content">
                    ${htmlContent}
                </div>
                
                <div class="signature-area">
                    <div class="signature-line">
                        İmza
                    </div>
                </div>
            </div>
            
            <div class="footer">
                Bu belge HukukApp ile dijital ortamda oluşturulmuştur.
            </div>
            
            <div class="watermark">
                HukukApp © ${new Date().getFullYear()}
            </div>
            
            <div class="page-number">
                Sayfa 1
            </div>
        </body>
        </html>
        `;
    };

    // PDF/Print oluşturma fonksiyonu
    const generatePDF = async () => {
        if (!editedContent.trim()) {
            Alert.alert('Uyarı', 'PDF oluşturmak için önce içerik girmelisiniz.');
            return;
        }

        setIsGeneratingPDF(true);

        try {
            // HTML içeriği oluştur
            const htmlContent = createPrintHTML(
                editedContent,
                selectedSablon?.baslik || 'Dilekçe'
            );

            // Print seçenekleri
            const options = {
                html: htmlContent,
                fileName: `${(selectedSablon?.baslik || 'Dilekce').replace(/\s+/g, '_')}_${Date.now()}`,
                base64: false,
                width: 595,  // A4 genişlik (pt)
                height: 842, // A4 yükseklik (pt)
                padding: {
                    top: 40,
                    bottom: 40,
                    left: 40,
                    right: 40
                }
            };

            // Print işlemi başlat
            await RNPrint.print(options);

            Alert.alert(
                'Başarılı',
                'Belge hazırlandı! Print/PDF menüsü açıldı.',
                [
                    { text: 'Tamam', style: 'default' },
                    {
                        text: 'Tekrar Oluştur',
                        onPress: () => generatePDF(),
                        style: 'default'
                    }
                ]
            );

        } catch (error) {
            console.error('PDF oluşturma hatası:', error);
            Alert.alert(
                'Hata',
                'PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
                [
                    { text: 'Tamam', style: 'default' },
                    { text: 'Tekrar Dene', onPress: () => generatePDF() }
                ]
            );
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    // Print önizleme
    const previewPrint = async () => {
        try {
            const htmlContent = createPrintHTML(
                editedContent,
                selectedSablon?.baslik || 'Dilekçe'
            );

            // Önizleme için basit print
            await RNPrint.print({
                html: htmlContent,
                fileName: 'preview'
            });
        } catch (error) {
            Alert.alert('Hata', 'Önizleme oluşturulamadı.');
        }
    };

    // Kategori seçme
    const kategoriSec = (kategori) => {
        setSelectedKategori(kategori);
        setSelectedSablon(null);
    };

    // Şablon seçme ve düzenleme moduna geçme
    const sablonSec = (sablon) => {
        setSelectedSablon(sablon);
        setEditedContent(sablon.sablon);
        setShowEditor(true);
    };

    // Şablonu doldurma modalı
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

    // Dilekçeyi paylaşma
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

    // Arama fonksiyonu
    const filterSablonlar = (sablonlar) => {
        if (!searchText) return sablonlar;
        return sablonlar.filter(sablon =>
            sablon.baslik.toLowerCase().includes(searchText.toLowerCase()) ||
            sablon.aciklama.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    // Kategori kartı render
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

    // Şablon kartı render
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

                    <TouchableOpacity style={styles.toolButton}>
                        <MaterialIcons name="save" size={20} color="#4CAF50" />
                        <Text style={styles.toolButtonText}>Kaydet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={previewPrint}
                        disabled={isGeneratingPDF}
                    >
                        <MaterialIcons name="preview" size={20} color="#FF9800" />
                        <Text style={styles.toolButtonText}>Önizle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toolButton, isGeneratingPDF && styles.toolButtonDisabled]}
                        onPress={generatePDF}
                        disabled={isGeneratingPDF}
                    >
                        <MaterialIcons
                            name={Platform.OS === 'ios' ? 'print' : 'picture-as-pdf'}
                            size={20}
                            color={isGeneratingPDF ? "#999" : "#F44336"}
                        />
                        <Text style={[
                            styles.toolButtonText,
                            isGeneratingPDF && styles.toolButtonTextDisabled
                        ]}>
                            {isGeneratingPDF ? 'Hazırlanıyor...' : (Platform.OS === 'ios' ? 'Yazdır' : 'PDF')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Text Editor */}
                <ScrollView style={styles.editorContainer}>
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
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
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
        paddingTop: screenHeight * 0.06, // Safe area için ekstra padding
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        minHeight: screenHeight * 0.1,
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
        paddingVertical: screenHeight * 0.015,
        borderRadius: screenWidth * 0.025,
        elevation: 2,
        minHeight: screenHeight * 0.06,
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
        paddingVertical: screenHeight * 0.02,
        paddingTop: screenHeight * 0.06,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        minHeight: screenHeight * 0.1,
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
    textEditor: {
        flex: 1,
        padding: screenWidth * 0.05,
        fontSize: screenWidth * 0.035,
        lineHeight: screenWidth * 0.05,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        minHeight: screenHeight * 0.5,
    },
});