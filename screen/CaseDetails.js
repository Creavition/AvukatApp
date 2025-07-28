import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    ActivityIndicator,
    Dimensions,
    TextInput,
    Platform,
    Image
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDurumHexRengi } from '../data/DavaData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CaseDetails({ route, navigation }) {
    const { dava } = route.params;

    const [activeTab, setActiveTab] = useState('genel');

    const [notlar, setNotlar] = useState([]);
    const [yeniNot, setYeniNot] = useState('');
    const [notEkleniyor, setNotEkleniyor] = useState(false);

    const [fileViewModal, setFileViewModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (activeTab === 'iletisim') {
            navigation.navigate('IletisimModulu', { dava });
            setActiveTab('genel');
        }
    }, [activeTab, navigation, dava]);

    const [yuklenmisDosyalar, setYuklenmisDosyalar] = useState([
        {
            id: 1,
            name: 'dava_dilekçesi.pdf',
            size: '2.3 MB',
            type: 'pdf',
            date: '15.01.2025',
            uri: null
        },
        {
            id: 2,
            name: 'tanık_beyani.doc',
            size: '1.1 MB',
            type: 'doc',
            date: '20.03.2025',
            uri: null
        }
    ]);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);


    const [durusmaSafhalari] = useState([
        {
            time: '15.01.2025',
            title: 'Dava Dilekçesi Verildi',
            description: 'İlk dilekçe mahkemeye sunuldu',
            status: 'completed',
            icon: 'document-text'
        },
        {
            time: '25.01.2025',
            title: 'Davalıya Tebligat',
            description: 'Dava dilekçesi karşı tarafa tebliğ edildi',
            status: 'completed',
            icon: 'mail'
        },
        {
            time: '15.02.2025',
            title: 'Cevap Dilekçesi Süresi',
            description: '30 günlük cevap süresi başladı',
            status: 'pending',
            icon: 'time'
        },
        {
            time: '15.03.2025',
            title: 'İlk Duruşma',
            description: 'Mahkeme Salonu A-102, Saat: 09:30',
            status: 'upcoming',
            icon: 'business'
        },
        {
            time: '20.03.2025',
            title: 'Delil Toplama',
            description: 'Ek belge ve tanık beyanları',
            status: 'upcoming',
            icon: 'folder'
        },
        {
            time: '10.04.2025',
            title: 'Son Duruşma',
            description: 'Nihai karar aşaması',
            status: 'upcoming',
            icon: 'gavel'
        }
    ]);

    const [durusmaBilgileri] = useState({
        tarih: '29.07.2025',
        saat: '09:30',
        salon: 'A-102',
        hakim: 'Hâkim Mehmet Yılmaz',
        tur: 'İlk Duruşma',
        tahminiSure: '45 dakika',
        kalanGun: 4
    });

    useEffect(() => {
        loadNotlar();
    }, []);

    const loadNotlar = async () => {
        try {
            const savedNotes = await AsyncStorage.getItem(`notes_${dava.id}`);
            if (savedNotes) {
                setNotlar(JSON.parse(savedNotes));
            }
        } catch (error) {
            console.error('Notlar yüklenirken hata:', error);
        }
    };

    const notEkle = async () => {
        if (!yeniNot.trim()) {
            Alert.alert('Uyarı', 'Lütfen not içeriği girin.');
            return;
        }

        setNotEkleniyor(true);

        try {
            const yeniNotObj = {
                id: Date.now(),
                content: yeniNot.trim(),
                createdAt: new Date().toISOString(),
                formattedDate: new Date().toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            const guncelNotlar = [yeniNotObj, ...notlar];
            setNotlar(guncelNotlar);

            await AsyncStorage.setItem(`notes_${dava.id}`, JSON.stringify(guncelNotlar));

            setYeniNot('');
            Alert.alert('Başarılı', 'Not başarıyla eklendi.');
        } catch (error) {
            console.error('Not eklenirken hata:', error);
            Alert.alert('Hata', 'Not eklenirken bir hata oluştu.');
        } finally {
            setNotEkleniyor(false);
        }
    };

    const notSil = async (notId) => {
        Alert.alert(
            'Not Sil',
            'Bu notu silmek istediğinizden emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const guncelNotlar = notlar.filter(not => not.id !== notId);
                            setNotlar(guncelNotlar);
                            await AsyncStorage.setItem(`notes_${dava.id}`, JSON.stringify(guncelNotlar));
                        } catch (error) {
                            console.error('Not silinirken hata:', error);
                            Alert.alert('Hata', 'Not silinirken bir hata oluştu.');
                        }
                    }
                }
            ]
        );
    };

    const [hatirlaticilar] = useState([
        {
            id: 1,
            tur: 'durusma_oncesi',
            zaman: '1 gün önce',
            mesaj: 'Yarın duruşma var, evrakları hazırla',
            aktif: true
        },
        {
            id: 2,
            tur: 'evrak_hazirlama',
            zaman: '3 gün önce',
            mesaj: 'Duruşma evraklarını kontrol et',
            aktif: true
        }
    ]);

    const [hazirlikListesi, setHazirlikListesi] = useState([
        { id: 1, item: 'Kimlik belgesi', tamamlandi: true },
        { id: 2, item: 'Dava dosyası', tamamlandi: true },
        { id: 3, item: 'Tanık listesi', tamamlandi: false },
        { id: 4, item: 'Ek belgeler', tamamlandi: false },
        { id: 5, item: 'Vekalet belgesi', tamamlandi: false }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#4CAF50';
            case 'pending': return '#FF9800';
            case 'upcoming': return '#2196F3';
            default: return '#9E9E9E';
        }
    };

    const renderTimelineIcon = (rowData) => {
        let iconName;
        switch (rowData.icon) {
            case 'document-text': iconName = 'description'; break;
            case 'mail': iconName = 'mail'; break;
            case 'time': iconName = 'schedule'; break;
            case 'business': iconName = 'business'; break;
            case 'folder': iconName = 'folder'; break;
            case 'gavel': iconName = 'gavel'; break;
            default: iconName = 'circle';
        }

        return (
            <View style={[styles.timelineIcon, { backgroundColor: getStatusColor(rowData.status) }]}>
                <MaterialIcons
                    name={iconName}
                    size={16}
                    color="#fff"
                />
            </View>
        );
    };

    const renderTimelineDetail = (rowData) => {
        return (
            <View style={styles.timelineDetail}>
                <Text style={styles.timelineTitle}>{rowData.title}</Text>
                <Text style={styles.timelineDescription}>{rowData.description}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(rowData.status) }]}>
                    <Text style={styles.statusText}>
                        {rowData.status === 'completed' ? 'Tamamlandı' :
                            rowData.status === 'pending' ? 'Beklemede' : 'Gelecek'}
                    </Text>
                </View>
            </View>
        );
    };

    const toggleHazirlikItem = (id) => {
        setHazirlikListesi(prev =>
            prev.map(item =>
                item.id === id ? { ...item, tamamlandi: !item.tamamlandi } : item
            )
        );
    };

    const getFileIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'pdf': return 'picture-as-pdf';
            case 'doc':
            case 'docx': return 'description';
            case 'jpg':
            case 'jpeg':
            case 'png': return 'image';
            case 'xml': return 'code';
            default: return 'insert-drive-file';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const pickDocument = async () => {
        try {
            setUploading(true);
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/xml'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                const newFile = {
                    id: Date.now(),
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.name.split('.').pop(),
                    date: new Date().toLocaleDateString('tr-TR'),
                    uri: file.uri
                };

                setYuklenmisDosyalar(prev => [...prev, newFile]);
                setShowUploadModal(false);

                Alert.alert('Başarılı', 'Dosya başarıyla yüklendi!');
            }
        } catch (error) {
            Alert.alert('Hata', 'Dosya yüklenirken bir hata oluştu.');
        } finally {
            setUploading(false);
        }
    };

    const pickImage = async () => {
        try {
            setUploading(true);
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('İzin Gerekli', 'Fotoğraf galerisine erişim izni gerekli!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                const image = result.assets[0];
                const newFile = {
                    id: Date.now(),
                    name: `resim_${Date.now()}.jpg`,
                    size: formatFileSize(image.fileSize || 0),
                    type: 'jpg',
                    date: new Date().toLocaleDateString('tr-TR'),
                    uri: image.uri
                };

                setYuklenmisDosyalar(prev => [...prev, newFile]);
                setShowUploadModal(false);

                Alert.alert('Başarılı', 'Resim başarıyla yüklendi!');
            }
        } catch (error) {
            Alert.alert('Hata', 'Resim yüklenirken bir hata oluştu.');
        } finally {
            setUploading(false);
        }
    };

    const takePhoto = async () => {
        try {
            setUploading(true);
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('İzin Gerekli', 'Kamera erişim izni gerekli!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                const photo = result.assets[0];
                const newFile = {
                    id: Date.now(),
                    name: `foto_${Date.now()}.jpg`,
                    size: formatFileSize(photo.fileSize || 0),
                    type: 'jpg',
                    date: new Date().toLocaleDateString('tr-TR'),
                    uri: photo.uri
                };

                setYuklenmisDosyalar(prev => [...prev, newFile]);
                setShowUploadModal(false);

                Alert.alert('Başarılı', 'Fotoğraf başarıyla çekildi!');
            }
        } catch (error) {
            Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = (fileId) => {
        Alert.alert(
            'Dosya Sil',
            'Bu dosyayı silmek istediğinizden emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => {
                        setYuklenmisDosyalar(prev => prev.filter(file => file.id !== fileId));
                    }
                }
            ]
        );
    };

    const viewFile = async (file) => {
        try {
            if (file.uri) {
                setSelectedFile(file);
                setFileViewModal(true);
            } else {
                const demoUri = createDemoFileUri(file);
                setSelectedFile({ ...file, uri: demoUri });
                setFileViewModal(true);
            }
        } catch (error) {
            console.error('Dosya açma hatası:', error);
            Alert.alert('Hata', 'Dosya açılamadı.');
        }
    };

    const shareFile = async (file) => {
        try {
            if (file.uri) {
                const isAvailable = await Sharing.isAvailableAsync();
                if (isAvailable) {
                    await Sharing.shareAsync(file.uri, {
                        dialogTitle: file.name,
                        mimeType: getFileMimeType(file.type)
                    });
                } else {
                    Alert.alert('Hata', 'Paylaşım özelliği bu cihazda kullanılamıyor.');
                }
            } else {
                Alert.alert(`${file.name} demo dosyasıdır. Gerçek dosya paylaşımı için önce dosyayı yükleyin.`);
            }
        } catch (error) {
            console.error('Dosya paylaşma hatası:', error);
            Alert.alert('Hata', 'Dosya paylaşılamadı.');
        }
    };

    const createDemoFileUri = (file) => {
        if (file.type === 'pdf') {
            return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        }
        return null;
    };

    const getFileMimeType = (fileType) => {
        switch (fileType) {
            case 'pdf': return 'application/pdf';
            case 'doc': return 'application/msword';
            case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'jpg': case 'jpeg': return 'image/jpeg';
            case 'png': return 'image/png';
            default: return 'application/octet-stream';
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'genel':
                return (
                    <View style={styles.tabContent}>
                        {/* Dava Bilgileri */}
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Temel Bilgiler</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Dava No:</Text>
                                <Text style={styles.infoValue}>{dava.davaNo}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Mahkeme:</Text>
                                <Text style={styles.infoValue}>{dava.mahkeme.ad}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Müvekkil:</Text>
                                <Text style={styles.infoValue}>{dava.muvekkil.ad} {dava.muvekkil.soyad}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Dava Türü:</Text>
                                <Text style={styles.infoValue}>{dava.davaTuru}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Duruşma:</Text>
                                <Text style={styles.infoValue}>{dava.durusmaTarihi}</Text>
                            </View>
                        </View>

                        {/* İtiraz Süresi */}
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>İtiraz Süresi Takibi</Text>
                            <View style={styles.itirazContainer}>
                                <View style={styles.itirazInfo}>
                                    <MaterialIcons
                                        name="warning"
                                        size={20}
                                        color={getDurumHexRengi(dava.itirazSuresi.kalanGun)}
                                    />
                                    <Text style={[
                                        styles.itirazText,
                                        { color: getDurumHexRengi(dava.itirazSuresi.kalanGun) }
                                    ]}>
                                        {dava.itirazSuresi.kalanGun} gün kaldı
                                    </Text>
                                </View>
                                <Text style={styles.progressText}>
                                    Son tarih: {dava.itirazSuresi.sonTarih}
                                </Text>
                            </View>
                        </View>

                        {/* Açıklama */}
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Açıklama</Text>
                            <Text style={styles.description}>{dava.aciklama}</Text>
                        </View>
                    </View>
                );

            case 'belgeler':
                return (
                    <View style={styles.tabContent}>
                        {/* Dosya Yükleme Butonu */}
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => setShowUploadModal(true)}
                        >
                            <MaterialIcons name="cloud-upload" size={24} color="#fff" />
                            <Text style={styles.uploadButtonText}>Dosya Yükle</Text>
                        </TouchableOpacity>

                        {/* Dosya İstatistikleri */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{yuklenmisDosyalar.length}</Text>
                                <Text style={styles.statLabel}>Toplam Dosya</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {yuklenmisDosyalar.filter(f => f.type === 'pdf').length}
                                </Text>
                                <Text style={styles.statLabel}>PDF</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {yuklenmisDosyalar.filter(f => ['jpg', 'jpeg', 'png'].includes(f.type)).length}
                                </Text>
                                <Text style={styles.statLabel}>Resim</Text>
                            </View>
                        </View>

                        {/* Dosya Listesi */}
                        <Text style={styles.sectionTitle}>Yüklenen Dosyalar</Text>
                        <View style={styles.fileListContainer}>
                            {yuklenmisDosyalar.length > 0 ? (
                                yuklenmisDosyalar.map((item) => (
                                    <View key={item.id} style={styles.fileItem}>
                                        <View style={styles.fileInfo}>
                                            <MaterialIcons
                                                name={getFileIcon(item.type)}
                                                size={32}
                                                color="#2196F3"
                                                style={styles.fileIcon}
                                            />
                                            <View style={styles.fileDetails}>
                                                <Text style={styles.fileName}>{item.name}</Text>
                                                <Text style={styles.fileSize}>{item.date} - {item.size}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.fileActions}>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => viewFile(item)}
                                            >
                                                <Ionicons name="eye-outline" size={20} color="#2196F3" />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => shareFile(item)}
                                            >
                                                <Ionicons name="share-outline" size={20} color="#4CAF50" />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => deleteFile(item.id)}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#F44336" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <MaterialIcons name="folder-open" size={48} color="#ccc" />
                                    <Text style={styles.emptyText}>Henüz dosya yüklenmemiş</Text>
                                </View>
                            )}
                        </View>
                    </View>
                );

            case 'durusma':
                return (
                    <View style={styles.tabContent}>
                        {/* Duruşma Bilgileri Kartı */}
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Sonraki Duruşma</Text>
                            <View style={styles.durusmaHeader}>
                                <View style={styles.durusmaInfo}>
                                    <MaterialIcons name="event" size={24} color="#2196F3" />
                                    <Text style={styles.durusmaTarih}>{durusmaBilgileri.tarih}</Text>
                                    <Text style={styles.durusmaSaat}>{durusmaBilgileri.saat}</Text>
                                </View>
                                <View style={styles.countdownContainer}>
                                    <Text style={styles.countdownNumber}>{durusmaBilgileri.kalanGun}</Text>
                                    <Text style={styles.countdownLabel}>gün kaldı</Text>
                                </View>
                            </View>

                            <View style={styles.durusmaDetay}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Salon:</Text>
                                    <Text style={styles.infoValue}>{durusmaBilgileri.salon}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Hakim:</Text>
                                    <Text style={styles.infoValue}>{durusmaBilgileri.hakim}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Tür:</Text>
                                    <Text style={styles.infoValue}>{durusmaBilgileri.tur}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Tahmini Süre:</Text>
                                    <Text style={styles.infoValue}>{durusmaBilgileri.tahminiSure}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Hatırlatıcılar */}
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Hatırlatıcılar</Text>
                            {hatirlaticilar.map((hatirlatici) => (
                                <View key={hatirlatici.id} style={styles.hatirlaticiItem}>
                                    <MaterialIcons
                                        name="notifications"
                                        size={20}
                                        color={hatirlatici.aktif ? '#4CAF50' : '#9E9E9E'}
                                    />
                                    <View style={styles.hatirlaticiText}>
                                        <Text style={styles.hatirlaticiZaman}>{hatirlatici.zaman}</Text>
                                        <Text style={styles.hatirlaticiMesaj}>{hatirlatici.mesaj}</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <MaterialIcons
                                            name={hatirlatici.aktif ? "toggle-on" : "toggle-off"}
                                            size={24}
                                            color={hatirlatici.aktif ? '#4CAF50' : '#9E9E9E'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Hazırlık Listesi */}
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Duruşma Hazırlık Listesi</Text>
                            {hazirlikListesi.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.hazirlikItem}
                                    onPress={() => toggleHazirlikItem(item.id)}
                                >
                                    <MaterialIcons
                                        name={item.tamamlandi ? "check-box" : "check-box-outline-blank"}
                                        size={24}
                                        color={item.tamamlandi ? '#4CAF50' : '#9E9E9E'}
                                    />
                                    <Text style={[
                                        styles.hazirlikText,
                                        item.tamamlandi && styles.hazirlikTamamlandi
                                    ]}>
                                        {item.item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Dava Süreci Timeline */}
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Dava Süreci Takibi</Text>
                            <View style={styles.timelineContainer}>
                                {durusmaSafhalari.map((item, index) => (
                                    <View key={index} style={styles.timelineItemContainer}>
                                        <View style={styles.timelineLeft}>
                                            <Text style={styles.timeText}>{item.time}</Text>
                                        </View>
                                        <View style={styles.timelineCenter}>
                                            {renderTimelineIcon(item)}
                                            {index < durusmaSafhalari.length - 1 && (
                                                <View style={styles.timelineLine} />
                                            )}
                                        </View>
                                        <View style={styles.timelineRight}>
                                            {renderTimelineDetail(item)}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>


                    </View>
                );

            case 'iletisim':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.emptyText}>İletişim modülü açılıyor...</Text>
                    </View>
                );

            case 'notlar':
                return (
                    <View style={styles.tabContent}>
                        {/* Not Ekleme Formu */}
                        <View style={styles.noteForm}>
                            <Text style={styles.cardTitle}>Yeni Not Ekle</Text>
                            <TextInput
                                style={[styles.noteInput, { minHeight: screenHeight * 0.1 }]}
                                placeholder="Not yazın..."
                                value={yeniNot}
                                onChangeText={setYeniNot}
                                multiline
                                textAlignVertical="top"
                            />
                            <TouchableOpacity
                                style={[styles.addNoteButton, notEkleniyor && styles.disabledButton]}
                                onPress={notEkle}
                                disabled={notEkleniyor || !yeniNot.trim()}
                            >
                                <MaterialIcons name="add" size={24} color="#fff" />
                                <Text style={styles.addNoteText}>
                                    {notEkleniyor ? 'Ekleniyor...' : 'Not Ekle'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Not Listesi */}
                        <View style={styles.notesList}>
                            <Text style={styles.cardTitle}>Davaya Ait Notlar ({notlar.length})</Text>
                            {notlar.length > 0 ? (
                                notlar.map((not, index) => (
                                    <View key={not.id || index} style={styles.noteItem}>
                                        <View style={styles.noteHeader}>
                                            <Text style={styles.noteDate}>{not.formattedDate}</Text>
                                            <TouchableOpacity
                                                style={styles.deleteNoteButton}
                                                onPress={() => notSil(not.id || index)}
                                            >
                                                <MaterialIcons name="delete" size={20} color="#f44336" />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.noteContent}>{not.content}</Text>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <MaterialIcons name="note" size={48} color="#ccc" />
                                    <Text style={styles.emptyText}>Henüz not eklenmemiş</Text>
                                </View>
                            )}
                        </View>
                    </View>
                );

            default:
                return <View style={styles.tabContent}><Text>Geliştirme aşamasında...</Text></View>;
        }
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
                <Text style={styles.headerTitle}>Dava Detayı</Text>
            </View>

            {/* Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'genel' && styles.activeTab]}
                    onPress={() => setActiveTab('genel')}
                >
                    <Text style={[styles.tabText, activeTab === 'genel' && styles.activeTabText]}>
                        Genel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'belgeler' && styles.activeTab]}
                    onPress={() => setActiveTab('belgeler')}
                >
                    <Text style={[styles.tabText, activeTab === 'belgeler' && styles.activeTabText]}>
                        Belgeler
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'durusma' && styles.activeTab]}
                    onPress={() => setActiveTab('durusma')}
                >
                    <Text style={[styles.tabText, activeTab === 'durusma' && styles.activeTabText]}>
                        Duruşma
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'iletisim' && styles.activeTab]}
                    onPress={() => setActiveTab('iletisim')}
                >
                    <Text style={[styles.tabText, activeTab === 'iletisim' && styles.activeTabText]}>
                        İletişim
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'notlar' && styles.activeTab]}
                    onPress={() => setActiveTab('notlar')}
                >
                    <Text style={[styles.tabText, activeTab === 'notlar' && styles.activeTabText]}>
                        Notlar
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tab İçeriği */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
            >
                {renderTabContent()}
            </ScrollView>

            {/* Dosya Yükleme Modal */}
            <Modal
                visible={showUploadModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowUploadModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Dosya Yükle</Text>
                            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.uploadOptions}>
                            <TouchableOpacity
                                style={styles.uploadOption}
                                onPress={pickDocument}
                                disabled={uploading}
                            >
                                <MaterialIcons name="description" size={32} color="#2196F3" />
                                <Text style={styles.uploadOptionText}>Dosya Seç</Text>
                                <Text style={styles.uploadOptionSubtext}>PDF, DOC, XML</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.uploadOption}
                                onPress={pickImage}
                                disabled={uploading}
                            >
                                <MaterialIcons name="photo-library" size={32} color="#4CAF50" />
                                <Text style={styles.uploadOptionText}>Galeri</Text>
                                <Text style={styles.uploadOptionSubtext}>JPG, PNG</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.uploadOption}
                                onPress={takePhoto}
                                disabled={uploading}
                            >
                                <MaterialIcons name="camera-alt" size={32} color="#FF9800" />
                                <Text style={styles.uploadOptionText}>Fotoğraf Çek</Text>
                                <Text style={styles.uploadOptionSubtext}>Kamera</Text>
                            </TouchableOpacity>
                        </View>

                        {uploading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#2196F3" />
                                <Text style={styles.loadingText}>Dosya yükleniyor...</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Dosya Görüntüleme Modalı */}
            <Modal
                visible={fileViewModal}
                animationType="slide"
                onRequestClose={() => setFileViewModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setFileViewModal(false)}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            {selectedFile?.name || 'Dosya'}
                        </Text>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => {
                                if (selectedFile) {
                                    shareFile(selectedFile);
                                }
                            }}
                        >
                            <Ionicons name="share-outline" size={24} color="#2196F3" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.fileViewContainer}>
                        {selectedFile?.uri ? (
                            selectedFile.type === 'pdf' ? (
                                <WebView
                                    source={{ uri: selectedFile.uri }}
                                    style={styles.webView}
                                    startInLoadingState={true}
                                    renderLoading={() => (
                                        <View style={styles.loadingContainer}>
                                            <ActivityIndicator size="large" color="#2196F3" />
                                            <Text style={styles.loadingText}>PDF yükleniyor...</Text>
                                        </View>
                                    )}
                                />
                            ) : selectedFile.type === 'jpg' || selectedFile.type === 'png' || selectedFile.type === 'jpeg' ? (
                                <ScrollView
                                    style={styles.imageContainer}
                                    contentContainerStyle={styles.imageContentContainer}
                                    maximumZoomScale={3}
                                    minimumZoomScale={1}
                                >
                                    <Image
                                        source={{ uri: selectedFile.uri }}
                                        style={styles.imageView}
                                        resizeMode="contain"
                                    />
                                </ScrollView>
                            ) : (
                                <View style={styles.unsupportedContainer}>
                                    <MaterialIcons name="description" size={64} color="#ccc" />
                                    <Text style={styles.unsupportedText}>
                                        Bu dosya türü önizlenemiyor
                                    </Text>
                                    <Text style={styles.unsupportedSubtext}>
                                        Paylaş butonunu kullanarak dosyayı açabilirsiniz
                                    </Text>
                                </View>
                            )
                        ) : (
                            <View style={styles.noFileContainer}>
                                <MaterialIcons name="error-outline" size={64} color="#ccc" />
                                <Text style={styles.noFileText}>Dosya bulunamadı</Text>
                            </View>
                        )}
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
        paddingVertical: screenWidth * 0.02,
        paddingTop: Platform.OS === 'android' ? 10 : screenWidth * 0.12,
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
        paddingRight: screenWidth / 3

    },
    menuButton: {
        padding: screenWidth * 0.015,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: screenWidth * 0.04,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#2196F3',
    },
    tabText: {
        fontSize: screenWidth * 0.035,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: Platform.OS === 'android' ? 90 : 80,
    },
    tabContent: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    itirazContainer: {
        alignItems: 'center',
    },
    itirazInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    itirazText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
    },
    description: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    uploadButton: {
        flexDirection: 'row',
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        elevation: 2,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    fileListContainer: {
        flex: 1,
    },
    fileList: {
        flex: 1,
    },
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    fileIcon: {
        marginRight: 15,
    },
    fileDetails: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    fileSize: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    fileActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 5,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    uploadOptions: {
        padding: 20,
    },
    uploadOption: {
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        marginBottom: 15,
    },
    uploadOptionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    uploadOptionSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    durusmaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    durusmaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    durusmaTarih: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    durusmaSaat: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
    },
    countdownContainer: {
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 10,
    },
    countdownNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    countdownLabel: {
        fontSize: 12,
        color: '#666',
    },
    durusmaDetay: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 15,
    },
    hatirlaticiItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    hatirlaticiText: {
        flex: 1,
        marginLeft: 10,
    },
    hatirlaticiZaman: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
    hatirlaticiMesaj: {
        fontSize: 14,
        color: '#333',
        marginTop: 2,
    },
    hazirlikItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    hazirlikText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
        flex: 1,
    },
    hazirlikTamamlandi: {
        textDecorationLine: 'line-through',
        color: '#9E9E9E',
    },
    timelineContainer: {
        paddingVertical: 10,
    },
    timelineItemContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    timelineLeft: {
        width: 80,
        alignItems: 'flex-end',
        paddingRight: 15,
        paddingTop: 5,
    },
    timelineCenter: {
        alignItems: 'center',
        width: 40,
    },
    timelineRight: {
        flex: 1,
        paddingLeft: 15,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E0E0E0',
        marginTop: 8,
    },
    timelineIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineDetail: {
        paddingBottom: 10,
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    timelineDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },

    noteForm: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    noteInput: {
        borderWidth: 2,
        borderColor: '#2196F3',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    addNoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 12,
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
    },
    addNoteText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    notesList: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    noteItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#2196F3',
        elevation: 3,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 5,
        borderLeftColor: '#2196F3',
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    noteDate: {
        fontSize: 13,
        color: '#2196F3',
        fontWeight: '600',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    deleteNoteButton: {
        padding: 8,
        borderRadius: 8,
    },
    noteContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        fontWeight: '400',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    closeButton: {
        padding: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    shareButton: {
        padding: 8,
    },
    fileViewContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    webView: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
    },
    imageContentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
    },
    imageView: {
        width: screenWidth,
        height: screenHeight * 0.8,
    },
    unsupportedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    unsupportedText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    unsupportedSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    noFileContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noFileText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
});