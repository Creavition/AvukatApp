const davaListesi = [
  {
    id: 1,
    davaNo: "2024/123",
    durum: "acil", 
    durumRenk: "🔴",
    muvekkil: {
      ad: "Ahmet",
      soyad: "Yılmaz",
      telefon: "+90 532 123 45 67"
    },
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
      telefon: "+90 533 987 65 43"
    },
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
      telefon: "+90 534 555 44 33"
    },
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
      telefon: "+90 535 777 88 99"
    },
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
      telefon: "+90 536 222 33 44"
    },
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
  },
  {
    id: 6,
    davaNo: "2024/128",
    durum: "normal",
    durumRenk: "🟢",
    muvekkil: {
      ad: "Zeynep",
      soyad: "Yıldız",
      telefon: "+90 537 444 55 66"
    },
    mahkeme: {
      ad: "Adana 4. Asliye",
      il: "Adana",
      adres: "Adana Adalet Sarayı, Seyhan/Adana"
    },
    davaTuru: "Miras",
    durusmaTarihi: "2025-09-05T13:30:00",
    durusmaFormatli: "05.09.2025 13:30",
    itirazSuresi: {
      kalanGun: 30,
      sonTarih: "2025-08-25",
      yuzde: 15
    },
    aciklama: "Miras taksimi davası",
    dosyaSayisi: 20,
    sonIslem: "2025-07-10T15:10:00"
  },
  {
    id: 7,
    davaNo: "2024/129",
    durum: "acil",
    durumRenk: "🔴",
    muvekkil: {
      ad: "Hasan",
      soyad: "Özkan",
      telefon: "+90 538 666 77 88"
    },
    mahkeme: {
      ad: "Konya 3. Hukuk",
      il: "Konya",
      adres: "Konya Adalet Sarayı, Selçuklu/Konya"
    },
    davaTuru: "Gayrimenkul",
    durusmaTarihi: "2025-07-26T15:30:00",
    durusmaFormatli: "26.07.2025 15:30",
    itirazSuresi: {
      kalanGun: 1,
      sonTarih: "2025-07-23",
      yuzde: 95
    },
    aciklama: "Tapu iptali ve tescil davası",
    dosyaSayisi: 14,
    sonIslem: "2025-07-21T12:45:00"
  },
  {
    id: 8,
    davaNo: "2024/130",
    durum: "normal",
    durumRenk: "🟢",
    muvekkil: {
      ad: "Gülşen",
      soyad: "Arslan",
      telefon: "+90 539 888 99 00"
    },
    mahkeme: {
      ad: "Trabzon 1. Asliye",
      il: "Trabzon",
      adres: "Trabzon Adalet Sarayı, Ortahisar/Trabzon"
    },
    davaTuru: "Sözleşme",
    durusmaTarihi: "2025-09-15T10:30:00",
    durusmaFormatli: "15.09.2025 10:30",
    itirazSuresi: {
      kalanGun: 18,
      sonTarih: "2025-08-10",
      yuzde: 35
    },
    aciklama: "Kira kontratı ihlali davası",
    dosyaSayisi: 7,
    sonIslem: "2025-07-16T08:15:00"
  }
];

// Renk kodlaması fonksiyonu
const getDurumRengi = (kalanGun) => {
  if (kalanGun >= 15) return "🟢"; // Yeşil - Normal
  if (kalanGun >= 7) return "🟡";  // Sarı - Dikkat
  if (kalanGun >= 3) return "🟠";  // Turuncu - Uyarı
  return "🔴"; // Kırmızı - Acil
};

// Filtreleme fonksiyonları
const filterByDurum = (davalar, durum) => {
  return davalar.filter(dava => dava.durum === durum);
};

const filterByMahkeme = (davalar, mahkemeTuru) => {
  return davalar.filter(dava => 
    dava.mahkeme.ad.toLowerCase().includes(mahkemeTuru.toLowerCase())
  );
};

const searchDavalar = (davalar, searchTerm) => {
  return davalar.filter(dava => 
    dava.davaNo.includes(searchTerm) ||
    `${dava.muvekkil.ad} ${dava.muvekkil.soyad}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dava.mahkeme.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dava.davaTuru.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Sıralama fonksiyonları
const sortByDurusmaTarihi = (davalar) => {
  return [...davalar].sort((a, b) => new Date(a.durusmaTarihi) - new Date(b.durusmaTarihi));
};

const sortByItirazSuresi = (davalar) => {
  return [...davalar].sort((a, b) => a.itirazSuresi.kalanGun - b.itirazSuresi.kalanGun);
};


const formatForFlatList = (davalar) => {
  return davalar.map(dava => ({
    ...dava,
    key: dava.id.toString(),
    title: `Dava No: ${dava.davaNo}`,
    subtitle: `${dava.muvekkil.ad} ${dava.muvekkil.soyad} - ${dava.davaTuru}`
  }));
};

export {
  davaListesi,
  getDurumRengi,
  filterByDurum,
  filterByMahkeme,
  searchDavalar,
  sortByDurusmaTarihi,
  sortByItirazSuresi,
  formatForFlatList
};