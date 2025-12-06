import React, { useState } from 'react';
import { LogIn, Smartphone, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../services/firebase';

export const LoginView: React.FC = () => {
    const { signInWithGoogle } = useAuth();
    const [method, setMethod] = useState<'main' | 'phone'>('main');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        }
    };

    const handlePhoneLogin = async () => {
        setError('');
        if (!phoneNumber) {
            setError('请输入手机号');
            return;
        }
        setLoading(true);
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        try {
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmResult(confirmation);
            setLoading(false);
        } catch (error: any) {
            console.error(error);
            setLoading(false);
            setError(error.message || '发送验证码失败，请检查手机号格式 (例如 +86138...)');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = undefined;
            }
        }
    };

    const handleVerifyOtp = async () => {
        setError('');
        if (!otp || !confirmResult) return;
        setLoading(true);
        try {
            await confirmResult.confirm(otp);
            // Success is handled by AuthContext onAuthStateChanged
        } catch (error: any) {
            console.error(error);
            setLoading(false);
            setError('验证码错误');
        }
    };

    const handleWeChatLogin = () => {
        alert("微信登录功能需要配置后端服务。目前仅为演示 UI。");
    };

    if (method === 'phone') {
        return (
            <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">手机验证登录</h2>
                    <p className="text-zinc-400 text-sm">请输入手机号以接收验证码</p>
                </div>

                <div className="space-y-4">
                    {!confirmResult ? (
                        <>
                            <div>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+86 138 0000 0000"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-white focus:outline-none placeholder-zinc-600"
                                />
                                <p className="text-xs text-zinc-500 mt-2 px-1">请包含国家代码，例如中国手机号需加 +86</p>
                            </div>
                            <button
                                onClick={handlePhoneLogin}
                                disabled={loading}
                                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                            >
                                {loading ? '发送中...' : '获取验证码'}
                            </button>
                            <div id="recaptcha-container"></div>
                        </>
                    ) : (
                        <>
                            <div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="输入 6 位验证码"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-white focus:outline-none text-center tracking-widest text-lg"
                                    maxLength={6}
                                />
                            </div>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                            >
                                {loading ? '验证中...' : '登录'}
                            </button>
                        </>
                    )}

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        onClick={() => { setMethod('main'); setConfirmResult(null); setError(''); }}
                        className="w-full text-zinc-500 text-sm py-2 hover:text-white transition-colors"
                    >
                        返回其他登录方式
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 animate-in fade-in duration-500">
            <button
                onClick={signInWithGoogle}
                className="w-full bg-white text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform active:scale-95"
            >
                <LogIn size={20} />
                使用 Google 登录
            </button>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setMethod('phone')}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white font-medium py-4 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                    <Smartphone size={18} />
                    手机登录
                </button>
                <button
                    onClick={handleWeChatLogin}
                    className="w-full bg-[#07c160] text-white font-medium py-4 px-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <MessageCircle size={18} />
                    微信登录
                </button>
            </div>
        </div>
    );
};

// Add type definition for window.recaptchaVerifier
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier | undefined;
    }
}
