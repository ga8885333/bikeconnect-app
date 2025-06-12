import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, MoreHorizontal } from 'lucide-react';
import AvatarWithBadge from '../ui/AvatarWithBadge';

const CommentList = ({ 
  comments = [], 
  onLike, 
  onReply, 
  onUserClick,
  maxHeight = '400px' 
}) => {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return '剛剛';
    if (diffInMinutes < 60) return `${diffInMinutes}分鐘前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小時前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  if (comments.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: '#9ca3af'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          💬
        </div>
        <p style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 8px 0'
        }}>
          還沒有留言
        </p>
        <p style={{
          fontSize: '14px',
          margin: '0'
        }}>
          成為第一個留言的人吧！
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxHeight,
      overflowY: 'auto',
      padding: '8px 0'
    }}>
      <AnimatePresence>
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            style={{
              padding: '16px',
              marginBottom: '12px',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #f3f4f6',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <AvatarWithBadge
                src={comment.user.avatar}
                alt={comment.user.name}
                size={36}
                verified={comment.user.verified}
                onClick={() => onUserClick?.(comment.user)}
              />
              
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px'
                    }}>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#111827',
                          cursor: 'pointer'
                        }}
                        onClick={() => onUserClick?.(comment.user)}
                      >
                        {comment.user.name}
                      </span>
                      {comment.user.verified && (
                        <div style={{
                          width: '16px',
                          height: '16px',
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '8px', color: 'white' }}>✓</span>
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      fontWeight: '500'
                    }}>
                      {formatTimeAgo(comment.timestamp)}
                    </span>
                  </div>
                  
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      color: '#9ca3af',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: '#374151',
                  marginBottom: '12px',
                  wordBreak: 'break-word'
                }}>
                  {comment.content}
                </div>

                {/* 互动按钮 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onLike?.(comment.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Heart 
                      size={16} 
                      color={comment.isLiked ? '#ef4444' : '#9ca3af'}
                      fill={comment.isLiked ? '#ef4444' : 'none'}
                    />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: comment.isLiked ? '#ef4444' : '#9ca3af'
                    }}>
                      {comment.likes > 0 ? comment.likes : '讚'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReply?.(comment)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f9ff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Reply size={16} color="#9ca3af" />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#9ca3af'
                    }}>
                      回覆
                    </span>
                  </motion.button>
                </div>

                {/* 回复评论 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    paddingLeft: '16px',
                    borderLeft: '2px solid #f3f4f6'
                  }}>
                    {comment.replies.map((reply, replyIndex) => (
                      <motion.div
                        key={reply.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: replyIndex * 0.05 }}
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginBottom: '8px',
                          padding: '8px',
                          background: '#f9fafb',
                          borderRadius: '12px'
                        }}
                      >
                        <AvatarWithBadge
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          size={24}
                          verified={reply.user.verified}
                          onClick={() => onUserClick?.(reply.user)}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '4px'
                          }}>
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#111827',
                                cursor: 'pointer'
                              }}
                              onClick={() => onUserClick?.(reply.user)}
                            >
                              {reply.user.name}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              color: '#9ca3af'
                            }}>
                              {formatTimeAgo(reply.timestamp)}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#374151',
                            lineHeight: '1.4'
                          }}>
                            {reply.content}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CommentList; 