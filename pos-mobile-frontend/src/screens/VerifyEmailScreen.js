import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ImageBackground, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { useSignUp, useAuth } from '@clerk/clerk-expo';

const BG = 'https://raw.githubusercontent.com/khadkamhn/day-01-login-form/master/img/bg.jpg';

export default function VerifyEmailScreen() {
  const { signUp, isLoaded } = useSignUp();
  const { setActive } = useAuth();
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      await setActive({
        session: completeSignUp.createdSessionId,
      });
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Verification Failed',
        err.errors?.[0]?.longMessage || 'Invalid verification code',
      );
    }
  };

  return (
    <ImageBackground source={{ uri: BG }} style={styles.bg} resizeMode="cover">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.sub}>
              Enter the verification code sent to your email.
            </Text>

            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              placeholder="123456"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex:   { flex: 1 },
  bg:     { flex: 1, backgroundColor: '#c8c8c8' },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: {
    width: '100%', maxWidth: 400,
    backgroundColor: 'rgba(40,57,101,0.92)',
    borderRadius: 8, padding: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 10,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 8 },
  sub:   { fontSize: 14, color: '#aaa', marginBottom: 24 },
  label: {
    color: '#aaa', fontSize: 11, fontWeight: '600',
    textTransform: 'uppercase', marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25,
    paddingHorizontal: 20, paddingVertical: 14,
    color: '#fff', fontSize: 15, marginBottom: 14,
  },
  button: {
    backgroundColor: '#2563eb', borderRadius: 25,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  buttonText: {
    color: '#fff', fontWeight: '700', fontSize: 14,
    textTransform: 'uppercase', letterSpacing: 1,
  },
});
