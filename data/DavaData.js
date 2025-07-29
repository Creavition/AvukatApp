export const events = {
    '2025-07-28': ['Mahkeme duruşması - 10:00', 'Müvekkil görüşmesi - 14:30'],
    '2025-07-29': ['Dosya inceleme - 09:00', 'İstinaf başvurusu - 11:00', 'Avukat toplantısı - 15:30'],
    '2025-08-05': ['Uzlaştırma görüşmesi - 10:30'],
    '2025-08-15': ['Temyiz inceleme - 09:00'],
    '2025-08-24': ['Müvekkil randevusu - 16:00'],
    '2025-09-10': ['Mahkeme duruşması - 11:00'],
    '2025-09-24': ['Dosya teslimi - 14:30'],
    '2025-10-12': ['İcra takibi - 10:00'],
    '2025-11-08': ['Bilirkişi raporu inceleme - 13:00'],
    '2025-12-25': ['Yıl sonu değerlendirme toplantısı - 15:00']
};

export const deadlines = [
    {
        id: 1,
        title: 'İstinaf İtiraz Süresi',
        date: '2025-07-30',
        caseNumber: '2025/123',
        clientName: 'Ahmet Yılmaz',
        description: 'İlk derece mahkeme kararına karşı istinaf başvurusu için son gün. Gerekli belgeler hazırlandı.'
    },
    {
        id: 2,
        title: 'Temyiz İtiraz Süresi',
        date: '2025-07-30',
        caseNumber: '2025/456',
        clientName: 'Fatma Kaya',
        description: 'Bölge adliye mahkemesi kararına karşı temyiz başvurusu yapılacak.'
    },
    {
        id: 3,
        title: 'İcra İtiraz Süresi',
        date: '2025-07-30',
        caseNumber: '2025/789',
        clientName: 'Mehmet Demir',
        description: 'İcra müdürlüğü takibi kararına itiraz edilecek.'
    },
    {
        id: 4,
        title: 'Duruşma Hazırlığı',
        date: '2025-08-02',
        caseNumber: '2025/101',
        clientName: 'Ayşe Öztürk',
        description: 'Duruşmaya hazırlık için son kontroller yapılacak.'
    },
    {
        id: 5,
        title: 'Uzlaşma Teklifi Süresi',
        date: '2025-08-05',
        caseNumber: '2025/234',
        clientName: 'Can Arslan',
        description: 'Karşı tarafın uzlaşma teklifine cevap verilmesi gerekiyor.'
    },
    {
        id: 6,
        title: 'Delil Toplama Süresi',
        date: '2025-08-10',
        caseNumber: '2025/567',
        clientName: 'Zeynep Şahin',
        description: 'Mahkeme tarafından verilen delil toplama süresi bitiyor.'
    },
    {
        id: 7,
        title: 'Vekil Değişikliği',
        date: '2025-08-15',
        caseNumber: '2025/890',
        clientName: 'Ali Çelik',
        description: 'Vekil değişikliği için gerekli işlemler tamamlanacak.'
    },
    {
        id: 8,
        title: 'Tebligat Süresi',
        date: '2025-09-01',
        caseNumber: '2025/345',
        clientName: 'Sema Aktaş',
        description: 'Mahkeme kararının tebliğ süresi dolmadan gerekli işlemler yapılacak.'
    },
    {
        id: 9,
        title: 'Tahsilat Takibi',
        date: '2025-09-15',
        caseNumber: '2025/678',
        clientName: 'Hasan Yıldız',
        description: 'Mahkeme kararının infazı için takip başlatılacak.'
    },
    {
        id: 10,
        title: 'Dosya Düzenleme',
        date: '2025-10-01',
        caseNumber: '2025/912',
        clientName: 'Elif Karaca',
        description: 'Yeni dava dosyasının düzenlenmesi ve mahkemeye sunulması.'
    }
];

export const calculateKalanGun = (sonTarih) => {
    const bugun = new Date();
    const sonTarihDate = new Date(sonTarih);
    const fark = Math.ceil((sonTarihDate - bugun) / (1000 * 60 * 60 * 24));
    return fark > 0 ? fark : 0;
};


export const getDurumRengi = (kalanGun) => {
    if (kalanGun >= 15) return "🟢";
    if (kalanGun >= 7) return "🟠";
    return "🔴";
};


