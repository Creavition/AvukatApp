import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    const logoAnimation = useRef(new Animated.Value(0)).current;
    const titleAnimation = useRef(new Animated.Value(0)).current;
    const subtitleAnimation = useRef(new Animated.Value(0)).current;
    const fadeAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(logoAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(subtitleAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.delay(800),
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onFinish) {
                onFinish();
            }
        });
    }, []);

    const logoScale = logoAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1.2, 1],
    });


    const subtitleTranslateY = subtitleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
            <StatusBar barStyle="light-content" backgroundColor="#4285F4" />

            {/* Background Gradient Effect */}
            <View style={styles.gradientBackground} />

            {/* Logo Container */}
            <View style={styles.logoContainer}>
                <Animated.View
                    style={[
                        styles.logoWrapper,
                        {
                            transform: [
                                { scale: logoScale }
                            ],
                        },
                    ]}
                >
                    <Image
                        source={require('../assets/gavel.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>


            {/* Subtitle */}
            <Animated.View
                style={[
                    styles.subtitleContainer,
                    {
                        opacity: subtitleAnimation,
                        transform: [{ translateY: subtitleTranslateY }],
                    },
                ]}
            >
                <Text style={styles.subtitle}>Hukuki İşlemlerinizi Kolayca Yönetin</Text>
                <View style={{ flexDirection: "column" }}>
                    <Text style={styles.subtitle2}>• Dava Takibi     • Müvekkil Yönetimi</Text>
                    <Text style={styles.subtitle2}>• Süreç Kontrolü  • Dilekçe Oluşturma</Text>
                </View>
            </Animated.View>

        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4285F4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#4285F4',
        opacity: 0.9,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    logoWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 160,
        height: 160,
        tintColor: '#ffffff',
    },
    subtitleContainer: {
        alignItems: 'center',
        marginBottom: 80,
        paddingHorizontal: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '700',
    },
    subtitle2: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default SplashScreen;
