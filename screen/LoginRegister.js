import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    StatusBar,
    ScrollView
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const LoginRegister = ({ navigation, onLoginSuccess }) => {
    const [currentScreen, setCurrentScreen] = useState('login');
    const [loading, setLoading] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const handleLogin = async () => {
        if (!loginData.email || !loginData.password) {
            Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
            return;
        }

        setLoading(true);

        try {
            const registeredUsers = await AsyncStorage.getItem('registeredUsers');
            const users = registeredUsers ? JSON.parse(registeredUsers) : [];

            const user = users.find(u =>
                u.email.toLowerCase() === loginData.email.toLowerCase() &&
                u.password === loginData.password
            );

            if (!user) {
                Alert.alert('Hata', 'E-posta veya şifre hatalı! Lütfen kayıt olun.');
                setLoading(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

            await AsyncStorage.multiSet([
                ['userToken', 'dummy_token_' + Date.now()],
                ['isLoggedIn', 'true'],
                ['userEmail', user.email],
                ['userName', user.fullName]
            ]);

            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Hata', 'Giriş yapılamadı. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!registerData.fullName || !registerData.email ||
            !registerData.password || !registerData.confirmPassword) {
            Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            Alert.alert('Uyarı', 'Şifreler eşleşmiyor.');
            return;
        }

        if (registerData.password.length < 6) {
            Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);

        try {
            const registeredUsers = await AsyncStorage.getItem('registeredUsers');
            const users = registeredUsers ? JSON.parse(registeredUsers) : [];

            const existingUser = users.find(u =>
                u.email.toLowerCase() === registerData.email.toLowerCase()
            );

            if (existingUser) {
                Alert.alert('Hata', 'Bu e-posta adresi zaten kayıtlı!');
                setLoading(false);
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                fullName: registerData.fullName,
                email: registerData.email,
                password: registerData.password,
                phone: registerData.phone,
                registeredAt: new Date().toISOString()
            };

            users.push(newUser);
            await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));

            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert('Başarılı', 'Hesabınız oluşturuldu! Şimdi giriş yapabilirsiniz.', [
                {
                    text: 'Tamam',
                    onPress: () => {

                        setRegisterData({
                            fullName: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            phone: ''
                        });

                        setCurrentScreen('login');
                    }
                }
            ]);
        } catch (error) {
            console.error('Register error:', error);
            Alert.alert('Hata', 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const renderLoginScreen = () => (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

            <LinearGradient
                colors={['#1976D2', '#2196F3', '#42A5F5']}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <MaterialIcons name="gavel" size={60} color="#FFFFFF" />

                            <Text style={styles.appSubtitle}>Hukuki İşlemleriniz Güvende</Text>
                        </View>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Giriş Yap</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-posta</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#64B5F6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={loginData.email}
                                    onChangeText={(text) => setLoginData({ ...loginData, email: text })}
                                    placeholder="E-posta adresinizi girin"
                                    placeholderTextColor="#B0BEC5"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Şifre</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#64B5F6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={loginData.password}
                                    onChangeText={(text) => setLoginData({ ...loginData, password: text })}
                                    placeholder="Şifrenizi girin"
                                    placeholderTextColor="#B0BEC5"
                                    secureTextEntry={!showLoginPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                                >
                                    <Ionicons
                                        name={showLoginPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#64B5F6"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.disabledButton]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.loginButtonText}>Giriş Yap</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>veya</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.switchButton}
                            onPress={() => setCurrentScreen('register')}
                        >
                            <Text style={styles.switchButtonText}>Hesap Oluştur</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );

    const renderRegisterScreen = () => (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

            <LinearGradient
                colors={['#1976D2', '#2196F3', '#42A5F5']}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <MaterialIcons name="person-add" size={60} color="#FFFFFF" />
                            <Text style={styles.appSubtitle}>Hesap Oluşturun</Text>
                        </View>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Kayıt Ol</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ad Soyad</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#64B5F6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={registerData.fullName}
                                    onChangeText={(text) => setRegisterData({ ...registerData, fullName: text })}
                                    placeholder="Ad ve soyadınızı girin"
                                    placeholderTextColor="#B0BEC5"
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-posta</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#64B5F6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={registerData.email}
                                    onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
                                    placeholder="E-posta adresinizi girin"
                                    placeholderTextColor="#B0BEC5"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Telefon</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color="#64B5F6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={registerData.phone}
                                    onChangeText={(text) => setRegisterData({ ...registerData, phone: text })}
                                    placeholder="Telefon numaranız"
                                    placeholderTextColor="#B0BEC5"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Şifre</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#64B5F6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={registerData.password}
                                    onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
                                    placeholder="Şifrenizi girin"
                                    placeholderTextColor="#B0BEC5"
                                    secureTextEntry={!showRegisterPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowRegisterPassword(!showRegisterPassword)}
                                >
                                    <Ionicons
                                        name={showRegisterPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#64B5F6"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Şifre Tekrar</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#64B5F6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={registerData.confirmPassword}
                                    onChangeText={(text) => setRegisterData({ ...registerData, confirmPassword: text })}
                                    placeholder="Şifrenizi tekrar girin"
                                    placeholderTextColor="#B0BEC5"
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#64B5F6"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.disabledButton]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.loginButtonText}>Hesap Oluştur</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>veya</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.switchButton}
                            onPress={() => setCurrentScreen('login')}
                        >
                            <Text style={styles.switchButtonText}>Giriş Yap</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );

    return (
        <View style={styles.mainContainer}>
            {currentScreen === 'login' ? renderLoginScreen() : renderRegisterScreen()}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    logoContainer: {
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 15,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    appSubtitle: {
        fontSize: 16,
        color: '#E3F2FD',
        marginTop: 8,
        textAlign: 'center',
        opacity: 0.9,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        marginHorizontal: 20,
        borderRadius: 25,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    formTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1976D2',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    halfInputGroup: {
        flex: 1,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#37474F',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FDFF',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: '#2196F3',
        shadowColor: '#2196F3',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#263238',
        paddingVertical: 10,
        fontWeight: '500',
    },
    eyeButton: {
        padding: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: '#1976D2',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#1976D2',
        borderRadius: 15,
        paddingVertical: 10,
        alignItems: 'center',
        shadowColor: '#1976D2',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.7,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        fontSize: 14,
        color: '#757575',
        marginHorizontal: 15,
        fontWeight: '500',
    },
    switchButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#1976D2',
        borderRadius: 15,
        paddingVertical: 10,
        alignItems: 'center',
    },
    switchButtonText: {
        color: '#1976D2',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginRegister;
