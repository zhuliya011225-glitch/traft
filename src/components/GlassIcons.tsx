
import React from 'react';
import './GlassIcons.css';
import { cn } from '../lib/utils';

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

interface IconItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  customClass?: string;
}

interface GlassIconsProps {
  items: IconItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

const GlassIcons = ({ items, activeId, onItemClick, className }: GlassIconsProps) => {
  const getBackgroundStyle = () => {
    return { background: '#C2DAF2' };
  };

  return (
    <div className={cn("icon-btns", className)}>
      {items.map((item) => (
        <button 
          key={item.id} 
          className={cn(
            "icon-btn", 
            item.customClass,
            activeId === item.id && "icon-btn--active"
          )} 
          aria-label={item.label} 
          type="button"
          onClick={() => onItemClick?.(item.id)}
        >
          <span className="icon-btn__back" style={getBackgroundStyle()}></span>
          <span className="icon-btn__front">
            <span className="icon-btn__label">{item.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;
