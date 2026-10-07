const labels = { reading: "Reading", video: "Video" }

function MaterialIcon({ type, size = 18 }) {
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
            role="img"
            aria-label={labels[type] ?? type}
            style={{ flexShrink: 0 }}
        >
            <title>{labels[type] ?? type}</title>
            {type === "video" ? (
                <>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M10 9l5 3-5 3z" fill="currentColor" />
                </>
            ) : (
                <>
                    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
                    <path d="M4 21a2 2 0 0 1 2-2h13" />
                </>
            )}
        </svg>
    );
}

export default MaterialIcon
