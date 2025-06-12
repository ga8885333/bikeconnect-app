import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { login, register, loginWithGoogle, loginWithPhone, verifyPhoneCode } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneVerification, setPhoneVerification] = useState({
    confirmationResult: null,
    verificationCode: '',
    phoneNumber: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // 创建 reCAPTCHA 容器
    if (!document.getElementById('recaptcha-container')) {
      const recaptchaDiv = document.createElement('div');
      recaptchaDiv.id = 'recaptcha-container';
      document.body.appendChild(recaptchaDiv);
    }

    return () => {
      // 清理 reCAPTCHA 容器
      const recaptchaDiv = document.getElementById('recaptcha-container');
      if (recaptchaDiv) {
        document.body.removeChild(recaptchaDiv);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
      } else if (authMode === 'register') {
        await register(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await loginWithPhone(phoneVerification.phoneNumber);
      if (result.success) {
        setPhoneVerification({
          ...phoneVerification,
          confirmationResult: result.confirmationResult
        });
      }
    } catch (error) {
      console.error('Phone login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyPhoneCode(phoneVerification.confirmationResult, phoneVerification.verificationCode);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      location: ''
    });
    setPhoneVerification({
      confirmationResult: null,
      verificationCode: '',
      phoneNumber: ''
    });
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    resetForm();
    setShowPassword(false);
  };

  const renderEmailAuth = () => (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {authMode === 'register' && (
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '8px' 
          }}>
            姓名
          </label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="輸入你的姓名"
              required={authMode === 'register'}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                border: '2px solid #f3f4f6',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ef4444'}
              onBlur={(e) => e.target.style.borderColor = '#f3f4f6'}
            />
          </div>
        </div>
      )}

      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#111827', 
          marginBottom: '8px' 
        }}>
          電子郵件
        </label>
        <div style={{ position: 'relative' }}>
          <Mail size={18} style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af' 
          }} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="輸入你的電子郵件"
            required
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              border: '2px solid #f3f4f6',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              backgroundColor: '#ffffff',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = '#f3f4f6'}
          />
        </div>
      </div>

      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#111827', 
          marginBottom: '8px' 
        }}>
          密碼
        </label>
        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af' 
          }} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="輸入你的密碼"
            required
            style={{
              width: '100%',
              padding: '16px 48px 16px 48px',
              border: '2px solid #f3f4f6',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              backgroundColor: '#ffffff',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = '#f3f4f6'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af'
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {authMode === 'register' && (
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '8px' 
          }}>
            手機號碼 (選填)
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={18} style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+886 912345678"
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                border: '2px solid #f3f4f6',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ef4444'}
              onBlur={(e) => e.target.style.borderColor = '#f3f4f6'}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '16px',
          background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          marginTop: '8px'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        {isLoading ? '處理中...' : (authMode === 'login' ? '登錄' : '註冊')}
      </button>
    </form>
  );

  const renderPhoneAuth = () => (
    <div>
      {!phoneVerification.confirmationResult ? (
        <form onSubmit={handlePhoneLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#111827', 
              marginBottom: '8px' 
            }}>
              手機號碼
            </label>
            <div style={{ position: 'relative' }}>
              <Smartphone size={18} style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9ca3af' 
              }} />
              <input
                type="tel"
                value={phoneVerification.phoneNumber}
                onChange={(e) => setPhoneVerification({
                  ...phoneVerification,
                  phoneNumber: e.target.value
                })}
                placeholder="+886 912345678"
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: '2px solid #f3f4f6',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = '#f3f4f6'}
              />
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
              lineHeight: '1.4'
            }}>
              請輸入完整的國際格式手機號碼，例如：+886 912345678
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? '發送中...' : '發送驗證碼'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#111827', 
              marginBottom: '8px' 
            }}>
              驗證碼
            </label>
            <input
              type="text"
              value={phoneVerification.verificationCode}
              onChange={(e) => setPhoneVerification({
                ...phoneVerification,
                verificationCode: e.target.value
              })}
              placeholder="輸入6位數驗證碼"
              maxLength="6"
              required
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #f3f4f6',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                textAlign: 'center',
                letterSpacing: '0.1em',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ef4444'}
              onBlur={(e) => e.target.style.borderColor = '#f3f4f6'}
            />
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
              textAlign: 'center'
            }}>
              驗證碼已發送至 {phoneVerification.phoneNumber}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? '驗證中...' : '驗證並登錄'}
          </button>

          <button
            type="button"
            onClick={() => setPhoneVerification({ confirmationResult: null, verificationCode: '', phoneNumber: '' })}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            重新輸入手機號碼
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 區域 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">🚴</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">騎騎</h1>
          <p className="text-gray-600">機車騎士的社交平台</p>
        </div>

        {/* 表單區域 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 text-center font-semibold rounded-lg transition-colors ${
                authMode === 'login'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              登入
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-3 text-center font-semibold rounded-lg transition-colors ml-2 ${
                authMode === 'register'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              註冊
            </button>
            <button
              onClick={() => switchMode('phone')}
              className={`flex-1 py-3 text-center font-semibold rounded-lg transition-colors ml-2 ${
                authMode === 'phone'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              手機
            </button>
          </div>

          {/* 主要表單區域 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            marginBottom: '24px'
          }}>
            {authMode === 'phone' ? renderPhoneAuth() : renderEmailAuth()}
          </div>

          {/* Google 登錄按鈕 */}
          {authMode !== 'phone' && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                <span style={{
                  padding: '0 16px',
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  或
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#ffffff',
                  color: '#374151',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = '#fef2f2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                使用 Google 登錄
              </button>
            </div>
          )}

          {/* 底部提示 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              {authMode === 'login' ? (
                <>
                  <span>還沒有帳號？</span>
                  <button
                    onClick={() => switchMode('register')}
                    className="text-red-500 hover:text-red-600 font-semibold ml-1"
                  >
                    立即註冊
                  </button>
                </>
              ) : (
                <>
                  <span>已經有帳號了？</span>
                  <button
                    onClick={() => switchMode('login')}
                    className="text-red-500 hover:text-red-600 font-semibold ml-1"
                  >
                    立即登入
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          © 2024 騎騎 ChiChi. 版權所有
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 