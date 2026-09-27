import { memo, useMemo } from 'react';

interface UserAvatarProps {
  photoURL?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

const GRADIENTS = [
  'from-neutral-900 to-neutral-800 text-white dark:from-neutral-100 dark:to-neutral-300 dark:text-neutral-900',
  'from-neutral-800 to-neutral-700 text-white dark:from-neutral-200 dark:to-neutral-400 dark:text-neutral-900',
  'from-neutral-700 to-neutral-900 text-white dark:from-neutral-300 dark:to-neutral-100 dark:text-neutral-900',
  'from-neutral-800 to-black text-white dark:from-white dark:to-neutral-200 dark:text-neutral-900',
  'from-neutral-950 to-neutral-800 text-white dark:from-neutral-100 dark:to-neutral-200 dark:text-neutral-900',
];

const SIZE_MAP = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    const localPart = email.split('@')[0];
    return localPart.slice(0, 2).toUpperCase();
  }
  return 'TY';
}

function getGradientIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % GRADIENTS.length;
}

function UserAvatarComponent({
  photoURL,
  name,
  email,
  size = 'md',
  className = '',
  alt,
}: UserAvatarProps) {
  const initials = useMemo(() => getInitials(name, email), [name, email]);
  const gradientClass = useMemo(() => {
    const identifier = name || email || 'User';
    return GRADIENTS[getGradientIndex(identifier)];
  }, [name, email]);

  const effectiveAlt = useMemo(() => {
    if (alt && alt !== 'User avatar') return alt;
    if (name?.trim()) return `${name.trim()}'s profile picture`;
    if (email?.trim()) return `Profile avatar for ${email.trim()}`;
    return 'User profile avatar';
  }, [alt, name, email]);

  const sizeClasses = SIZE_MAP[size];

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={effectiveAlt}
        className={`rounded-full object-cover border border-neutral-300 dark:border-neutral-700 shadow-xs ${sizeClasses} ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={effectiveAlt}
      className={`rounded-full flex items-center justify-center font-bold font-mono tracking-wider bg-gradient-to-br border border-neutral-300 dark:border-neutral-700 shadow-xs select-none ${gradientClass} ${sizeClasses} ${className}`}
    >
      <span aria-hidden="true">{initials}</span>
    </div>
  );
}

export default memo(UserAvatarComponent);
