import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    FlatList,
    Linking,
    Modal,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Responsive boyutlandırma için
const { width: screenWidth } = Dimensions.get('window');

export default function IletisimModulu({ route, navigation }) {
    const { dava } = route.params;

    const [searchText, setSearchText] = useState('');
    const [selectedTab, setSelectedTab] = useState('kisiler');
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    // Tab değiştiğinde search'i temizle
    const handleTabChange = (tabName) => {
        setSelectedTab(tabName);
        setSearchText(''); // Search'i temizle
    };

    // Dava bazlı kişiler listesi - dinamik olarak oluşturulur
    const createKisilerListesi = () => {
        const kisiler = [];

        // Müvekkil
        kisiler.push({
            id: 1,
            ad: dava.muvekkil.ad,
            soyad: dava.muvekkil.soyad,
            rol: 'Müvekkil',
            telefon: dava.muvekkil.telefon,
            email: dava.muvekkil.email,
            adres: dava.muvekkil.adres,
            whatsapp: dava.muvekkil.whatsapp,
            avatar: '👤',
            renk: '#4CAF50'
        });

        // Karşı Taraf
        if (dava.karsiTaraf) {
            kisiler.push({
                id: 2,
                ad: dava.karsiTaraf.ad,
                soyad: dava.karsiTaraf.soyad,
                rol: 'Karşı Taraf',
                telefon: dava.karsiTaraf.telefon,
                email: dava.karsiTaraf.email,
                adres: dava.karsiTaraf.adres,
                whatsapp: dava.karsiTaraf.whatsapp,
                avatar: '⚖️',
                renk: '#F44336'
            });
        }

        // Tanıklar
        if (dava.taniklar && dava.taniklar.length > 0) {
            dava.taniklar.forEach((tanik, index) => {
                kisiler.push({
                    id: 3 + index,
                    ad: tanik.ad,
                    soyad: tanik.soyad,
                    rol: 'Tanık',
                    telefon: tanik.telefon,
                    email: tanik.email,
                    adres: tanik.adres,
                    whatsapp: tanik.whatsapp,
                    avatar: '👨‍⚕️',
                    renk: '#2196F3'
                });
            });
        }

        return kisiler;
    };

    const [kisilerListesi] = useState(createKisilerListesi());

    // Görüşme ve randevu geçmişi - dava bazlı
    const createIletisimGecmisi = () => {
        const gecmis = [];
        const kisiler = createKisilerListesi();

        // Müvekkil ile son görüşme
        if (kisiler.length > 0) {
            gecmis.push({
                id: 1,
                kisiId: 1,
                tip: 'telefon',
                tarih: '2025-01-20',
                saat: '14:30',
                sure: '15 dakika',
                konu: `${dava.davaTuru} davası için duruşma hazırlığı`,
                notlar: 'Müvekkil duruşma için hazır olduğunu belirtti. Gerekli belgeler tamamlandı.'
            });
        }

        // Karşı taraf ile e-posta
        if (kisiler.length > 1) {
            gecmis.push({
                id: 2,
                kisiId: 2,
                tip: 'email',
                tarih: '2025-01-18',
                saat: '09:15',
                konu: 'Uzlaşma teklifi gönderildi',
                notlar: `${dava.davaNo} numaralı dava için uzlaşma teklifimiz iletildi.`
            });
        }

        // WhatsApp hatırlatması
        if (kisiler.length > 0) {
            gecmis.push({
                id: 3,
                kisiId: 1,
                tip: 'whatsapp',
                tarih: '2025-01-15',
                saat: '16:45',
                konu: 'Duruşma tarih hatırlatması',
                notlar: `${dava.durusmaFormatli} tarihindeki duruşma hatırlatıldı.`
            });
        }

        return gecmis;
    };

    const [iletisimGecmisi] = useState(createIletisimGecmisi());

    // Mesaj şablonları - dava türüne göre özelleştirilmiş
    const createMesajSablonlari = () => {
        const genel = [
            {
                id: 1,
                baslik: 'Duruşma Hatırlatması',
                kategori: 'randevu',
                sablon: `Sayın {{ad}} {{soyad}}, ${dava.durusmaFormatli} tarihinde ${dava.mahkeme.ad} mahkemesinde ${dava.davaTuru} davamızın duruşması bulunmaktadır. Lütfen zamanında teşrif ediniz.`
            },
            {
                id: 2,
                baslik: 'Belge Talebi',
                kategori: 'belge',
                sablon: `Sayın {{ad}} {{soyad}}, ${dava.davaNo} numaralı ${dava.davaTuru} davamız kapsamında {{belge_adi}} belgesine ihtiyacımız bulunmaktadır. En kısa sürede temin edebilir misiniz?`
            },
            {
                id: 3,
                baslik: 'Görüşme Randevusu',
                kategori: 'randevu',
                sablon: `Sayın {{ad}} {{soyad}}, ${dava.davaTuru} davamız hakkında görüşmek üzere {{tarih}} tarihinde saat {{saat}}'te büromuzda randevunuz bulunmaktadır.`
            },
            {
                id: 4,
                baslik: 'Süreç Bilgilendirme',
                kategori: 'bilgi',
                sablon: `Sayın {{ad}} {{soyad}}, ${dava.davaNo} numaralı davamızla ilgili son gelişmeleri sizinle paylaşmak istiyoruz. {{bilgi}} konusunda bilginiz olsun.`
            }
        ];

        // Dava türüne özel şablonlar
        const ozelSablonlar = [];

        switch (dava.davaTuru) {
            case 'İcra':
                ozelSablonlar.push({
                    id: 5,
                    baslik: 'İtiraz Süresi Hatırlatması',
                    kategori: 'acil',
                    sablon: `Sayın {{ad}} {{soyad}}, ${dava.davaNo} numaralı icra dosyanız için itiraz sürenizin ${dava.itirazSuresi.sonTarih} tarihinde dolacağını hatırlatırız.`
                });
                break;

            case 'Boşanma':
                ozelSablonlar.push({
                    id: 5,
                    baslik: 'Anlaşma Şartları',
                    kategori: 'uzlasma',
                    sablon: `Sayın {{ad}} {{soyad}}, boşanma davamızda anlaşma şartlarını görüşmek üzere acil görüşme talep ediyoruz.`
                });
                break;

            case 'İş Davası':
                ozelSablonlar.push({
                    id: 5,
                    baslik: 'İş Belgesi Talebi',
                    kategori: 'belge',
                    sablon: `Sayın {{ad}} {{soyad}}, iş davamız için bordro, maaş belgeleri ve çalışma belgelerinizi acilen göndermenizi rica ederiz.`
                });
                break;

            default:
                ozelSablonlar.push({
                    id: 5,
                    baslik: 'Uzlaşma Teklifi',
                    kategori: 'uzlasma',
                    sablon: `Sayın {{ad}} {{soyad}}, ${dava.davaTuru} davamız için hazırlanan uzlaşma teklifini değerlendirmenizi rica ederiz.`
                });
        }

        return [...genel, ...ozelSablonlar];
    };

    const [mesajSablonlari] = useState(createMesajSablonlari());

    // Arama fonksiyonu - tab'a göre farklı filtreleme
    const filtrelenmisKisiler = kisilerListesi.filter(kisi => {
        const adSoyad = `${kisi.ad || ''} ${kisi.soyad || ''}`.toLowerCase();
        const rol = (kisi.rol || '').toLowerCase();
        const searchLower = (searchText || '').toLowerCase();

        return adSoyad.includes(searchLower) || rol.includes(searchLower);
    });

    const filtrelenmisSablonlar = mesajSablonlari.filter(sablon => {
        const baslik = (sablon.baslik || '').toLowerCase();
        const kategori = (sablon.kategori || '').toLowerCase();
        const searchLower = (searchText || '').toLowerCase();

        return baslik.includes(searchLower) || kategori.includes(searchLower);
    });

    const filtrelenmisGecmis = iletisimGecmisi.filter(kayit => {
        const searchLower = (searchText || '').toLowerCase();

        // Kişi bilgilerini bul
        const kisi = kisilerListesi.find(k => k.id === kayit.kisiId);
        const kisiAd = kisi ? `${kisi.ad || ''} ${kisi.soyad || ''}`.toLowerCase() : '';
        const kisiRol = kisi ? (kisi.rol || '').toLowerCase() : '';

        // Kayıt bilgileri
        const tip = (kayit.tip || '').toLowerCase();
        const konu = (kayit.konu || '').toLowerCase();
        const notlar = (kayit.notlar || '').toLowerCase();
        const tarih = (kayit.tarih || '').toLowerCase();

        return kisiAd.includes(searchLower) ||
            kisiRol.includes(searchLower) ||
            tip.includes(searchLower) ||
            konu.includes(searchLower) ||
            notlar.includes(searchLower) ||
            tarih.includes(searchLower);
    });    // İletişim işlemleri
    const telefonAra = (telefon, kisi) => {
        if (!telefon) {
            Alert.alert('Uyarı', 'Bu kişi için telefon numarası bulunamadı.');
            return;
        }
        Alert.alert(
            'Telefon Araması',
            `${kisi.ad} ${kisi.soyad} (${telefon}) aranacak?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Ara',
                    onPress: () => {
                        Linking.openURL(`tel:${telefon}`);
                        // Görüşme geçmişine kaydet
                        kaydEkle(kisi.id, 'telefon', `Telefon araması yapıldı: ${telefon}`);
                    }
                }
            ]
        );
    };

    const smsGonder = (telefon, kisi) => {
        if (!telefon) {
            Alert.alert('Uyarı', 'Bu kişi için telefon numarası bulunamadı.');
            return;
        }
        setSelectedPerson(kisi);
        setShowMessageModal(true);
    };

    const whatsappGonder = (whatsapp, kisi) => {
        if (!whatsapp) {
            Alert.alert('Uyarı', 'Bu kişi için WhatsApp numarası bulunamadı.');
            return;
        }
        const url = `whatsapp://send?phone=${whatsapp.replace(/\s/g, '')}`;
        Linking.openURL(url).catch(() => {
            Alert.alert('Hata', 'WhatsApp uygulaması bulunamadı.');
        });
        kaydEkle(kisi.id, 'whatsapp', `WhatsApp mesajı gönderildi: ${whatsapp}`);
    };

    const emailGonder = (email, kisi) => {
        if (!email) {
            Alert.alert('Uyarı', 'Bu kişi için e-posta adresi bulunamadı.');
            return;
        }

        const subject = encodeURIComponent(`Dava: ${dava.davaNo} - ${dava.davaTuru}`);
        const body = encodeURIComponent(`Sayın ${kisi.ad} ${kisi.soyad},\n\n${dava.davaNo} numaralı ${dava.davaTuru} davamız hakkında...\n\nSaygılarımla,\nAvukat`);

        // Gmail uygulamasını açmayı dene
        const gmailUrl = `googlegmail://co?to=${email}&subject=${subject}&body=${body}`;

        Linking.canOpenURL(gmailUrl)
            .then(supported => {
                if (supported) {
                    // Gmail uygulaması varsa Gmail'i aç
                    return Linking.openURL(gmailUrl);
                } else {
                    // Gmail uygulaması yoksa varsayılan e-posta uygulamasını aç
                    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
                    return Linking.openURL(mailtoUrl);
                }
            })
            .then(() => {
                kaydEkle(kisi.id, 'email', `E-posta gönderildi: ${email}`);
            })
            .catch(error => {
                console.log('E-posta gönderim hatası:', error);
                Alert.alert('Hata', 'E-posta uygulaması açılamadı.');
            });
    };

    // Kayıt ekleme
    const kaydEkle = (kisiId, tip, konu) => {
        const yeniKayit = {
            id: Date.now(),
            kisiId: kisiId,
            tip: tip,
            tarih: new Date().toISOString().split('T')[0],
            saat: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            konu: konu,
            notlar: ''
        };
        // Burada normalde state güncellenecek
        console.log('Yeni iletişim kaydı:', yeniKayit);
    };

    // Şablon kullanarak mesaj oluştur
    const sablonKullan = (sablon) => {
        let mesaj = sablon.sablon;
        if (selectedPerson) {
            mesaj = mesaj.replace(/{{ad}}/g, selectedPerson.ad);
            mesaj = mesaj.replace(/{{soyad}}/g, selectedPerson.soyad);
        }
        setMessageText(mesaj);
        setShowTemplateModal(false);
    };

    // Mesaj gönder
    const mesajGonder = () => {
        if (!messageText.trim()) {
            Alert.alert('Uyarı', 'Lütfen mesaj metnini girin.');
            return;
        }

        const url = `sms:${selectedPerson.telefon}?body=${encodeURIComponent(messageText)}`;
        Linking.openURL(url);

        kaydEkle(selectedPerson.id, 'sms', messageText.substring(0, 50) + '...');
        setShowMessageModal(false);
        setMessageText('');
        setSelectedPerson(null);
    };

    // Kişi kartı render
    const renderKisiKarti = ({ item }) => (
        <View style={styles.kisiKarti}>
            <View style={styles.kisiHeader}>
                <View style={[styles.avatar, { backgroundColor: item.renk }]}>
                    <Text style={styles.avatarText}>{item.avatar}</Text>
                </View>
                <View style={styles.kisiInfo}>
                    <Text style={styles.kisiAd}>{item.ad} {item.soyad}</Text>
                    <Text style={styles.kisiRol}>{item.rol}</Text>
                    <Text style={styles.kisiIletisim}>{item.telefon}</Text>
                    {item.email && (
                        <Text style={styles.kisiEmail}>{item.email}</Text>
                    )}
                </View>
            </View>

            <View style={styles.iletisimButonlari}>
                <TouchableOpacity
                    style={[
                        styles.iletisimButton,
                        {
                            backgroundColor: item.telefon ? '#4CAF50' : '#ccc'
                        }
                    ]}
                    onPress={() => item.telefon ? telefonAra(item.telefon, item) : null}
                    disabled={!item.telefon}
                >
                    <Ionicons name="call" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Ara</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.iletisimButton,
                        {
                            backgroundColor: item.telefon ? '#2196F3' : '#ccc'
                        }
                    ]}
                    onPress={() => item.telefon ? smsGonder(item.telefon, item) : null}
                    disabled={!item.telefon}
                >
                    <Ionicons name="chatbubble" size={20} color="#fff" />
                    <Text style={styles.buttonText}>SMS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.iletisimButton,
                        {
                            backgroundColor: item.whatsapp ? '#25D366' : '#ccc'
                        }
                    ]}
                    onPress={() => item.whatsapp ? whatsappGonder(item.whatsapp, item) : null}
                    disabled={!item.whatsapp}
                >
                    <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.iletisimButton,
                        {
                            backgroundColor: item.email ? '#FF9800' : '#ccc'
                        }
                    ]}
                    onPress={() => item.email ? emailGonder(item.email, item) : null}
                    disabled={!item.email}
                >
                    <Ionicons name="mail" size={20} color="#fff" />
                    <Text style={styles.buttonText}>E-posta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Geçmiş kayıt render
    const renderGecmisKayit = ({ item }) => {
        const kisi = kisilerListesi.find(k => k.id === item.kisiId);
        const tipIcon = {
            telefon: 'call',
            sms: 'chatbubble',
            whatsapp: 'logo-whatsapp',
            email: 'mail'
        };

        return (
            <View style={styles.gecmisKayit}>
                <View style={styles.gecmisHeader}>
                    <Ionicons name={tipIcon[item.tip]} size={20} color="#666" />
                    <Text style={styles.gecmisKisi}>{kisi?.ad} {kisi?.soyad}</Text>
                    <Text style={styles.gecmisTarih}>{item.tarih} {item.saat}</Text>
                </View>
                <Text style={styles.gecmisKonu}>{item.konu}</Text>
                {item.notlar && <Text style={styles.gecmisNot}>{item.notlar}</Text>}
            </View>
        );
    };

    // Şablon render
    const renderSablon = ({ item }) => (
        <TouchableOpacity
            style={styles.sablonKarti}
            onPress={() => sablonKullan(item)}
        >
            <View style={styles.sablonHeader}>
                <Text style={styles.sablonBaslik}>{item.baslik}</Text>
                <View style={[styles.sablonKategori, { backgroundColor: getSablonRenk(item.kategori) }]}>
                    <Text style={styles.sablonKategoriText}>{item.kategori}</Text>
                </View>
            </View>
            <Text style={styles.sablonOnizleme} numberOfLines={2}>
                {item.sablon.substring(0, 100)}...
            </Text>
        </TouchableOpacity>
    );

    const getSablonRenk = (kategori) => {
        const renkler = {
            randevu: '#2196F3',
            belge: '#FF9800',
            bilgi: '#4CAF50',
            uzlasma: '#9C27B0',
            acil: '#F44336'
        };
        return renkler[kategori] || '#666';
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>İletişim</Text>
                <Text style={styles.davaNo}>Dava: {dava.davaNo}</Text>
            </View>

            {/* Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'kisiler' && styles.activeTab]}
                    onPress={() => handleTabChange('kisiler')}
                >
                    <Ionicons name="people" size={20} color={selectedTab === 'kisiler' ? '#2196F3' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'kisiler' && styles.activeTabText]}>
                        Kişiler
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'gecmis' && styles.activeTab]}
                    onPress={() => handleTabChange('gecmis')}
                >
                    <Ionicons name="time" size={20} color={selectedTab === 'gecmis' ? '#2196F3' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'gecmis' && styles.activeTabText]}>
                        Geçmiş
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'sablonlar' && styles.activeTab]}
                    onPress={() => handleTabChange('sablonlar')}
                >
                    <Ionicons name="document-text" size={20} color={selectedTab === 'sablonlar' ? '#2196F3' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'sablonlar' && styles.activeTabText]}>
                        Şablonlar
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Arama Çubuğu */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                    style={styles.searchInput}
                    placeholder={
                        selectedTab === 'kisiler' ? 'Kişi veya rol ara...' :
                            selectedTab === 'gecmis' ? 'Geçmiş kayıtlarda ara...' :
                                selectedTab === 'sablonlar' ? 'Şablon ara...' : 'Ara...'
                    }
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <Ionicons name="close-circle" size={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            {/* İçerik */}
            <ScrollView style={styles.content}>
                {selectedTab === 'kisiler' && (
                    <FlatList
                        data={filtrelenmisKisiler}
                        renderItem={renderKisiKarti}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                )}

                {selectedTab === 'gecmis' && (
                    <FlatList
                        data={filtrelenmisGecmis.sort((a, b) => new Date(b.tarih) - new Date(a.tarih))}
                        renderItem={renderGecmisKayit}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                )}

                {selectedTab === 'sablonlar' && (
                    <FlatList
                        data={filtrelenmisSablonlar}
                        renderItem={renderSablon}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                )}
            </ScrollView>

            {/* Mesaj Gönderme Modal */}
            <Modal
                visible={showMessageModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowMessageModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedPerson ? `${selectedPerson.ad} ${selectedPerson.soyad}` : ''} - SMS
                            </Text>
                            <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.templateButton}
                            onPress={() => setShowTemplateModal(true)}
                        >
                            <Ionicons name="document-text" size={20} color="#2196F3" />
                            <Text style={styles.templateButtonText}>Şablon Seç</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.messageInput}
                            multiline
                            numberOfLines={6}
                            placeholder="Mesajınızı yazın..."
                            value={messageText}
                            onChangeText={setMessageText}
                            textAlignVertical="top"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowMessageModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>İptal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={mesajGonder}
                            >
                                <Text style={styles.sendButtonText}>Gönder</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Şablon Seçme Modal */}
            <Modal
                visible={showTemplateModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTemplateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Mesaj Şablonu Seç</Text>
                            <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={mesajSablonlari}
                            renderItem={renderSablon}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
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
    backButton: {
        padding: screenWidth * 0.015,
    },
    headerTitle: {
        fontSize: screenWidth * 0.045,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    davaNo: {
        fontSize: screenWidth * 0.035,
        color: '#666',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#2196F3',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    activeTabText: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    kisiKarti: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    kisiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 20,
        color: '#fff',
    },
    kisiInfo: {
        flex: 1,
    },
    kisiAd: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    kisiRol: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    kisiIletisim: {
        fontSize: 14,
        color: '#2196F3',
        marginTop: 2,
    },
    kisiEmail: {
        fontSize: 13,
        color: '#FF9800',
        marginTop: 2,
        fontStyle: 'italic',
    },
    iletisimButonlari: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iletisimButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    gecmisKayit: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        elevation: 1,
    },
    gecmisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    gecmisKisi: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
        flex: 1,
    },
    gecmisTarih: {
        fontSize: 12,
        color: '#666',
    },
    gecmisKonu: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    gecmisNot: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    sablonKarti: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        elevation: 1,
    },
    sablonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sablonBaslik: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    sablonKategori: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    sablonKategoriText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    sablonOnizleme: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: screenWidth * 0.9,
        maxHeight: screenWidth * 1.2,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    templateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f8ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    templateButtonText: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    messageInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        minHeight: 120,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginRight: 10,
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    sendButton: {
        flex: 1,
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        marginLeft: 10,
    },
    sendButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
