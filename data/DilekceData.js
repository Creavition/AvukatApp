export const dilekceKategorileri = [
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
            },
            {
                id: 13,
                baslik: "İcra İtiraz Dilekçesi",
                aciklama: "İcra takibine itiraz için",
                sablon: `{{icra_mudurlugu}}'ne

İCRA İTİRAZ DİLEKÇESİ

İtiraz Eden : {{itiraz_eden_ad_soyad}}
             {{itiraz_eden_adres}}
             T.C. Kimlik No: {{itiraz_eden_tc}}

Takip No    : {{takip_no}}
Alacaklı    : {{alacakli_ad_soyad}}

KONU       : İCRA TAKİBİNE İTİRAZ

AÇIKLAMALAR:
{{takip_tarihi}} tarihinde başlatılan {{takip_no}} numaralı icra takibine itiraz edilmektedir.

İtiraz gerekçeleri:
1. {{itiraz_gerekce_1}}
2. {{itiraz_gerekce_2}}

HUKUKİ SEBEPLER:
İcra ve İflas Kanunu'nun 67. maddesi gereğince...

TALEP:
Bu nedenlerle, icra takibinin durdurulmasını ve gerekli işlemin yapılmasını talep ederim.

Tarih: {{tarih}}
                                          {{itiraz_eden_ad_soyad}}
                                               İmza`
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
            },
            {
                id: 22,
                baslik: "İdari Başvuru Dilekçesi",
                aciklama: "İdari makamlara başvuru için",
                sablon: `{{idari_makam}}'na

İDARİ BAŞVURU DİLEKÇESİ

Başvuran  : {{basvuran_ad_soyad}}
           {{basvuran_adres}}
           T.C. Kimlik No: {{basvuran_tc}}
           Telefon: {{basvuran_telefon}}

KONU     : {{basvuru_konusu}}

AÇIKLAMALAR:
{{basvuru_aciklamasi}}

İLGİLİ MEVZUAT:
{{ilgili_kanun}} gereğince...

TALEP:
{{talep_metni}}

Tarih: {{tarih}}
                                          {{basvuran_ad_soyad}}
                                             İmza`
            }
        ]
    },
    {
        id: 3,
        baslik: "İş Hukuku Dilekçeleri",
        ikon: "business",
        renk: "#4CAF50",
        sablonlar: [
            {
                id: 31,
                baslik: "İşçi Alacakları Davası",
                aciklama: "İşçi alacakları için dava dilekçesi",
                sablon: `{{mahkeme_adi}}'ne

DAVA DİLEKÇESİ

Davacı    : {{isci_ad_soyad}}
           {{isci_adres}}
           T.C. Kimlik No: {{isci_tc}}

Davalı    : {{isveren_ad_soyad}}
           {{isveren_adres}}
           Vergi No: {{isveren_vergi_no}}

Vekili    : {{avukat_ad_soyad}}
           {{avukat_adres}}
           Baro Sicil No: {{baro_sicil}}

KONU     : İŞÇİ ALACAKLARI DAVASI

AÇIKLAMALAR:
Davacı, davalı işyerinde {{ise_baslama_tarihi}} - {{isten_ayrilma_tarihi}} tarihleri arasında {{gorev_unvani}} olarak çalışmıştır.

Aylık ücret: {{aylik_ucret}} TL
Çalışma süresi: {{calisma_suresi}}

ALACAKLAR:
1. Kıdem tazminatı: {{kidem_tazminati}} TL
2. İhbar tazminatı: {{ihbar_tazminati}} TL
3. Fazla mesai ücreti: {{fazla_mesai}} TL
4. Yıllık izin ücreti: {{yillik_izin}} TL

HUKUKİ SEBEPLER:
İş Kanunu'nun ilgili maddeleri gereğince...

TALEP:
Bu nedenlerle, davalının davacıya toplam {{toplam_alacak}} TL alacağını yasal faizi ile birlikte ödemesine karar verilmesini talep ederim.

Tarih: {{tarih}}
                                          {{avukat_ad_soyad}}
                                            Avukat`
            }
        ]
    },
    {
        id: 4,
        baslik: "Ticaret Hukuku Dilekçeleri",
        ikon: "store",
        renk: "#FF9800",
        sablonlar: [
            {
                id: 41,
                baslik: "Ticari Alacak Davası",
                aciklama: "Ticari alacak davası için",
                sablon: `{{mahkeme_adi}}'ne

DAVA DİLEKÇESİ

Davacı    : {{davaci_unvan}}
           {{davaci_adres}}
           Vergi No: {{davaci_vergi_no}}

Davalı    : {{davali_unvan}}
           {{davali_adres}}
           Vergi No: {{davali_vergi_no}}

Vekili    : {{avukat_ad_soyad}}
           {{avukat_adres}}
           Baro Sicil No: {{baro_sicil}}

KONU     : TİCARİ ALACAK DAVASI

AÇIKLAMALAR:
Taraflar arasında {{sozlesme_tarihi}} tarihinde {{mal_hizmet}} konusunda ticari sözleşme yapılmıştır.

Sözleşme bedeli: {{sozlesme_bedeli}} TL
Teslim tarihi: {{teslim_tarihi}}
Ödeme tarihi: {{odeme_tarihi}}

{{sozlesme_detaylari}}

HUKUKİ SEBEPLER:
Türk Ticaret Kanunu ve Türk Borçlar Kanunu gereğince...

TALEP:
Bu nedenlerle, davalının davacıya {{alacak_miktari}} TL asıl alacak ile birlikte %30 temerrüt faizi ve vekalet ücretini ödemesine karar verilmesini talep ederim.

Tarih: {{tarih}}
                                          {{avukat_ad_soyad}}
                                            Avukat`
            }
        ]
    }
];
