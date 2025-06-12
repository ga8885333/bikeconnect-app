import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';

/**
 * LanguageSwitcher 元件 - 語言切換下拉選單
 * 支援繁體中文、簡體中文、英文
 * 保持紅色主題設計
 */
const LanguageSwitcher = ({ className = '' }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // 語言選項配置
  const languages = [
    {
      code: 'zh-TW',
      name: t('language.traditionalChinese'),
      flag: '🇹🇼',
      nativeName: '繁體中文'
    },
    {
      code: 'zh-CN', 
      name: t('language.simplifiedChinese'),
      flag: '🇨🇳',
      nativeName: '简体中文'
    },
    {
      code: 'en',
      name: t('language.english'),
      flag: '🇺🇸',
      nativeName: 'English'
    }
  ];

  // 取得當前語言
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // 切換語言
  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  // 切換下拉選單
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 語言切換按鈕 */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        aria-label={t('language.switch')}
      >
        {/* 地球圖示 */}
        <Globe className="w-4 h-4 text-red-600" />
        
        {/* 當前語言 */}
        <div className="flex items-center space-x-1">
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {currentLanguage.nativeName}
          </span>
        </div>
        
        {/* 下拉箭頭 */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 選單內容 */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 ${
                  currentLanguage.code === language.code 
                    ? 'bg-red-50 border-r-4 border-red-500' 
                    : ''
                }`}
              >
                {/* 國旗 */}
                <span className="text-lg">{language.flag}</span>
                
                {/* 語言名稱 */}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {language.nativeName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language.name}
                  </div>
                </div>
                
                {/* 選中指示器 */}
                {currentLanguage.code === language.code && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher; 