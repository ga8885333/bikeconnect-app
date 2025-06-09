import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Phone, User, Upload, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (type, file) => {
    if (type === 'profile') {
      setProfilePhoto(file);
    } else if (type === 'vehicle') {
      setVehiclePhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error('密碼確認不符');
        return;
      }
      
      if (!profilePhoto || !vehiclePhoto) {
        toast.error('請上傳必要的照片');
        return;
      }
      
      const result = await register({
        ...formData,
        profilePhoto,
        vehiclePhoto
      });
      
      if (result.success) {
        navigate('/');
      }
    }
  };

  const handleSocialLogin = (provider) => {
    toast.success(`${provider} 登入功能開發中`);
  };

  const handleSMSVerification = () => {
    toast.success('簡訊驗證功能開發中');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo區域 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 pulse-bike">
            <span className="text-3xl">🏍️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BikeConnect</h1>
          <p className="text-blue-100">騎車交友，樂在其中</p>
        </div>

        {/* 登入/註冊切換 */}
        <div className="bg-white/10 rounded-2xl p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all duration-300 ${
                isLogin 
                  ? 'bg-white text-bike-600 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              登入
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'bg-white text-bike-600 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              註冊
            </button>
          </div>
        </div>

        {/* 主要表單 */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="input-field-icon" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="姓名"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field pl-12"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="input-field-icon" size={18} />
              <input
                type="email"
                name="email"
                placeholder="電子郵件"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field pl-12"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Phone className="input-field-icon" size={18} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="手機號碼"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field pl-12"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Lock className="input-field-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="密碼"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="input-field-icon" size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="確認密碼"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field pl-12"
                  required={!isLogin}
                />
              </div>
            )}

            {/* 註冊時的照片上傳 */}
            {!isLogin && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-600 mb-2">上傳本人與機車合照</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('profile', e.target.files[0])}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="btn-secondary text-sm cursor-pointer"
                  >
                    選擇照片
                  </label>
                  {profilePhoto && (
                    <p className="text-xs text-green-600 mt-2">已選擇: {profilePhoto.name}</p>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-600 mb-2">上傳行照與車牌照</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('vehicle', e.target.files[0])}
                    className="hidden"
                    id="vehicle-upload"
                  />
                  <label
                    htmlFor="vehicle-upload"
                    className="btn-secondary text-sm cursor-pointer"
                  >
                    選擇照片
                  </label>
                  {vehiclePhoto && (
                    <p className="text-xs text-green-600 mt-2">已選擇: {vehiclePhoto.name}</p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full text-lg"
            >
              {isLogin ? '登入' : '註冊'}
            </button>
          </form>

          {/* 分隔線 */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">或</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* 社交登入 */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                className="w-5 h-5 mr-3"
              />
              <span className="text-gray-700">使用 Google 登入</span>
            </button>

            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span className="mr-3">📘</span>
              使用 Facebook 登入
            </button>

            <button
              onClick={handleSMSVerification}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Phone size={20} className="mr-3" />
              手機簡訊驗證
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 