import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function SablonForm({ route, navigation }) {
    const { sablon } = route.params;
    const [formData, setFormData] = useState({});
    const [formFields, setFormFields] = useState([]);
    const [doldurulmusMetin, setDoldurulmusMetin] = useState('');

    useEffect(() => {
        if (sablon && sablon.sablon) {
            const regex = /\{\{([^}]+)\}\}/g;
            const fields = [];
            let match;

            while ((match = regex.exec(sablon.sablon)) !== null) {
                const fieldName = match[1];
                if (!fields.find(f => f.name === fieldName)) {
                    fields.push({
                        name: fieldName,
                        label: formatFieldLabel(fieldName),
                        type: getFieldType(fieldName),
                        required: true
                    });
                }
            }

            setFormFields(fields);

            const initialData = {};
            fields.forEach(field => {
                initialData[field.name] = '';
            });
            setFormData(initialData);
        }
    }, [sablon]);

    const formatFieldLabel = (fieldName) => {
        const labelMap = {
            'mahkeme_adi': 'Mahkeme Adı',
            'davaci_ad_soyad': 'Davacı Adı Soyadı',
            'davaci_adres': 'Davacı Adresi',
            'davaci_tc': 'Davacı T.C. Kimlik No',
            'davali_ad_soyad': 'Davalı Adı Soyadı',
            'davali_adres': 'Davalı Adresi',
            'davali_tc': 'Davalı T.C. Kimlik No',
            'avukat_ad_soyad': 'Avukat Adı Soyadı',
            'avukat_adres': 'Avukat Adresi',
            'baro_sicil': 'Baro Sicil No',
            'evlilik_tarihi': 'Evlilik Tarihi',
            'evlilik_yeri': 'Evlilik Yeri',
            'cocuk_durumu': 'Çocuk Durumu',
            'ayrilik_tarihi': 'Ayrılık Tarihi',
            'tarih': 'Tarih',
            'sozlesme_tarihi': 'Sözleşme Tarihi',
            'sozlesme_konusu': 'Sözleşme Konusu',
            'odeme_tarihi': 'Ödeme Tarihi',
            'alacak_miktari': 'Alacak Miktarı',
            'cumhuriyet_savciligi': 'Cumhuriyet Savcılığı',
            'sikayetci_ad_soyad': 'Şikayetçi Adı Soyadı',
            'sikayetci_adres': 'Şikayetçi Adresi',
            'sikayetci_tc': 'Şikayetçi T.C. Kimlik No',
            'sikayetci_telefon': 'Şikayetçi Telefon',
            'supheli_ad_soyad': 'Şüpheli Adı Soyadı',
            'supheli_adres': 'Şüpheli Adresi',
            'supheli_tc': 'Şüpheli T.C. Kimlik No',
            'suc_turu': 'Suç Türü',
            'olay_tarihi': 'Olay Tarihi',
            'olay_yeri': 'Olay Yeri',
            'olay_aciklamasi': 'Olay Açıklaması',
            'madde_no': 'Madde No',
            'icra_mudurlugu': 'İcra Müdürlüğü',
            'itiraz_eden_ad_soyad': 'İtiraz Eden Adı Soyadı',
            'itiraz_eden_adres': 'İtiraz Eden Adresi',
            'itiraz_eden_tc': 'İtiraz Eden T.C. Kimlik No',
            'alacakli_ad_soyad': 'Alacaklı Adı Soyadı',
            'alacakli_adres': 'Alacaklı Adresi',
            'dosya_no': 'Dosya No',
            'takip_tarihi': 'Takip Tarihi',
            'takip_no': 'Takip No',
            'itiraz_gerekceleri': 'İtiraz Gerekçeleri',
            'baro_adi': 'Baro Adı',
            'basvuran_ad_soyad': 'Başvuran Adı Soyadı',
            'basvuran_adres': 'Başvuran Adresi',
            'basvuran_tc': 'Başvuran T.C. Kimlik No',
            'basvuran_telefon': 'Başvuran Telefon',
            'basvuran_email': 'Başvuran E-posta',
            'universite_adi': 'Üniversite Adı',
            'mezuniyet_tarihi': 'Mezuniyet Tarihi'
        };

        return labelMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getFieldType = (fieldName) => {
        return 'text';
    };

    const updateFormData = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const fillTemplate = () => {
        let filledText = sablon.sablon;

        const emptyFields = formFields.filter(field =>
            field.required && (!formData[field.name] || formData[field.name].trim() === '')
        );

        if (emptyFields.length > 0) {
            Alert.alert(
                'Eksik Bilgiler',
                `Lütfen şu alanları doldurun: ${emptyFields.map(f => f.label).join(', ')}`,
                [{ text: 'Tamam' }]
            );
            return;
        }

        formFields.forEach(field => {
            const regex = new RegExp(`\\{\\{${field.name}\\}\\}`, 'g');
            filledText = filledText.replace(regex, formData[field.name] || '');
        });

        setDoldurulmusMetin(filledText);

        navigation.navigate('SablonSonuc', {
            sablon: sablon,
            doldurulmusMetin: filledText,
            formData: formData
        });
    };


    const renderFormField = (field) => {
        const value = formData[field.name] || '';

        return (
            <View key={field.name} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                    {field.label}
                    {field.required && <Text style={styles.required}> *</Text>}
                </Text>

                {field.type === 'multiline' ? (
                    <TextInput
                        style={[styles.textInput, styles.multilineInput]}
                        value={value}
                        onChangeText={(text) => updateFormData(field.name, text)}
                        placeholder={`${field.label} giriniz...`}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                ) : (
                    <TextInput
                        style={styles.textInput}
                        value={value}
                        onChangeText={(text) => updateFormData(field.name, text)}
                        placeholder={`${field.label} giriniz...`}
                    />
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Şablon Doldur</Text>
                <TouchableOpacity
                    style={styles.fillButton}
                    onPress={fillTemplate}
                >
                    <MaterialIcons name="check" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Şablon Bilgisi */}
            <View style={styles.templateInfo}>
                <MaterialIcons name="description" size={24} color="#2196F3" />
                <View style={styles.templateDetails}>
                    <Text style={styles.templateTitle}>{sablon.baslik}</Text>
                    <Text style={styles.templateDescription}>{sablon.aciklama}</Text>
                </View>
            </View>

            {/* Form Alanları */}
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.formContent}>
                    <Text style={styles.sectionTitle}>
                        Dilekçe Bilgileri ({formFields.length} alan)
                    </Text>

                    {formFields.map(field => renderFormField(field))}

                    {/* Alt boşluk */}
                    <View style={styles.bottomSpacing} />
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
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
    fillButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        padding: screenWidth * 0.015,
    },
    templateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 12,
        elevation: 2,
    },
    templateDetails: {
        flex: 1,
        marginLeft: 12,
    },
    templateTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    templateDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    formContainer: {
        flex: 1,
        marginTop: 10,
    },
    formContent: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    fieldContainer: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#F44336',
    },
    textInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    bottomSpacing: {
        height: 100,
    },
    bottomContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    previewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 10,
    },
    previewButtonText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
        fontWeight: '500',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
});
