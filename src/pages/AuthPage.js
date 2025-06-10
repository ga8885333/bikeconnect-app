import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('登錄成功！', {
          style: { 
            background: '#dc2626', 
            color: '#ffffff',
            fontWeight: '600'
          }
        });
      } else {
        await register(formData);
        toast.success('註冊成功！', {
          style: { 
            background: '#dc2626', 
            color: '#ffffff',
            fontWeight: '600'
          }
        });
      }
    } catch (error) {
      toast.error('操作失敗，請重試', {
        style: { 
          background: '#dc2626', 
          color: '#ffffff',
          fontWeight: '600'
        }
      });
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
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
    setShowPassword(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* 頂部標題區域 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
          }}>
            <span style={{ fontSize: '32px', color: '#ffffff' }}>🚴</span>
          </div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: '#111827', 
            margin: '0 0 8px 0' 
          }}>
            騎騎
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#6b7280', 
            margin: 0,
            fontWeight: '500'
          }}>
            {isLogin ? '歡迎回來！登錄你的帳戶' : '加入我們的騎行社群'}
          </p>
        </div>

        {/* 登錄/註冊表單 */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && (
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
                    required={!isLogin}
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#ffffff'
                    }}
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
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff'
                  }}
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
                  placeholder="輸入密碼"
                  required
                  style={{
                    width: '100%',
                    padding: '16px 48px 16px 48px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff'
                  }}
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
                    color: '#9ca3af',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
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
                      placeholder="輸入手機號碼"
                      style={{
                        width: '100%',
                        padding: '16px 16px 16px 48px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#ffffff'
                      }}
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
                    所在地區
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} style={{ 
                      position: 'absolute', 
                      left: '16px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#9ca3af' 
                    }} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="輸入所在地區"
                      style={{
                        width: '100%',
                        padding: '16px 16px 16px 48px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#dc2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  忘記密碼？
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: isLoading 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                marginTop: '8px'
              }}
            >
              {isLoading ? '處理中...' : (isLogin ? '登錄' : '註冊')}
            </button>
          </form>

          {/* 第三方登錄 */}
          <div style={{ margin: '24px 0' }}>
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: 0, 
                right: 0, 
                height: '1px', 
                backgroundColor: '#e5e7eb' 
              }} />
              <span style={{ 
                backgroundColor: '#ffffff', 
                padding: '0 16px', 
                fontSize: '14px', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                或者
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '18px' }}>🍎</span>
              Apple
            </button>
            <button style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '18px' }}>📱</span>
              Google
            </button>
          </div>
        </div>

        {/* 切換登錄/註冊 */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px' 
        }}>
          <span style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {isLogin ? '還沒有帳戶？' : '已經有帳戶了？'}
          </span>
          {' '}
          <button
            type="button"
            onClick={switchMode}
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#dc2626',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? '立即註冊' : '立即登錄'}
          </button>
        </div>

        {/* 服務條款 */}
        {!isLogin && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '16px',
            fontSize: '12px',
            color: '#9ca3af',
            lineHeight: '1.5',
            fontWeight: '500'
          }}>
            註冊即表示你同意我們的
            <span style={{ color: '#dc2626', fontWeight: '600' }}> 服務條款 </span>
            和
            <span style={{ color: '#dc2626', fontWeight: '600' }}> 隱私政策</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage; 