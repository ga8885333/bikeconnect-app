import React, { useState } from 'react';
import { Send, Smile, Image } from 'lucide-react';
import { motion } from 'framer-motion';

const CommentInput = ({ 
  onSubmit, 
  placeholder = "寫下你的想法...", 
  autoFocus = false,
  maxLength = 500 
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(comment.trim());
      setComment('');
    } catch (error) {
      console.error('Comment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px',
        border: '2px solid #f3f4f6',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px'
        }}>
          <div style={{ flex: 1 }}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              autoFocus={autoFocus}
              maxLength={maxLength}
              style={{
                width: '100%',
                minHeight: '44px',
                maxHeight: '120px',
                padding: '12px 16px',
                border: '2px solid #f3f4f6',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#f9fafb'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ef4444';
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f3f4f6';
                e.target.style.backgroundColor = '#f9fafb';
              }}
            />
            
            {/* 字数统计 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    color: '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  <Smile size={18} />
                </button>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    color: '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  <Image size={18} />
                </button>
              </div>
              
              <span style={{
                fontSize: '12px',
                color: comment.length > maxLength * 0.8 ? '#ef4444' : '#9ca3af',
                fontWeight: '500'
              }}>
                {comment.length}/{maxLength}
              </span>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!comment.trim() || isSubmitting}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '44px',
              height: '44px',
              background: (!comment.trim() || isSubmitting) ? '#e5e7eb' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: (!comment.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            whileHover={(!comment.trim() || isSubmitting) ? {} : { 
              scale: 1.05,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
          >
            {isSubmitting ? (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </div>
      </form>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </motion.div>
  );
};

export default CommentInput; 