import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ImageBackground, KeyboardAvoidingView,
  Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';

const BG = 'https://raw.githubusercontent.com/khadkamhn/day-01-login-form/master/img/bg.jpg';

// ── DEV BYPASS ───────────────────────────────────────────────────────────────
// Set to false before going to production
const DEV_MODE = true;
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const [tab,        setTab]        = useState('signin');
  const [loading,    setLoading]    = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
  const [signUpDone, setSignUpDone] = useState(false);

  const [siEmail, setSiEmail] = useState('');
  const [siPass,  setSiPass]  = useState('');
  const [suEmail,  setSuEmail]  = useState('');
  const [suPass,   setSuPass]   = useState('');
  const [suRepeat, setSuRepeat] = useState('');

  // ── DEV BYPASS HANDLER ───────────────────────────────────────────────────
  // Bypasses Clerk entirely — sets a fake isSignedIn flag in the navigator
  // by importing and calling the LocationContext setter directly.
  // RootNavigator checks isSignedIn from Clerk — so instead we use a local
  // context override passed via prop from App.js (see App.js devBypass prop).
  const handleDevBypass = () => {
    if (typeof global.__devBypass === 'function') {
      global.__devBypass();
    }
  };

  // ── SIGN IN ──────────────────────────────────────────────────────────────
  const handleSignIn = async () => {
    if (!signInLoaded) return;
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: siEmail, password: siPass });
      if (result.status === 'complete') {
        try {
          await setSignInActive({ session: result.createdSessionId });
        } catch (e) {
          console.warn('[Clerk] setActive non-fatal:', e.message);
        }
      } else {
        Alert.alert('Sign In Incomplete', `Status: ${result.status}`);
      }
    } catch (err) {
      Alert.alert('Sign In Failed', err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── SIGN UP ──────────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!signUpLoaded) return;
    if (suPass !== suRepeat) { Alert.alert('Error', 'Passwords do not match'); return; }
    if (suPass.length < 8)   { Alert.alert('Error', 'Min. 8 characters'); return; }
    setLoading(true);
    try {
      const result = await signUp.create({ emailAddress: suEmail, password: suPass });
      if (result.status === 'complete') {
        try {
          await setSignUpActive({ session: result.createdSessionId });
        } catch (e) {
          console.warn('[Clerk] setActive non-fatal:', e.message);
          setSignUpDone(true);
          setTab('signin');
          setSiEmail(suEmail);
        }
      } else {
        Alert.alert('Sign Up Incomplete', `Status: ${result.status}\n\nEnsure "Verify at sign-up" is OFF in Clerk Dashboard.`);
      }
    } catch (err) {
      Alert.alert('Sign Up Failed', err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={{ uri: BG }} style={s.bg} resizeMode="cover">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.card}>

            {/* ── DEV BYPASS BUTTON ── */}
            {DEV_MODE && (
              <TouchableOpacity style={s.devBtn} onPress={handleDevBypass} activeOpacity={0.8}>
                <Text style={s.devBtnText}>⚡ DEV — Skip Login</Text>
              </TouchableOpacity>
            )}

            {/* ── TABS ── */}
            <View style={s.tabs}>
              <TouchableOpacity onPress={() => { setTab('signin'); setSignUpDone(false); }}>
                <Text style={[s.tab, tab === 'signin' && s.tabActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setTab('signup'); setSignUpDone(false); }}>
                <Text style={[s.tab, tab === 'signup' && s.tabActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {signUpDone && (
              <View style={s.successBanner}>
                <Text style={s.successText}>✅ Account created! Enter your password below to sign in.</Text>
              </View>
            )}

            {/* ── SIGN IN ── */}
            {tab === 'signin' && (
              <View>
                <Text style={s.label}>Email</Text>
                <TextInput style={s.input} value={siEmail} onChangeText={setSiEmail}
                  autoCapitalize="none" keyboardType="email-address"
                  placeholderTextColor="#aaa" placeholder="you@example.com" />

                <Text style={s.label}>Password</Text>
                <TextInput style={s.input} value={siPass} onChangeText={setSiPass}
                  secureTextEntry placeholderTextColor="#aaa" placeholder="••••••••" />

                <TouchableOpacity style={s.checkRow} onPress={() => setKeepSigned(v => !v)} activeOpacity={0.7}>
                  <View style={[s.checkbox, keepSigned && s.checkboxChecked]}>
                    {keepSigned && <Text style={s.checkmark}>✓</Text>}
                  </View>
                  <Text style={s.checkLabel}>Keep me Signed in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[s.button, loading && s.buttonDisabled]}
                  onPress={handleSignIn} disabled={loading} activeOpacity={0.8}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Sign In</Text>}
                </TouchableOpacity>

                <View style={s.hr} />
                <TouchableOpacity><Text style={s.footLink}>Forgot Password?</Text></TouchableOpacity>
              </View>
            )}

            {/* ── SIGN UP ── */}
            {tab === 'signup' && (
              <View>
                <Text style={s.label}>Email Address</Text>
                <TextInput style={s.input} value={suEmail} onChangeText={setSuEmail}
                  keyboardType="email-address" autoCapitalize="none"
                  placeholderTextColor="#aaa" placeholder="you@example.com" />

                <Text style={s.label}>Password</Text>
                <TextInput style={s.input} value={suPass} onChangeText={setSuPass}
                  secureTextEntry placeholderTextColor="#aaa" placeholder="Min. 8 characters" />

                <Text style={s.label}>Repeat Password</Text>
                <TextInput style={s.input} value={suRepeat} onChangeText={setSuRepeat}
                  secureTextEntry placeholderTextColor="#aaa" placeholder="••••••••" />

                <TouchableOpacity style={[s.button, loading && s.buttonDisabled]}
                  onPress={handleSignUp} disabled={loading} activeOpacity={0.8}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Sign Up</Text>}
                </TouchableOpacity>

                <View style={s.hr} />
                <TouchableOpacity onPress={() => setTab('signin')}>
                  <Text style={s.footLink}>Already a Member?</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  flex:   { flex: 1 },
  bg:     { flex: 1, backgroundColor: '#c8c8c8' },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card:   { width: '100%', maxWidth: 400, backgroundColor: 'rgba(40,57,101,0.92)', borderRadius: 8, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10 },

  devBtn:     { backgroundColor: 'rgba(255,200,0,0.15)', borderWidth: 1.5, borderColor: '#f59e0b', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 20 },
  devBtnText: { color: '#fbbf24', fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },

  tabs:      { flexDirection: 'row', marginBottom: 24 },
  tab:       { fontSize: 18, fontWeight: '600', color: '#6a6f8c', marginRight: 20, paddingBottom: 6 },
  tabActive: { color: '#fff', borderBottomWidth: 2, borderBottomColor: '#1161ee' },

  successBanner: { backgroundColor: 'rgba(22,163,74,0.25)', borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(22,163,74,0.5)' },
  successText:   { color: '#86efac', fontSize: 13, lineHeight: 18 },

  label: { color: '#aaa', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 14, color: '#fff', fontSize: 15, marginBottom: 14 },

  checkRow:        { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox:        { width: 16, height: 16, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#1161ee' },
  checkmark:       { color: '#fff', fontSize: 10, fontWeight: '700' },
  checkLabel:      { color: '#aaa', fontSize: 13 },

  button:         { backgroundColor: '#1161ee', borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  buttonDisabled: { opacity: 0.6 },
  buttonText:     { color: '#fff', fontWeight: '700', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },

  hr:       { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 28 },
  footLink: { color: '#6a6f8c', textAlign: 'center', fontSize: 14 },
});
