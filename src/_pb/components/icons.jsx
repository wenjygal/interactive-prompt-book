// אייקוני SVG בסגנון lucide (stroke 2, round caps/joins), בלי אמוג׳י — עקביים בכל האפליקציה.

function Icon({ path, size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {path}
    </svg>
  );
}

export function BookIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </>
      }
    />
  );
}

export function UserIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      }
    />
  );
}

export function ChartIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </>
      }
    />
  );
}

export function BookmarkIcon(props) {
  return <Icon {...props} path={<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />} />;
}

export function SettingsIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </>
      }
    />
  );
}

export function SearchIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </>
      }
    />
  );
}

export function SearchPlusIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="M11 8v6M8 11h6" />
        </>
      }
    />
  );
}

export function PencilIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </>
      }
    />
  );
}

export function CopyIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      }
    />
  );
}

export function RefreshIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M21 12a9 9 0 1 1-6.2-8.5" />
          <path d="M21 3v6h-6" />
        </>
      }
    />
  );
}

export function SaveIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <path d="M17 21v-8H7v8M7 3v5h8" />
        </>
      }
    />
  );
}

export function ChevronLeftIcon(props) {
  return <Icon {...props} strokeWidth={props.strokeWidth || "2.4"} path={<path d="m15 18-6-6 6-6" />} />;
}

export function ChevronRightIcon(props) {
  return <Icon {...props} strokeWidth={props.strokeWidth || "2.4"} path={<path d="m9 18 6-6-6-6" />} />;
}

export function RocketIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </>
      }
    />
  );
}

export function MegaphoneIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </>
      }
    />
  );
}

export function MicIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </>
      }
    />
  );
}

export function MenuIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <line x1="4" x2="20" y1="7" y2="7" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="17" y2="17" />
        </>
      }
    />
  );
}

export function CloseIcon(props) {
  return (
    <Icon
      {...props}
      path={
        <>
          <path d="M18 6 6 18" />
          <path d="M6 6l12 12" />
        </>
      }
    />
  );
}
