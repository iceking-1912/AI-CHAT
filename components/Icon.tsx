import React from 'react';

export type IconName = 
  | 'panel-left' | 'panel-right' | 'message-square-plus' | 'layout-grid' | 'search' 
  | 'copy' | 'chevron-down' | 'sparkles' | 'send' | 'pen-tool' | 'tag' 
  | 'bar-chart-3' | 'palette' | 'brain-circuit' | 'book-open' | 'school' 
  | 'atom' | 'leaf' | 'folder-kanban' | 'briefcase' | 'heart-pulse' 
  | 'scale' | 'users' | 'pie-chart' | 'book-user' | 'sliders-horizontal' | 'check'
  | 'plus' | 'x'
  // New Icons
  | 'folder' | 'home' | 'lightbulb' | 'code' | 'music' | 'film' | 'plane'
  | 'user' | 'bot' | 'history';

interface IconProps {
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
}

const icons: Record<IconName, React.ReactNode> = {
  'panel-left': <><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></>,
  'panel-right': <><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/></>,
  'message-square-plus': <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="9" x2="15" y1="10" y2="10"/></>,
  'layout-grid': <><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></>,
  'search': <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  'copy': <><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>,
  'chevron-down': <path d="m6 9 6 6 6-6"/>,
  'sparkles': <path d="m12 3-1.5 3L7 7.5l3 1.5L11.5 12l1.5-3L16 7.5l-3-1.5zM5 8.5l1.5-3L8 7l-3 1.5L3.5 10l1.5-1.5zM16 12.5l1.5-3L19 11l-3 1.5L14.5 14l1.5-1.5z"/>,
  'send': <path d="m22 2-7 20-4-9-9-4 20-7z" />,
  'pen-tool': <><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="m2 2 7.586 7.586"/><path d="m11 11 1 1"/></>,
  'tag': <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432l-8.704-8.704z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></>,
  'bar-chart-3': <><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></>,
  'palette': <><circle cx="12" cy="12" r="10"/><path d="M6 12c0-1.5.8-2.8 2-3.5S10.5 6 12 6s3.2.3 4.5 1c1.2.7 2 2 2 3.5s-.8 2.8-2 3.5c-1.3.7-2.8 1-4.5 1s-3.2-.3-4.5-1c-1.2-.7-2-2-2-3.5z"/></>,
  'brain-circuit': <><path d="M12 2a2.5 2.5 0 0 0-2.5 2.5v15A2.5 2.5 0 0 0 12 22a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 12 2Z"/><path d="M4.5 12h3"/><path d="M16.5 12h3"/><path d="M12 4.5v3"/><path d="M12 16.5v3"/><circle cx="12" cy="12" r="2.5"/><path d="M4.5 7.5l3 3"/><path d="M16.5 16.5l3 3"/><path d="m16.5 7.5-3 3"/><path d="m4.5 16.5 3-3"/></>,
  'book-open': <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
  'school': <><path d="m4 6 8-4 8 4"/><path d="M6 10v6c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-6"/><path d="M10 18v-4h4v4"/></>,
  'atom': <><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.4-2.4 2.4-6.3 0-8.7-2.4-2.4-6.3-2.4-8.7 0s-2.4 6.3 0 8.7c2.4 2.4 6.3 2.4 8.7 0Z"/><path d="M3.8 20.2c-2.4-2.4-2.4-6.3 0-8.7 2.4-2.4 6.3-2.4 8.7 0s2.4 6.3 0 8.7c-2.4 2.4-6.3 2.4-8.7 0Z"/></>,
  'leaf': <><path d="M11 20A7 7 0 0 1 4 13V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 0 2 0V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 0 2 0V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a7 7 0 0 1-7 7z"/><path d="M12 21a7 7 0 0 1-7-7V6"/></>,
  'folder-kanban': <><path d="M8 10h4"/><path d="M8 14h4"/><path d="M8 18h4"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3a2 2 0 0 0-1.7-.9H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/></>,
  'briefcase': <><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  'heart-pulse': <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></>,
  'scale': <><path d="m16 16 3-8 3 8c-.8.9-2 1-3 1-1 0-2.2-.1-3-1Z"/><path d="m2 16 3-8 3 8c-.8.9-2 1-3 1s-2.2-.1-3-1Z"/><path d="M12 22V6.5"/><path d="M5 6.5h14"/><path d="M12 6.5c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2Z"/></>,
  'users': <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  'pie-chart': <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
  'book-user': <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/><path d="M15 13a3 3 0 1 0-6 0"/></>,
  'sliders-horizontal': <><path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></>,
  'check': <path d="M20 6 9 17l-5-5"/>,
  'plus': <path d="M5 12h14"/><path d="M12 5v14"/>,
  'x': <path d="M18 6 6 18"/><path d="m6 6 12 12"/>,
  'folder': <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.23A2 2 0 0 0 8.27 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>,
  'home': <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
  'lightbulb': <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8a6 6 0 0 0-12 0c0 1 .3 2.2 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>,
  'code': <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
  'music': <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
  'film': <><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></>,
  'plane': <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>,
  'user': <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  'bot': <><rect width="12" height="12" x="6" y="6" rx="2"/><path d="M12 18v-6"/><path d="M12 6V4"/><path d="M12 2v2"/><path d="M18 12h-6"/><path d="M6 12H4"/><path d="M2 12h2"/><circle cx="12" cy="12" r="1"/></>,
  'history': <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M12 8v4l4 2"/></>
};

export const iconsList = Object.keys(icons) as IconName[];

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6', style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {icons[name]}
    </svg>
  );
};