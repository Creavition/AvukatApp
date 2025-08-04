import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Entypo from '@expo/vector-icons/Entypo';
import { events, davaListesi, searchDavalar, filterByDurum, sortByItirazSuresi, getDurumHexRengi } from "../data/DavaData";
import Calendar from '../components/Calendar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

  const formatDurusma = (tarih) => {
    const date = new Date(tarih);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openGoogleMaps = async (dava) => {
    try {
      const searchQuery = `${dava.mahkeme.ad} ${dava.mahkeme.adres}`;

      let mapsUrl;

      if (Platform.OS === 'ios') {
        mapsUrl = `maps:0,0?q=${encodeURIComponent(searchQuery)}`;
      } else {
        mapsUrl = `geo:0,0?q=${encodeURIComponent(searchQuery)}`;
      }

      const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

      const canOpenMaps = await Linking.canOpenURL(mapsUrl);

      if (canOpenMaps) {
        await Linking.openURL(mapsUrl);
      } else {
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

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Konum izni hatası:', error);
      return false;
    }
  };

  const haritayaGit = async (dava) => {
    try {
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

      Alert.alert(
        'Harita Seçenekleri',
        `${dava.mahkeme.ad} konumunu görüntülemek istiyor musunuz?`,
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
      openGoogleMaps(dava);
    }
  };

  const renderDavaKart = ({ item }) => {
    const durumRengi = getDurumHexRengi(item.itirazSuresi.kalanGun);

    return (
      <TouchableOpacity
        style={styles.davaKart}
        onPress={() => davaDetayinaGit(item)}
        activeOpacity={0.7}
      >
        {/* Üst kısım - Dava No ve Mahkeme */}
        <View style={styles.kartUst}>
          <View style={styles.davaNoContainer}>
            <Text style={[styles.durumIcon, { color: durumRengi }]}>{item.durumRenk}</Text>
            <Text style={[styles.davaNo, { color: durumRengi }]}>Dava No: {item.davaNo}</Text>
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
            <Text style={styles.durusmaTarihi}>{formatDurusma(item.durusmaTarihi)}</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                takvimiEkle(item);
              }}
            >
              <MaterialIcons name="event" size={25} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                haritayaGit(item);
              }}
            >
              <Entypo name="location-pin" size={30} color="#2196F3" />
            </TouchableOpacity>
          </View>

          {/* İtiraz süresi */}
          <View style={styles.itirazContainer}>
            <View style={styles.itirazInfo}>
              <Text style={[
                styles.itirazText,
                { color: durumRengi }
              ]}>
                İtiraz Süresi: {item.itirazSuresi.kalanGun} gün kaldı
              </Text>
              <MaterialIcons
                name="warning"
                size={16}
                color={durumRengi}
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
    const formattedDate = formatDurusma(dava.durusmaTarihi);
    Alert.alert(
      'Takvime Ekle',
      `${formattedDate} tarihli duruşma takvime eklensin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ekle', onPress: () => console.log('Takvime eklendi') }
      ]
    );
  };

  const renderFilters = () => {
    const filters = [
      { key: 'tumu', label: 'Tümü', count: davaListesi.length },
      { key: 'acil', label: 'Acil', count: davaListesi.filter(d => d.durum === 'acil').length },
      { key: 'yaklaşıyor', label: 'Yaklaşıyor', count: davaListesi.filter(d => d.durum === 'yaklaşıyor').length },
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
            style={{ paddingRight: 10, alignItems: "center" }}
            name="search"
            size={24}
            color="blue"
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
    paddingTop: screenHeight * 0.02,
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.07,
  },
  searchBar: {
    flexDirection: "row",
    height: screenHeight * 0.06,
    width: screenWidth * 0.9,
    maxWidth: 400,
    borderWidth: 1,
    borderRadius: screenWidth * 0.025,
    borderColor: "black",
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.015,
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
    marginTop: screenHeight * 0.025,
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
    marginHorizontal: screenWidth * 0.003,
    paddingVertical: screenHeight * 0.008,
    paddingHorizontal: screenWidth * 0.01,
    backgroundColor: '#F8F9FA',
    borderRadius: screenWidth * 0.02,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight * 0.04,
  },
  filterBtnActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterBtnText: {
    fontSize: screenWidth * 0.028,
    color: '#495057',
    fontWeight: '600',
    textAlign: 'center',
  },
  filterBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultSection: {
    marginBottom: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.01,
  },
  resultText: {
    fontSize: screenWidth * 0.035,
    color: '#666',
  },
  listContainer: {
    paddingBottom: Platform.OS === 'android' ? 90 : 80,
  },
  davaKart: {
    backgroundColor: 'white',
    borderRadius: screenWidth * 0.03,
    padding: screenWidth * 0.04,
    elevation: 2,
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