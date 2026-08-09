import { useState } from 'react';

interface PostSchedulerProps {
  onSchedule: (dateTime: Date) => void;
  onCancel: () => void;
  minDate?: Date;
}

export function PostScheduler({ onSchedule, onCancel, minDate = new Date() }: PostSchedulerProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSchedule = () => {
    if (!date || !time) return;

    const scheduledDateTime = new Date(`${date}T${time}`);
    if (scheduledDateTime < minDate) {
      alert('Scheduled time must be in the future');
      return;
    }

    onSchedule(scheduledDateTime);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="post-scheduler">
      <h3>Schedule Post</h3>
      <div className="scheduler-form">
        <div className="form-group">
          <label htmlFor="schedule-date">Date</label>
          <input
            id="schedule-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="schedule-time">Time</label>
          <input
            id="schedule-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="scheduler-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSchedule}
            disabled={!date || !time}
            className="btn-primary"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
