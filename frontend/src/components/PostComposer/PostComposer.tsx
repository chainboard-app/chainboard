import React, { useState, useEffect, useCallback, useRef } from 'react';

const DRAFT_KEY = 'chainboard_post_draft';
const DEBOUNCE_DELAY = 2000;

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export function PostComposer() {
  const [content, setContent] = useState('');
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const [mentionStart, setMentionStart] = useState<number>(-1);
  const [mentionIndex, setMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionDropdownRef = useRef<HTMLDivElement>(null);

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

  // Fetch users for mentions
  useEffect(() => {
    if (!mentionQuery) {
      setMentionUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(mentionQuery)}`);
        if (res.ok) {
          const users = await res.json();
          setMentionUsers(users);
          setMentionIndex(0);
        }
      } catch {
        // Ignore errors for mock
      }
    };

    fetchUsers();
  }, [mentionQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        mentionDropdownRef.current &&
        !mentionDropdownRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setMentionQuery(null);
        setMentionUsers([]);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      const cursorPos = e.target.selectionStart;
      setContent(newContent);

      // Detect mention
      const textBeforeCursor = newContent.slice(0, cursorPos);
      const lastSpaceOrStart = Math.max(
        textBeforeCursor.lastIndexOf(' '),
        textBeforeCursor.lastIndexOf('\n'),
        0,
      );
      const substring = textBeforeCursor.slice(lastSpaceOrStart);
      if (substring.startsWith('@')) {
        const query = substring.slice(1);
        setMentionQuery(query);
        setMentionStart(lastSpaceOrStart);
      } else {
        setMentionQuery(null);
      }
    },
    [],
  );

  const handleMentionSelect = useCallback((user: User) => {
    if (!textareaRef.current || mentionStart === -1) return;
    const currentContent = content;
    const before = currentContent.slice(0, mentionStart);
    const after = currentContent.slice(textareaRef.current.selectionStart);
    const newText = `${before}@${user.username} `;
    setContent(newText + after);
    setMentionQuery(null);
    setMentionUsers([]);

    // Set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursor = newText.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  }, [content, mentionStart]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!mentionQuery) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex((prev) => (prev + 1) % mentionUsers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex((prev) => (prev - 1 + mentionUsers.length) % mentionUsers.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (mentionUsers[mentionIndex]) {
          handleMentionSelect(mentionUsers[mentionIndex]);
        }
      } else if (e.key === 'Escape') {
        setMentionQuery(null);
        setMentionUsers([]);
      }
    },
    [mentionQuery, mentionUsers, mentionIndex, handleMentionSelect],
  );

  return (
    <div style={{ position: 'relative' }}>
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
          ref={textareaRef}
          value={content}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? @mention someone!"
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

        {/* Mention Dropdown */}
        {mentionQuery && mentionUsers.length > 0 && (
          <div
            ref={mentionDropdownRef}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              background: '#1E293B',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: 8,
              marginBottom: 8,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              maxHeight: 250,
              overflowY: 'auto',
            }}
          >
            {mentionUsers.map((user, index) => (
              <button
                key={user.id}
                onClick={() => handleMentionSelect(user)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 10,
                  borderRadius: 8,
                  background: index === mentionIndex ? 'rgba(123, 97, 255, 0.2)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#E2E8F0',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#7B61FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14
                }}>
                  {user.displayName[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{user.displayName}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>@{user.username}</div>
                </div>
              </button>
            ))}
          </div>
        )}

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
    </div>
  );
}
