export const CodeforcesLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="4" width="4.5" height="16" rx="1" fill="#FF3333"/>
        <rect x="9.5" y="8" width="4.5" height="12" rx="1" fill="#1A8CFF"/>
        <rect x="4" y="13" width="4.5" height="7" rx="1" fill="#FFCC00"/>
    </svg>
);

export const LeetCodeLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1 22l-7.2-2.4c-1.7-.6-2.6-2.5-2-4.2l3-8.8c.6-1.7 2.5-2.6 4.2-2l7.2 2.4c1.7.6 2.6 2.5 2 4.2l-3 8.8c-.6 1.7-2.5 2.6-4.2 2z" fill="#FFA116"/>
        <path d="M7.9 19.6l-3.2-1.1c-1.7-.6-2.6-2.5-2-4.2l1.6-4.7" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export const CodeChefLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 8l10 6 10-6-10-6z" fill="#5B4638"/>
        <path d="M2 16l10 6 10-6v-8l-10 6-10-6v8z" fill="#8B6B56"/>
    </svg>
);

export const AtCoderLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#222222"/>
        <text x="12" y="16" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">A</text>
    </svg>
);

export const AllPlatformsLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#1A1A24"/>
        <g transform="translate(3, 3) scale(0.35)">
            <CodeforcesLogo />
        </g>
        <g transform="translate(13, 3) scale(0.35)">
            <LeetCodeLogo />
        </g>
        <g transform="translate(3, 13) scale(0.35)">
            <CodeChefLogo />
        </g>
        <g transform="translate(13, 13) scale(0.35)">
            <AtCoderLogo />
        </g>
    </svg>
);