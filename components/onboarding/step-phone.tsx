/**
 * Step 0 — Phone verification with OTP
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { C } from './constants';
import { useEntrance } from './hooks';

interface Props {
  onNext: () => void;
}

export function StepPhone({ onNext }: Props) {
  const { width: screenW } = useWindowDimensions();
  const [phone, setPhone]     = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [timer, setTimer]     = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]).current;

  const h = useEntrance(0);
  const f = useEntrance(200);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // Animated icon
  const iconScale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(iconScale, {
      toValue: 1, friction: 6, tension: 50, delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSendOtp = () => {
    if (phone.length < 6) return;
    setOtpSent(true);
    setTimer(30);
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next
    if (text && index < 5) {
      otpRefs[index + 1]?.focus();
    }
    // Auto-submit on last digit
    if (index === 5 && text) {
      onNext();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1]?.focus();
    }
  };

  const btnScale = useRef(new Animated.Value(1)).current;

  return (
    <View style={s.container}>
      <Animated.View style={[s.iconWrap, { transform: [{ scale: iconScale }] }]}>
        <View style={s.phoneShape}>
          <View style={s.phoneNotch} />
          <View style={s.phoneScreen} />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: h.opacity, transform: [{ translateY: h.translateY }] }}>
        <Text style={s.title}>Verify your phone</Text>
        <Text style={[s.subtitle, { maxWidth: screenW * 0.8 }]}>
          {otpSent
            ? `Enter the 6-digit code sent to ${phone}`
            : "We'll send you a verification code to get started"}
        </Text>
      </Animated.View>

      <Animated.View style={[s.formArea, { opacity: f.opacity, transform: [{ translateY: f.translateY }] }]}>
        {!otpSent ? (
          <>
            <View style={s.phoneRow}>
              <View style={s.countryCode}>
                <Text style={s.countryText}>+1</Text>
              </View>
              <TextInput
                style={s.phoneInput}
                placeholder="Phone number"
                placeholderTextColor={C.subtle}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={15}
              />
            </View>
            <Pressable
              onPressIn={() => Animated.spring(btnScale, { toValue: 0.95, friction: 8, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
              onPress={handleSendOtp}
            >
              <Animated.View style={[s.btn, phone.length < 6 && s.btnDisabled, { transform: [{ scale: btnScale }] }]}>
                <Text style={s.btnText}>Send Code</Text>
              </Animated.View>
            </Pressable>
          </>
        ) : (
          <>
            <View style={s.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={el => (otpRefs[i] = el)}
                  style={[s.otpBox, digit ? s.otpBoxFilled : null]}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, i)}
                  onKeyPress={e => handleOtpKeyPress(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            <View style={s.resendRow}>
              {timer > 0 ? (
                <Text style={s.timerText}>Resend in {timer}s</Text>
              ) : (
                <Pressable onPress={() => setTimer(30)}>
                  <Text style={s.resendText}>Resend code</Text>
                </Pressable>
              )}
            </View>

            <Pressable onPress={onNext}>
              <View style={s.btn}>
                <Text style={s.btnText}>Verify</Text>
              </View>
            </Pressable>
          </>
        )}
      </Animated.View>

      <Text style={s.legalText}>
        By continuing, you agree to receive SMS messages. Message & data rates may apply.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },

  iconWrap: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: C.accentBg, alignItems: 'center', justifyContent: 'center',
    marginBottom: 28, alignSelf: 'center',
  },
  phoneShape: {
    width: 26, height: 38, borderRadius: 6,
    borderWidth: 2.5, borderColor: C.accent,
    alignItems: 'center', paddingTop: 4,
  },
  phoneNotch: {
    width: 10, height: 2.5, borderRadius: 1.5, backgroundColor: C.accent, opacity: 0.5,
  },
  phoneScreen: {
    width: 16, height: 18, borderRadius: 2,
    backgroundColor: C.accent, opacity: 0.15, marginTop: 4,
  },

  title: {
    fontSize: 28, fontWeight: '800', color: C.ink,
    letterSpacing: -1.5, textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontSize: 16, lineHeight: 24, color: C.muted,
    textAlign: 'center', marginBottom: 36,
    alignSelf: 'center',
  },

  formArea: { gap: 20 },

  phoneRow: { flexDirection: 'row', gap: 10 },
  countryCode: {
    backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center',
  },
  countryText: { fontSize: 16, fontWeight: '600', color: C.ink },
  phoneInput: {
    flex: 1, backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 14, paddingHorizontal: 22, paddingVertical: 16,
    fontSize: 16, color: C.ink,
  },

  btn: {
    backgroundColor: C.accent, paddingVertical: 18, borderRadius: 14,
    alignItems: 'center',
    boxShadow: '0px 8px 16px rgba(99, 91, 255, 0.25)',
    elevation: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 17, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },

  otpRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 10,
  },
  otpBox: {
    width: 48, height: 58, borderRadius: 14,
    backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border,
    textAlign: 'center', fontSize: 22, fontWeight: '700', color: C.ink,
  },
  otpBoxFilled: {
    borderColor: C.accent, backgroundColor: C.accentBg,
  },

  resendRow: { alignItems: 'center', marginTop: 4 },
  timerText: { fontSize: 14, color: C.subtle, fontWeight: '500' },
  resendText: { fontSize: 14, color: C.accent, fontWeight: '600' },

  legalText: {
    fontSize: 12, color: C.subtle, textAlign: 'center',
    marginTop: 'auto', paddingBottom: 16, lineHeight: 18,
    paddingHorizontal: 12,
  },
});
