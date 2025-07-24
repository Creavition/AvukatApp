import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Dimensions,
  Linking,
  Platform
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { events } from "../data/Data";
import Calendar from '../components/Calendar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const davaListesi = [
  {
    id: 1,
    davaNo: "2024/123",
    durum: "acil",
    durumRenk: "🔴",
    muvekkil: {
      ad: "Ahmet",
      soyad: "Yılmaz",
      telefon: "+90 532 123 45 67",
      email: "batuhancicekli@gmail.com",
      adres: "Kadıköy Mah. Bağdat Cad. No:123 Kadıköy/İstanbul",
      whatsapp: "+90 532 123 45 67"
    },
    karsiTaraf: {
      ad: "Serkan",
      soyad: "Özkan",
      telefon: "+90 555 111 22 33",
      email: "serkan.ozkan@hotmail.com",
      adres: "Beşiktaş Mah. Nişantaşı Cad. No:45 Beşiktaş/İstanbul",
      whatsapp: "+90 555 111 22 33"
    },
    taniklar: [
      {
        ad: "Dr. Murat",
        soyad: "Kıral",
        telefon: "+90 533 444 55 66",
        email: "dr.murat@klinik.com",
        adres: "Levent Mah. Maya Cad. No:78 Beşiktaş/İstanbul",
        whatsapp: "+90 533 444 55 66"
      }
    ],
    mahkeme: {
      ad: "İstanbul 2. Asliye",
      il: "İstanbul",
      adres: "Çağlayan Adalet Sarayı, Kağıthane/İstanbul"
    },
    davaTuru: "İcra",
    durusmaTarihi: "2025-07-25T14:30:00",
    durusmaFormatli: "25.07.2025 14:30",
    itirazSuresi: {
      kalanGun: 5,
      sonTarih: "2025-07-30",
      yuzde: 75
    },
    aciklama: "İcra takip dosyası - Borç: 125.000 TL",
    dosyaSayisi: 8,
    sonIslem: "2025-07-20T10:15:00"
  },
  {
    id: 2,
    davaNo: "2024/124",
    durum: "beklemede",
    durumRenk: "🟡",
    muvekkil: {
      ad: "Fatma",
      soyad: "Demir",
      telefon: "+90 533 987 65 43",
      email: "fatma.demir@outlook.com",
      adres: "Çankaya Mah. Atatürk Bulv. No:89 Çankaya/Ankara",
      whatsapp: "+90 533 987 65 43"
    },
    karsiTaraf: {
      ad: "Hakan",
      soyad: "Demir",
      telefon: "+90 544 222 33 44",
      email: "hakan.demir@gmail.com",
      adres: "Kızılay Mah. İnönü Cad. No:156 Çankaya/Ankara",
      whatsapp: "+90 544 222 33 44"
    },
    taniklar: [
      {
        ad: "Zeynep",
        soyad: "Arslan",
        telefon: "+90 535 333 44 55",
        email: "zeynep.arslan@hotmail.com",
        adres: "Bahçelievler Mah. 7. Cad. No:23 Çankaya/Ankara",
        whatsapp: "+90 535 333 44 55"
      }
    ],
    mahkeme: {
      ad: "Ankara 1. Aile",
      il: "Ankara",
      adres: "Ankara Adalet Sarayı, Çankaya/Ankara"
    },
    davaTuru: "Boşanma",
    durusmaTarihi: "2025-08-15T09:00:00",
    durusmaFormatli: "15.08.2025 09:00",
    itirazSuresi: {
      kalanGun: 12,
      sonTarih: "2025-08-05",
      yuzde: 45
    },
    aciklama: "Anlaşmalı boşanma davası",
    dosyaSayisi: 15,
    sonIslem: "2025-07-18T14:22:00"
  },
  {
    id: 3,
    davaNo: "2024/125",
    durum: "normal",
    durumRenk: "🟢",
    muvekkil: {
      ad: "Mehmet",
      soyad: "Kaya",
      telefon: "+90 534 555 44 33",
      email: "mehmet.kaya@gmail.com",
      adres: "Konak Mah. Cumhuriyet Bulv. No:45 Konak/İzmir",
      whatsapp: "+90 534 555 44 33"
    },
    karsiTaraf: {
      ad: "ABC Şirketi",
      soyad: "Ltd. Şti.",
      telefon: "+90 232 444 55 66",
      email: "info@abcfirma.com",
      adres: "Alsancak Mah. İş Merkezi Bulv. No:123 Konak/İzmir",
      whatsapp: "+90 232 444 55 66"
    },
    taniklar: [
      {
        ad: "Av. Elif",
        soyad: "Yıldız",
        telefon: "+90 536 777 88 99",
        email: "elif.yildiz@barosu.org.tr",
        adres: "Bornova Mah. Hukuk Cad. No:67 Bornova/İzmir",
        whatsapp: "+90 536 777 88 99"
      }
    ],
    mahkeme: {
      ad: "İzmir 3. Ticaret",
      il: "İzmir",
      adres: "İzmir Adalet Sarayı, Bayraklı/İzmir"
    },
    davaTuru: "Ticari Alacak",
    durusmaTarihi: "2025-09-10T11:30:00",
    durusmaFormatli: "10.09.2025 11:30",
    itirazSuresi: {
      kalanGun: 25,
      sonTarih: "2025-08-20",
      yuzde: 20
    },
    aciklama: "Sözleşme ihlali - Alacak: 85.000 TL",
    dosyaSayisi: 12,
    sonIslem: "2025-07-15T16:45:00"
  },
  {
    id: 4,
    davaNo: "2024/126",
    durum: "acil",
    durumRenk: "🔴",
    muvekkil: {
      ad: "Ayşe",
      soyad: "Öztürk",
      telefon: "+90 535 777 88 99",
      email: "ayse.ozturk@gmail.com",
      adres: "Osmangazi Mah. Zafer Cad. No:234 Osmangazi/Bursa",
      whatsapp: "+90 535 777 88 99"
    },
    karsiTaraf: {
      ad: "Emre",
      soyad: "Güneş",
      telefon: "+90 543 888 99 00",
      email: "emre.gunes@hotmail.com",
      adres: "Nilüfer Mah. Akpınar Cad. No:78 Nilüfer/Bursa",
      whatsapp: "+90 543 888 99 00"
    },
    taniklar: [
      {
        ad: "Polis Memuru",
        soyad: "Can Yılmaz",
        telefon: "+90 534 111 22 33",
        email: "can.yilmaz@emniyet.gov.tr",
        adres: "Bursa Emniyet Müdürlüğü, Osmangazi/Bursa",
        whatsapp: "+90 534 111 22 33"
      }
    ],
    mahkeme: {
      ad: "Bursa 2. Asliye Hukuk",
      il: "Bursa",
      adres: "Bursa Adalet Sarayı, Osmangazi/Bursa"
    },
    davaTuru: "Tazminat",
    durusmaTarihi: "2025-07-28T10:00:00",
    durusmaFormatli: "28.07.2025 10:00",
    itirazSuresi: {
      kalanGun: 2,
      sonTarih: "2025-07-24",
      yuzde: 90
    },
    aciklama: "Trafik kazası tazminat davası",
    dosyaSayisi: 6,
    sonIslem: "2025-07-22T09:30:00"
  },
  {
    id: 5,
    davaNo: "2024/127",
    durum: "beklemede",
    durumRenk: "🟡",
    muvekkil: {
      ad: "Osman",
      soyad: "Şahin",
      telefon: "+90 536 222 33 44",
      email: "osman.sahin@outlook.com",
      adres: "Muratpaşa Mah. Liman Cad. No:67 Muratpaşa/Antalya",
      whatsapp: "+90 536 222 33 44"
    },
    karsiTaraf: {
      ad: "XYZ İnşaat",
      soyad: "A.Ş.",
      telefon: "+90 242 333 44 55",
      email: "ik@xyzinsaat.com.tr",
      adres: "Kepez Mah. Sanayi Sitesi No:89 Kepez/Antalya",
      whatsapp: "+90 242 333 44 55"
    },
    taniklar: [
      {
        ad: "Ahmet",
        soyad: "Çelik",
        telefon: "+90 537 555 66 77",
        email: "ahmet.celik@gmail.com",
        adres: "Konyaaltı Mah. Sahil Cad. No:123 Konyaaltı/Antalya",
        whatsapp: "+90 537 555 66 77"
      }
    ],
    mahkeme: {
      ad: "Antalya 1. İş",
      il: "Antalya",
      adres: "Antalya Adalet Sarayı, Muratpaşa/Antalya"
    },
    davaTuru: "İş Davası",
    durusmaTarihi: "2025-08-20T14:00:00",
    durusmaFormatli: "20.08.2025 14:00",
    itirazSuresi: {
      kalanGun: 8,
      sonTarih: "2025-07-30",
      yuzde: 65
    },
    aciklama: "İşçi alacakları davası",
    dosyaSayisi: 9,
    sonIslem: "2025-07-19T11:20:00"
  }
];


