import React from 'react';
import type { UserProfile } from '../../types';

interface AvatarProps {
  user: Pick<UserProfile, 'displayName' | 'avatarUrl'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: { outer: 32, font: 13 },
  md: { outer: 44, font: 16 },
  lg: { outer: 64, font: 22 },
  xl: { outer: 96, font: 34 },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getGradient(name: string): string {
  const gradients = [
    'linear-gradient(135deg, #7B61FF 0%, #A78BFA 100%)',
    'linear-gradient(135deg, #627EEA 0%, #93C5FD 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
    'linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)',
    'linear-gradient(135deg, #EF4444 0%, #FCA5A5 100%)',
    'linear-gradient(135deg, #EC4899 0%, #F9A8D4 100%)',
  ];
  const index =
    name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    gradients.length;
  return gradients[index];
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const { outer, font } = SIZE_MAP[size];

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.displayName}
        className={className}
        style={{
          width: outer,
          height: outer,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: outer,
        height: outer,
        borderRadius: '50%',
        background: getGradient(user.displayName),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: font,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
        letterSpacing: '-0.5px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      aria-label={`Avatar for ${user.displayName}`}
    >
      {getInitials(user.displayName)}
    </div>
  );
};
