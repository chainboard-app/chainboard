import React, { useState, useEffect, useCallback } from 'react';

const DRAFT_KEY = 'chainboard_post_draft';
const DEBOUNCE_DELAY = 2000;

export function PostComposer() {
  const [content, setContent] = useState('');
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setShowDraftPrompt(true);
    }
  }, []);

  // Debounce save to localStorage
  useEffect(() => {
    if (!content.trim()) {
      localStorage.removeItem(DRAFT_KEY);
      setDraftStatus('idle');
      return;
    }

    setDraftStatus('saving');
    const timeoutId = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, content);
      setDraftStatus('saved');
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [content]);

  const handleContinueDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setContent(savedDraft);
    }
    setShowDraftPrompt(false);
  }, []);

  const handleDiscardDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftPrompt(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return;
    // TODO: implement actual submit
    console.log('Post submitted:', content);
    localStorage.removeItem(DRAFT_KEY);
    setContent('');
    setDraftStatus('idle');
  }, [content]);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
      }}
    >
      {showDraftPrompt && (
        <div
          style={{
            background: 'rgba(123, 97, 255, 0.1)',
            border: '1px solid rgba(123, 97, 255, 0.3)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ color: '#E2E8F0', fontSize: 14 }}>
            You have an unfinished draft
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDiscardDraft}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: '#94A3B8',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Discard
            </button>
            <button
              onClick={handleContinueDraft}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: '#7B61FF',
                color: 'white',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Continue draft
            </button>
          </div>
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        style={{
          width: '100%',
          minHeight: 100,
          background: 'transparent',
          border: 'none',
          color: '#CBD5E1',
          fontSize: 15,
          resize: 'vertical',
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <span style={{ fontSize: 12, color: draftStatus === 'saved' ? '#10B981' : draftStatus === 'saving' ? '#F59E0B' : '#64748B' }}>
          {draftStatus === 'saved' && '✓ Draft saved'}
          {draftStatus === 'saving' && 'Saving draft...'}
          {draftStatus === 'idle' && ''}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          style={{
            padding: '8px 20px',
            borderRadius: 999,
            border: 'none',
            background: content.trim() ? '#7B61FF' : 'rgba(255,255,255,0.1)',
            color: content.trim() ? 'white' : 'rgba(255,255,255,0.5)',
            fontSize: 14,
            fontWeight: 600,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
}