const searchDavalar = (davalar, searchTerm) => {
  return davalar.filter(dava =>
    dava.davaNo.includes(searchTerm) ||
    `${dava.muvekkil.ad} ${dava.muvekkil.soyad}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dava.mahkeme.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dava.davaTuru.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const sortByItirazSuresi = (davalar) => {
  return [...davalar].sort((a, b) => a.itirazSuresi.kalanGun - b.itirazSuresi.kalanGun);
};


const filterByDurum = (davalar, durum) => {
  return davalar.filter(dava => dava.durum === durum);
};

export default function CaseManagement({ navigation }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('tumu');
  const [filtrelenmisListe, setFiltrelenmisListe] = useState(davaListesi);

  useEffect(() => {
    let sonuc = davaListesi;


    if (searchText.length > 0) {
      sonuc = searchDavalar(sonuc, searchText);
    }

    if (selectedFilter !== 'tumu') {
      sonuc = filterByDurum(sonuc, selectedFilter);
    }

    sonuc = sortByItirazSuresi(sonuc);

    setFiltrelenmisListe(sonuc);
  }, [searchText, selectedFilter]);

  const getItirazRengi = (kalanGun) => {
    if (kalanGun >= 15) return '#4CAF50'; // Yeşil
    if (kalanGun >= 7) return '#FF9800';  // Turuncu
    if (kalanGun >= 3) return '#FF5722';  // Koyu turuncu
    return '#F44336'; // Kırmızı
  };

  // Google Maps'te mahkeme konumunu açma fonksiyonu
  const openGoogleMaps = async (dava) => {
    try {
      // Arama sorgusu oluştur (mahkeme adı + adres)
      const searchQuery = `${dava.mahkeme.ad} ${dava.mahkeme.adres}`;

      // Platform'a göre URL oluştur
      let mapsUrl;

      if (Platform.OS === 'ios') {
        // iOS için Apple Maps
        mapsUrl = `maps:0,0?q=${encodeURIComponent(searchQuery)}`;
      } else {
        // Android için Google Maps
        mapsUrl = `geo:0,0?q=${encodeURIComponent(searchQuery)}`;
      }

      const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

      // Harita uygulamasını açmayı dene
      const canOpenMaps = await Linking.canOpenURL(mapsUrl);

      if (canOpenMaps) {
        await Linking.openURL(mapsUrl);
      } else {
        // Harita uygulaması yoksa web tarayıcısında aç
        await Linking.openURL(webUrl);
      }

    } catch (error) {
      console.error('Harita açılırken hata:', error);
      Alert.alert(
        'Hata',
        'Harita açılırken bir sorun oluştu. İnternet bağlantınızı kontrol edin.',
        [{ text: 'Tamam' }]
      );
    }
  };

  // Konum izni kontrol fonksiyonu
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Konum izni hatası:', error);
      return false;
    }
  };

  // Harita butonu tıklama fonksiyonu
  const haritayaGit = async (dava) => {
    try {
      // Önce konum iznini kontrol et
      const hasPermission = await checkLocationPermission();

      if (!hasPermission) {
        Alert.alert(
          'Konum İzni',
          'Harita özelliği için konum iznine ihtiyaç var. Yine de mahkeme konumunu haritada görmek ister misiniz?',
          [
            { text: 'İptal', style: 'cancel' },
            {
              text: 'Haritayı Aç',
              onPress: () => openGoogleMaps(dava)
            },
            {
              text: 'İzin Ver',
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return;
      }

      // İzin varsa harita seçeneklerini göster
      Alert.alert(
        'Harita Seçenekleri',
        `${dava.mahkeme.ad} konumunu nasıl görüntülemek istiyorsunuz?`,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Haritada Göster',
            onPress: () => openGoogleMaps(dava),
            style: 'default'
          },
        ]
      );

    } catch (error) {
      console.error('Harita erişim hatası:', error);
      // Hata durumunda direkt haritayı aç
      openGoogleMaps(dava);
    }
  };


  // Dava kartı render fonksiyonu
  const renderDavaKart = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.davaKart}
        onPress={() => davaDetayinaGit(item)}
        activeOpacity={0.7}
      >
        {/* Üst kısım - Dava No ve Mahkeme */}
        <View style={styles.kartUst}>
          <View style={styles.davaNoContainer}>
            <Text style={styles.durumIcon}>{item.durumRenk}</Text>
            <Text style={styles.davaNo}>Dava No: {item.davaNo}</Text>
          </View>
          <View style={styles.mahkemeContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.mahkemeAdi}>{item.mahkeme.ad}</Text>
          </View>
        </View>

        {/* Orta kısım - Müvekkil ve Dava Türü */}
        <View style={styles.kartOrta}>
          <Text style={styles.muvekkil}>
            Müvekkil: {item.muvekkil.ad} {item.muvekkil.soyad}
          </Text>
          <Text style={styles.davaTuru}>Tür: {item.davaTuru}</Text>
        </View>

        {/* Alt kısım - Duruşma ve İtiraz */}
        <View style={styles.kartAlt}>
          <View style={styles.durusmaContainer}>
            <Text style={styles.durusmaLabel}>Duruşma:</Text>
            <Text style={styles.durusmaTarihi}>{item.durusmaFormatli}</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                takvimiEkle(item);
              }}
            >
              <MaterialIcons name="event" size={20} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                haritayaGit(item);
              }}
            >
              <MaterialIcons name="map" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>

          {/* İtiraz süresi */}
          <View style={styles.itirazContainer}>
            <View style={styles.itirazInfo}>
              <Text style={[
                styles.itirazText,
                { color: getItirazRengi(item.itirazSuresi.kalanGun) }
              ]}>
                İtiraz Süresi: {item.itirazSuresi.kalanGun} gün kaldı
              </Text>
              <MaterialIcons
                name="warning"
                size={16}
                color={getItirazRengi(item.itirazSuresi.kalanGun)}
              />
            </View>
            {/* Progress bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.itirazSuresi.yuzde}%`,
                    backgroundColor: getItirazRengi(item.itirazSuresi.kalanGun)
                  }
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const davaDetayinaGit = (dava) => {
    navigation.navigate('CaseDetails', { dava: dava });
  };

  const takvimiEkle = (dava) => {
    Alert.alert(
      'Takvime Ekle',
      `${dava.durusmaFormatli} tarihli duruşma takvime eklensin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ekle', onPress: () => console.log('Takvime eklendi') }
      ]
    );
  };

  // Filtre butonları
  const renderFilters = () => {
    const filters = [
      { key: 'tumu', label: 'Tümü', count: davaListesi.length },
      { key: 'acil', label: 'Acil', count: davaListesi.filter(d => d.durum === 'acil').length },
      { key: 'beklemede', label: 'Beklemede', count: davaListesi.filter(d => d.durum === 'beklemede').length },
      { key: 'normal', label: 'Normal', count: davaListesi.filter(d => d.durum === 'normal').length }
    ];

    return (
      <View style={styles.filtersWrapper}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterBtn,
              selectedFilter === filter.key && styles.filterBtnActive
            ]}
            onPress={() => setSelectedFilter(filter.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterBtnText,
              selectedFilter === filter.key && styles.filterBtnTextActive
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            style={{ paddingRight: 10, paddingTop: 4, alignItems: "center" }}
            name="search"
            size={24}
            color="black"
          />
          <TextInput
            style={styles.input}
            placeholder='Dava No, Müvekkil Adı'
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
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

      {/* Filtre butonları */}
      <View style={styles.filterSection}>
        {renderFilters()}
      </View>

      {/* Sonuç sayısı */}
      <View style={styles.resultSection}>
        <Text style={styles.resultText}>
          {filtrelenmisListe.length} dava listeleniyor
        </Text>
      </View>

      {/* Dava Listesi */}
      <FlatList
        data={filtrelenmisListe}
        renderItem={renderDavaKart}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="folder-open" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Dava bulunamadı</Text>
            <Text style={styles.emptySubText}>
              Arama kriterlerinizi değiştirip tekrar deneyin
            </Text>
          </View>
        )}
      />

      {/* Takvim Component'i */}
      <Calendar
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        events={events}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.06,
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.1,
  },
  searchBar: {
    flexDirection: "row",
    height: screenHeight * 0.06,
    width: screenWidth * 0.9,
    maxWidth: 400,
    borderWidth: 2,
    borderRadius: screenWidth * 0.025,
    borderColor: "black",
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.025,
    paddingHorizontal: screenWidth * 0.03,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: screenWidth * 0.04,
    color: '#333',
  },
  calendarButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: screenHeight * 0.025,
    minHeight: screenHeight * 0.06,
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
    borderRadius: screenWidth * 0.03,
    minWidth: screenWidth * 0.06,
    height: screenWidth * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.015,
  },
  eventCountText: {
    color: '#fff',
    fontSize: screenWidth * 0.03,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: screenHeight * 0.015,
  },
  filtersWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: screenWidth * 0.01,
  },
  filterBtn: {
    flex: 1,
    marginHorizontal: screenWidth * 0.005,
    paddingVertical: screenHeight * 0.008,
    paddingHorizontal: screenWidth * 0.015,
    backgroundColor: '#F8F9FA',
    borderRadius: screenWidth * 0.02,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight * 0.04, // Daha küçük yükseklik
  },
  filterBtnActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterBtnText: {
    fontSize: screenWidth * 0.032,
    color: '#495057',
    fontWeight: '600',
    textAlign: 'center',
  },
  filterBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Sonuç Section
  resultSection: {
    marginBottom: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.01,
  },
  resultText: {
    fontSize: screenWidth * 0.035,
    color: '#666',
  },
  listContainer: {
    paddingBottom: screenHeight * 0.05,
  },
  davaKart: {
    backgroundColor: 'white',
    borderRadius: screenWidth * 0.03,
    padding: screenWidth * 0.04,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: screenHeight * 0.015,
    borderWidth: 2,
    borderColor: "#9fc9d8"
  },
  kartUst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.015,
  },
  davaNoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  durumIcon: {
    fontSize: screenWidth * 0.03,
    marginRight: screenWidth * 0.02,
  },
  davaNo: {
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
    color: '#333',
  },
  mahkemeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  mahkemeAdi: {
    fontSize: screenWidth * 0.03,
    color: '#666',
    marginLeft: screenWidth * 0.01,
    textAlign: 'right',
    flexShrink: 1,
  },
  kartOrta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.02,
  },
  muvekkil: {
    fontSize: screenWidth * 0.035,
    color: '#333',
    flex: 1,
  },
  davaTuru: {
    fontSize: screenWidth * 0.035,
    color: '#666',
  },
  kartAlt: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: screenHeight * 0.015,
  },
  durusmaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.015,
  },
  durusmaLabel: {
    fontSize: screenWidth * 0.035,
    color: '#333',
    marginRight: screenWidth * 0.015,
  },
  durusmaTarihi: {
    fontSize: screenWidth * 0.035,
    fontWeight: '500',
    color: '#2196F3',
    flex: 1,
  },
  iconButton: {
    padding: screenWidth * 0.015,
    marginLeft: screenWidth * 0.015,
  },
  itirazContainer: {
    marginTop: screenHeight * 0.01,
  },
  itirazInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.01,
  },
  itirazText: {
    fontSize: screenWidth * 0.032,
    fontWeight: '500',
  },
  progressBar: {
    height: screenHeight * 0.005,
    backgroundColor: '#e0e0e0',
    borderRadius: screenWidth * 0.005,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: screenWidth * 0.005,
  },
  separator: {
    height: screenHeight * 0.015,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.1,
  },
  emptyText: {
    fontSize: screenWidth * 0.045,
    color: '#999',
    marginTop: screenHeight * 0.02,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: screenWidth * 0.035,
    color: '#ccc',
    marginTop: screenHeight * 0.01,
    textAlign: 'center',
  },
});