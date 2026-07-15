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
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fetchMentionsLoading, setFetchMentionsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setShowDraftPrompt(true);
    }
  }, []);

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

  useEffect(() => {
    if (!mentionQuery) {
      setMentionUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setFetchMentionsLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(mentionQuery)}`);
        if (res.ok) {
          const users = await res.json();
          setMentionUsers(users);
          setMentionIndex(0);
        }
      } catch {
        // Ignore errors for mock
      } finally {
        setFetchMentionsLoading(false);
      }
    };

    fetchUsers();
  }, [mentionQuery]);

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

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) return;
    if (isScheduling && (!scheduledDate || !scheduledTime)) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      console.log('Post submitted:', content);
      localStorage.removeItem(DRAFT_KEY);
      setContent('');
      setDraftStatus('idle');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit post');
    } finally {
      setIsSubmitting(false);
    }
  }, [content, isScheduling, scheduledDate, scheduledTime]);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      const cursorPos = e.target.selectionStart;
      setContent(newContent);

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
    <div className="relative">
      <div
        className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-6"
      >
        {showDraftPrompt && (
          <div
            className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4 flex justify-between items-center gap-3"
          >
            <span className="text-slate-200 text-sm">
              You have an unfinished draft
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 rounded-md border border-white/20 bg-transparent text-slate-400 text-sm cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleContinueDraft}
                className="px-3 py-1.5 rounded-md border-none bg-purple-500 text-white text-sm cursor-pointer"
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
          className="w-full min-h-[100px] bg-transparent border-none text-slate-300 text-sm resize-y outline-none"
        />

        {mentionQuery && (
          <div
            ref={mentionDropdownRef}
            className="absolute bottom-full left-0 right-0 bg-slate-800 border border-white/10 rounded-xl p-2 mb-2 shadow-xl max-h-[250px] overflow-y-auto"
          >
            {fetchMentionsLoading ? (
              <div className="text-slate-400 text-sm p-2">Loading...</div>
            ) : mentionUsers.length > 0 ? (
              mentionUsers.map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => handleMentionSelect(user)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg border-none cursor-pointer text-left text-slate-200 ${
                    index === mentionIndex ? 'bg-purple-500/20' : 'bg-transparent'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.displayName[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{user.displayName}</div>
                    <div className="text-xs text-slate-400">@{user.username}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-slate-400 text-sm p-2">No users found</div>
            )}
          </div>
        )}

        {submitError && (
          <div className="text-red-400 text-sm mt-2">{submitError}</div>
        )}

        <div className="flex justify-between items-center mt-3 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: draftStatus === 'saved' ? '#10B981' : draftStatus === 'saving' ? '#F59E0B' : '#64748B' }}>
              {draftStatus === 'saved' && '✓ Draft saved'}
              {draftStatus === 'saving' && 'Saving draft...'}
              {draftStatus === 'idle' && ''}
            </span>
            <button
              onClick={() => setIsScheduling(!isScheduling)}
              className={`px-3 py-1.5 rounded-lg border border-white/20 text-sm cursor-pointer transition-colors ${
                isScheduling ? 'bg-purple-500/20 text-purple-400' : 'bg-transparent text-slate-400'
              }`}
            >
              Schedule
            </button>
            {isScheduling && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-md border border-white/20 bg-transparent text-slate-200 text-sm"
                />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="px-2.5 py-1.5 rounded-md border border-white/20 bg-transparent text-slate-200 text-sm"
                />
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || (isScheduling && (!scheduledDate || !scheduledTime)) || isSubmitting}
            className={`px-5 py-2 rounded-full border-none text-sm font-semibold cursor-pointer transition-colors ${
              content.trim() && (!isScheduling || (scheduledDate && scheduledTime)) && !isSubmitting
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : isScheduling ? 'Schedule' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
