import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal } from 'lucide-react';
import AvatarWithBadge from '../ui/AvatarWithBadge';

const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onUserClick, 
  onFollow 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '20px',
        border: '1px solid #f3f4f6',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 用户信息头部 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
          onClick={() => onUserClick?.(post.user)}
        >
          <AvatarWithBadge
            src={post.user.avatar}
            alt={post.user.name}
            size={48}
            verified={post.user.verified}
            online={true}
          />
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#111827',
                margin: '0'
              }}>
                {post.user.name}
              </h4>
              {!post.user.following && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollow?.(post.user.id);
                  }}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  關注
                </button>
              )}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '2px'
            }}>
              <span style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {post.timestamp}
              </span>
              {post.location && (
                <>
                  <span style={{ color: '#d1d5db' }}>•</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <MapPin size={12} color="#6b7280" />
                    <span style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {post.location}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          <MoreHorizontal size={20} color="#6b7280" />
        </button>
      </div>

      {/* 内容 */}
      <div style={{
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        marginBottom: '16px'
      }}>
        {post.content}
      </div>

      {/* 标签 */}
      {post.tags && post.tags.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px'
        }}>
          {post.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                background: '#ef444410',
                color: '#ef4444',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 图片 */}
      {post.images && post.images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: post.images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          gap: '8px',
          marginBottom: '16px',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              style={{
                width: '100%',
                height: post.images.length === 1 ? '300px' : '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>
      )}

      {/* 互动按钮 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          gap: '24px'
        }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onLike?.(post.id)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#fef2f2';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <Heart 
              size={20} 
              color={post.isLiked ? '#ef4444' : '#6b7280'}
              fill={post.isLiked ? '#ef4444' : 'none'}
            />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: post.isLiked ? '#ef4444' : '#6b7280'
            }}>
              {post.likes}
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onComment?.(post)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f0f9ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <MessageCircle size={20} color="#6b7280" />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280'
            }}>
              {post.comments}
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onShare?.(post)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f0fdf4';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <Share2 size={20} color="#6b7280" />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280'
            }}>
              {post.shares}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard; 