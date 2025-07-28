import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    ScrollView,
    StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Profile = ({ onLogout }) => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        loginDate: ''
    });

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        try {
            const userName = await AsyncStorage.getItem('userName');
            const userEmail = await AsyncStorage.getItem('userEmail');
            const userToken = await AsyncStorage.getItem('userToken');

            let loginDate = 'Bilinmiyor';
            if (userToken && userToken.includes('_')) {
                const timestamp = userToken.split('_').pop();
                if (timestamp) {
                    loginDate = new Date(parseInt(timestamp)).toLocaleDateString('tr-TR');
                }
            }

            setUserInfo({
                name: userName || 'Kullanıcı',
                email: userEmail || '',
                loginDate: loginDate
            });
        } catch (error) {
            console.error('Kullanıcı bilgileri yüklenemedi:', error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Uygulamadan çıkmak istediğinizden emin misiniz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel'
                },
                {
                    text: 'Çıkış Yap',
                    style: 'destructive',
                    onPress: () => {
                        if (onLogout) {
                            onLogout();
                        }
                    }
                }
            ]
        );
    };

    const settingsOptions = [
        {
            id: 1,
            title: 'Hesap Bilgileri',
            subtitle: 'Kişisel bilgilerinizi düzenleyin',
            icon: 'person-outline',
            onPress: () => Alert.alert('Bilgi', 'Hesap bilgileri')
        },
        {
            id: 2,
            title: 'Bildirimler',
            subtitle: 'Bildirim ayarlarınızı yönetin',
            icon: 'notifications-outline',
            onPress: () => Alert.alert('Bilgi', 'Bildirim ayarları')
        },
        {
            id: 3,
            title: 'Güvenlik',
            subtitle: 'Şifre ve güvenlik ayarları',
            icon: 'shield-outline',
            onPress: () => Alert.alert('Bilgi', 'Güvenlik ayarları')
        },
        {
            id: 4,
            title: 'Yedekleme',
            subtitle: 'Verilerinizi yedekleyin',
            icon: 'cloud-upload-outline',
            onPress: () => Alert.alert('Bilgi', 'Yedekleme')
        },
    ];

    return (
        <View style={styles.container}>

            {/* Header with Gradient */}
            <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.header}
            >
                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        <MaterialIcons name="account-circle" size={80} color="#fff" />
                    </View>
                    <Text style={styles.userName}>{userInfo.name}</Text>
                    <Text style={styles.userEmail}>{userInfo.email}</Text>
                </View>
            </LinearGradient>

            {/* Settings List */}
            <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Ayarlar</Text>

                {settingsOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.settingItem}
                        onPress={option.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name={option.icon} size={24} color="#2196F3" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingTitle}>{option.title}</Text>
                                <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                ))}

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                    <Text style={styles.logoutText}>Çıkış Yap</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingVertical: screenHeight * 0.02,
        paddingHorizontal: screenWidth * 0.05,
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: screenHeight * 0.02,
    },
    userName: {
        fontSize: screenWidth * 0.06,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: screenHeight * 0.01,
    },
    userEmail: {
        fontSize: screenWidth * 0.04,
        color: '#E3F2FD',
        marginBottom: screenHeight * 0.005,
    },
    loginDate: {
        fontSize: screenWidth * 0.035,
        color: '#BBDEFB',
    },
    settingsContainer: {
        flex: 1,
        paddingHorizontal: screenWidth * 0.05,
        paddingTop: screenHeight * 0.03,
    },
    sectionTitle: {
        fontSize: screenWidth * 0.045,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: screenHeight * 0.02,
    },
    settingItem: {
        backgroundColor: '#fff',
        borderRadius: screenWidth * 0.03,
        padding: screenWidth * 0.04,
        marginBottom: screenHeight * 0.015,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingTextContainer: {
        marginLeft: screenWidth * 0.04,
        flex: 1,
    },
    settingTitle: {
        fontSize: screenWidth * 0.04,
        fontWeight: '600',
        color: '#333',
        marginBottom: screenHeight * 0.005,
    },
    settingSubtitle: {
        fontSize: screenWidth * 0.033,
        color: '#666',
    },
    logoutButton: {
        backgroundColor: '#F44336',
        borderRadius: screenWidth * 0.03,
        padding: screenWidth * 0.04,
        marginTop: screenHeight * 0.03,
        marginBottom: screenHeight * 0.02,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: screenWidth * 0.045,
        fontWeight: 'bold',
        marginLeft: screenWidth * 0.02,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: screenHeight * 0.03,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginTop: screenHeight * 0.02,
    },
    appInfoText: {
        fontSize: screenWidth * 0.04,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: screenHeight * 0.005,
    },
    appVersion: {
        fontSize: screenWidth * 0.035,
        color: '#999',
    },
});

export default Profile;