export const getDurumHexRengi = (kalanGun) => {
    if (kalanGun >= 15) return '#4CAF50';
    if (kalanGun >= 7) return '#FF9800';
    return '#F44336';
};

export const getDurum = (kalanGun) => {
    if (kalanGun >= 15) return "normal";
    if (kalanGun >= 7) return "yaklaşıyor";
    return "acil";
};

const rawDavaListesi = [
    {
        id: 1,
        davaNo: "2025/123",
        muvekkil: {
            ad: "Ahmet",
            soyad: "Yılmaz",
            telefon: "+90 532 123 45 67",
            email: "ahmet.yilmaz@gmail.com",
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
        durusmaTarihi: "2025-07-31",
        itirazSuresiSonTarih: "2025-07-30",
        aciklama: "İcra takip dosyası",
        dosyaSayisi: 8,
        sonIslem: "2025-07-20T10:15:00"
    },
    {
        id: 2,
        davaNo: "2025/124",
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
        durusmaTarihi: "2025-08-15",
        itirazSuresiSonTarih: "2025-08-05",
        aciklama: "Anlaşmalı boşanma davası",
        dosyaSayisi: 15,
        sonIslem: "2025-07-18T14:22:00"
    },
    {
        id: 3,
        davaNo: "2025/125",
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
        durusmaTarihi: "2025-09-10",
        itirazSuresiSonTarih: "2025-08-20",
        aciklama: "Sözleşme ihlali",
        dosyaSayisi: 12,
        sonIslem: "2025-07-15T16:45:00"
    },
    {
        id: 4,
        davaNo: "2025/126",
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
        durusmaTarihi: "2025-07-30",
        itirazSuresiSonTarih: "2025-07-30",
        aciklama: "Trafik kazası tazminat davası",
        dosyaSayisi: 6,
        sonIslem: "2025-07-22T09:30:00"
    },
    {
        id: 5,
        davaNo: "2025/127",
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
        durusmaTarihi: "2025-08-20",
        itirazSuresiSonTarih: "2025-07-30",
        aciklama: "İşçi alacakları davası",
        dosyaSayisi: 9,
        sonIslem: "2025-07-19T11:20:00"
    },
    {
        id: 6,
        davaNo: "2025/128",
        muvekkil: {
            ad: "Zeynep",
            soyad: "Yıldız",
            telefon: "+90 537 444 55 66",
            email: "zeynep.yildiz@gmail.com",
            adres: "Seyhan Mah. Kurtuluş Cad. No:89 Seyhan/Adana",
            whatsapp: "+90 537 444 55 66"
        },
        karsiTaraf: {
            ad: "Mustafa",
            soyad: "Yıldız",
            telefon: "+90 538 555 66 77",
            email: "mustafa.yildiz@hotmail.com",
            adres: "Çukurova Mah. Barış Cad. No:156 Seyhan/Adana",
            whatsapp: "+90 538 555 66 77"
        },
        taniklar: [
            {
                ad: "Noterlik",
                soyad: "Memuru",
                telefon: "+90 322 333 44 55",
                email: "info@adananoterligi.com",
                adres: "Adana 1. Noterliği, Seyhan/Adana",
                whatsapp: "+90 322 333 44 55"
            }
        ],
        mahkeme: {
            ad: "Adana 4. Asliye",
            il: "Adana",
            adres: "Adana Adalet Sarayı, Seyhan/Adana"
        },
        davaTuru: "Miras",
        durusmaTarihi: "2025-09-05",
        itirazSuresiSonTarih: "2025-08-25",
        aciklama: "Miras taksimi davası",
        dosyaSayisi: 20,
        sonIslem: "2025-07-10T15:10:00"
    },
    {
        id: 7,
        davaNo: "2025/129",
        muvekkil: {
            ad: "Hasan",
            soyad: "Özkan",
            telefon: "+90 538 666 77 88",
            email: "hasan.ozkan@gmail.com",
            adres: "Selçuklu Mah. Mevlana Cad. No:234 Selçuklu/Konya",
            whatsapp: "+90 538 666 77 88"
        },
        karsiTaraf: {
            ad: "Belediye",
            soyad: "Başkanlığı",
            telefon: "+90 332 444 55 66",
            email: "info@konya.bel.tr",
            adres: "Konya Büyükşehir Belediyesi, Selçuklu/Konya",
            whatsapp: "+90 332 444 55 66"
        },
        taniklar: [
            {
                ad: "Imar",
                soyad: "Müdürü",
                telefon: "+90 332 555 66 77",
                email: "imar@konya.gov.tr",
                adres: "Konya İl Müdürlüğü, Selçuklu/Konya",
                whatsapp: "+90 332 555 66 77"
            }
        ],
        mahkeme: {
            ad: "Konya 3. Hukuk",
            il: "Konya",
            adres: "Konya Adalet Sarayı, Selçuklu/Konya"
        },
        davaTuru: "Gayrimenkul",
        durusmaTarihi: "2025-07-30",
        itirazSuresiSonTarih: "2025-07-30",
        aciklama: "Tapu iptali ve tescil davası",
        dosyaSayisi: 14,
        sonIslem: "2025-07-21T12:45:00"
    },
    {
        id: 8,
        davaNo: "2025/130",
        muvekkil: {
            ad: "Gülşen",
            soyad: "Arslan",
            telefon: "+90 539 888 99 00",
            email: "gulsen.arslan@gmail.com",
            adres: "Ortahisar Mah. Atatürk Cad. No:123 Ortahisar/Trabzon",
            whatsapp: "+90 539 888 99 00"
        },
        karsiTaraf: {
            ad: "Emlak",
            soyad: "Şirketi",
            telefon: "+90 462 333 44 55",
            email: "info@trabzonemlak.com",
            adres: "Ortahisar Mah. İnşaat Cad. No:67 Ortahisar/Trabzon",
            whatsapp: "+90 462 333 44 55"
        },
        taniklar: [
            {
                ad: "Müteahhit",
                soyad: "Firma",
                telefon: "+90 462 444 55 66",
                email: "info@mutaahhitfirma.com",
                adres: "Trabzon İnşaat Sitesi, Ortahisar/Trabzon",
                whatsapp: "+90 462 444 55 66"
            }
        ],
        mahkeme: {
            ad: "Trabzon 1. Asliye",
            il: "Trabzon",
            adres: "Trabzon Adalet Sarayı, Ortahisar/Trabzon"
        },
        davaTuru: "Sözleşme",
        durusmaTarihi: "2025-09-15",
        itirazSuresiSonTarih: "2025-08-10",
        aciklama: "Kira kontratı ihlali davası",
        dosyaSayisi: 7,
        sonIslem: "2025-07-16T08:15:00"
    }
];

export const davaListesi = rawDavaListesi.map(dava => {
    const kalanGun = calculateKalanGun(dava.itirazSuresiSonTarih);
    return {
        ...dava,
        durum: getDurum(kalanGun),
        durumRenk: getDurumRengi(kalanGun),
        itirazSuresi: {
            kalanGun: kalanGun,
            sonTarih: dava.itirazSuresiSonTarih
        }
    };
});

export const filterByDurum = (davalar, durum) => {
    if (durum === 'tumu') return davalar;
    return davalar.filter(dava => dava.durum === durum);
};

export const filterByMahkeme = (davalar, mahkemeTuru) => {
    return davalar.filter(dava =>
        dava.mahkeme.ad.toLowerCase().includes(mahkemeTuru.toLowerCase())
    );
};

export const searchDavalar = (davalar, searchTerm) => {
    if (!searchTerm) return davalar;
    return davalar.filter(dava =>
        dava.davaNo.includes(searchTerm) ||
        `${dava.muvekkil.ad} ${dava.muvekkil.soyad}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dava.mahkeme.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dava.davaTuru.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const sortByDurusmaTarihi = (davalar) => {
    return [...davalar].sort((a, b) => new Date(a.durusmaTarihi) - new Date(b.durusmaTarihi));
};

export const sortByItirazSuresi = (davalar) => {
    return [...davalar].sort((a, b) => a.itirazSuresi.kalanGun - b.itirazSuresi.kalanGun);
};

export const formatForFlatList = (davalar) => {
    return davalar.map(dava => ({
        ...dava,
        key: dava.id.toString(),
        title: `Dava No: ${dava.davaNo}`,
        subtitle: `${dava.muvekkil.ad} ${dava.muvekkil.soyad} - ${dava.davaTuru}`
    }));
};