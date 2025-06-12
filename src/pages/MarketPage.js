import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Filter, Star, Heart } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import SectionTitle from '../components/ui/SectionTitle';

const MarketPage = () => {
  const categories = [
    { id: 'helmet', name: '安全帽', icon: '🪖', color: '#ef4444' },
    { id: 'gear', name: '騎行裝備', icon: '🦺', color: '#f59e0b' },
    { id: 'parts', name: '機車配件', icon: '🔧', color: '#10b981' },
    { id: 'accessories', name: '配飾', icon: '🎒', color: '#8b5cf6' }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'SHOEI X-14 全罩式安全帽',
      price: 18800,
      originalPrice: 21000,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300',
      rating: 4.8,
      reviews: 156,
      discount: 10,
      isLiked: false
    },
    {
      id: 2,
      name: 'Alpinestars 皮革騎行夾克',
      price: 12500,
      originalPrice: 15000,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300',
      rating: 4.6,
      reviews: 89,
      discount: 17,
      isLiked: true
    }
  ];

  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
        paddingBottom: '80px'
      }}>
        {/* 头部 */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          padding: '60px 20px 40px 20px',
          color: 'white'
        }}>
          <div style={{
            maxWidth: '400px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}
            >
              <ShoppingBag size={40} color="white" />
            </motion.div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              margin: '0 0 12px 0'
            }}>
              騎騎商城
            </h1>
            <p style={{
              fontSize: '16px',
              opacity: 0.9,
              margin: '0'
            }}>
              專業機車用品，安全騎行首選
            </p>
          </div>
        </div>

        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* 搜索栏 */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            margin: '-20px 0 30px 0',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{
              flex: 1,
              position: 'relative'
            }}>
              <Search 
                size={20} 
                color="#9ca3af" 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <input
                type="text"
                placeholder="搜索商品..."
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #f3f4f6',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <button style={{
              background: '#ef4444',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer'
            }}>
              <Filter size={20} color="white" />
            </button>
          </div>

          {/* 分类 */}
          <SectionTitle 
            title="商品分類" 
            subtitle="選擇您需要的商品類型"
            icon={ShoppingBag}
          />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '40px'
          }}>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  border: `2px solid ${category.color}20`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  fontSize: '32px',
                  marginBottom: '8px'
                }}>
                  {category.icon}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {category.name}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 精选商品 */}
          <SectionTitle 
            title="精選商品" 
            subtitle="熱門推薦，品質保證"
            icon={Star}
          />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  gap: '16px'
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827',
                      margin: '0',
                      lineHeight: '1.3'
                    }}>
                      {product.name}
                    </h4>
                    <button style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px'
                    }}>
                      <Heart 
                        size={18} 
                        color={product.isLiked ? '#ef4444' : '#d1d5db'}
                        fill={product.isLiked ? '#ef4444' : 'none'}
                      />
                    </button>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={14} color="#fbbf24" fill="#fbbf24" />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {product.rating}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      ({product.reviews} 評價)
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#ef4444'
                    }}>
                      NT$ {product.price.toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      textDecoration: 'line-through'
                    }}>
                      NT$ {product.originalPrice.toLocaleString()}
                    </span>
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      -{product.discount}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 即将推出 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '20px',
              padding: '40px 20px',
              textAlign: 'center',
              border: '2px dashed #d1d5db'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🚧
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              更多功能即將推出
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 20px 0',
              lineHeight: '1.5'
            }}>
              我們正在努力為您打造更完整的購物體驗，包括線上支付、商品評價、訂單追蹤等功能。
            </p>
            <div style={{
              background: '#ef4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              敬請期待
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MarketPage; 