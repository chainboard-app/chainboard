import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface MobileNavProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ items, isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="mobile-nav-overlay" onClick={onClose}>
      <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <nav className="mobile-nav-items">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="mobile-nav-item"
              onClick={onClose}
            >
              {item.icon && <span className="nav-icon">{item.icon}</span>}
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
