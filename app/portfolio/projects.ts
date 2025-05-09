export interface Project {
    name: string;
    date: string;
    description: string;
    technologies: string[];
    githubUrl: string;
}

export const projects: Project[] = [
    {
        name: "Auto-Downloader-V1",
        date: "April 2021",
        description: "Developed a Python-based Instagram bot that allows users to automatically download media (videos and photos) from Instagram by simply copying the post URL.",
        technologies: ["Python", "Instagram API", "Automation"],
        githubUrl: "https://github.com/0xdaddy/Auto-Downloader-V1"
    },
    {
        name: "Dm-Cleaner",
        date: "May 2021",
        description: "Created a bot to clean Instagram Direct Messages by logging into an account and removing all messages in a user's inbox.",
        technologies: ["Python", "Instagram API", "Automation"],
        githubUrl: "https://github.com/0xdaddy/Dm-Cleaner"
    },
    {
        name: "AcceptBot-V4",
        date: "June 2021",
        description: "Developed a bot that automates the process of accepting follow requests on a private Instagram account. The bot refreshes every 15 seconds and accepts requests, making it easier to manage followers.",
        technologies: ["Python", "Instagram API", "Automation"],
        githubUrl: "https://github.com/0xdaddy/AcceptBot-V4"
    },
    {
        name: "OPEN-CD_ROM-OVER_SOCKET",
        date: "October 2021",
        description: "Built a tool to eject a CD-ROM drive over a socket connection using C#. This tool only supports Windows.",
        technologies: ["C#", "Sockets"],
        githubUrl: "https://github.com/0xdaddy/OPEN-CD_ROM-OVER_SOCKET"
    },
    {
        name: "DhttpServer",
        date: "November 2021",
        description: "Created a simple HTTP server from scratch using D language and sockets, featuring path handling, cookies, and an admin login system.",
        technologies: ["D", "Sockets", "HTTP"],
        githubUrl: "https://github.com/0xdaddy/DhttpServer"
    },
    {
        name: "Download-This",
        date: "January 2022",
        description: "Developed an Instagram bot that allows users to download media by sending a direct message with a post link. It supports configuration for multiple users.",
        technologies: ["Python", "Instagram API", "Automation"],
        githubUrl: "https://github.com/0xdaddy/download-this"
    },
    {
        name: "Unlike-Bot",
        date: "February 2022",
        description: "Built a bot that unlikes posts that a user has previously liked, helping users to easily clean up their Instagram feeds.",
        technologies: ["Python", "Instagram API"],
        githubUrl: "https://github.com/0xdaddy/Unlike-bot"
    },
    {
        name: "DM-This-User",
        date: "February 2022",
        description: "Developed an Instagram bot in C that sends a direct message to any Instagram user via SSL sockets using OpenSSL.",
        technologies: ["C", "SSL", "OpenSSL", "Sockets"],
        githubUrl: "https://github.com/0xdaddy/DM-THIS-USER"
    },
    {
        name: "Linux-Theme-Terminal",
        date: "March 2022",
        description: "Created a Windows console with a Linux theme, implementing custom commands and instructions directly using Windows APIs.",
        technologies: ["C", "Windows API"],
        githubUrl: "https://github.com/justalghamdi/linux-theme-terminal"
    },
    {
        name: "DEvil-Swapper-WEB",
        date: "July 2022",
        description: "Developed a bot that swaps Instagram usernames using the web API, ensuring that rare usernames are not caught by automated tools.",
        technologies: ["Python", "Instagram API"],
        githubUrl: "https://github.com/justalghamdi/DEvil-Swapper-WEB"
    },
    {
        name: "DIL",
        date: "August 2022",
        description: "Created a tool to scan devices in a local area network (LAN) using the ARP protocol, written in C.",
        technologies: ["C", "ARP", "Networking"],
        githubUrl: "https://github.com/justalghamdi/DIL"
    },
    {
        name: "Echo-Server",
        date: "August 2022",
        description: "Built an echo server in Assembly, using MASM and Windows APIs, to demonstrate low-level networking skills.",
        technologies: ["Assembly", "MASM", "Windows API"],
        githubUrl: "https://github.com/justalghamdi/Echo-Server"
    },
    {
        name: "HttpServer",
        date: "January 2023",
        description: "Created a C language library to build an HTTP server with simple instructions, utilizing a HashMap algorithm to handle routes.",
        technologies: ["C", "HTTP", "HashMap", "Server Development"],
        githubUrl: "https://github.com/v0id-user/HttpServer"
    },
    {
        name: "DFTP",
        date: "December 2023",
        description: "Developed a custom protocol to simulate FTP as a challenge, experimenting with structures and serializing binary data in C.",
        technologies: ["C", "Networking", "Protocol Design"],
        githubUrl: "https://github.com/v0id-user/DFTP"
    },
    {
        name: "PMPS",
        date: "May 2024",
        description: "C/C++ library and tool for scanning a process's memory space on Windows to find regex string patterns.",
        technologies: ["C", "Windows API", "Regex", "Memory Scanning"],
        githubUrl: "https://github.com/GhaynOrg/PMPS"
    },
    {
        name: "Postgres-Reactive-SSE-Example",
        date: "December 2024",
        description: "Developed a real-time newsletter application that uses PostgreSQL's NOTIFY/LISTEN functionality with Server-Sent Events (SSE) for reactive updates.",
        technologies: ["Python", "PostgreSQL", "FastAPI", "SSE"],
        githubUrl: "https://github.com/v0id-user/Postgres-Reactive-SSE-Example"
    },
    {
        name: "CAsyncPolling",
        date: "January 2025",
        description: "Experimented with implementing asynchronous functionality in C, exploring low-level concurrency concepts.",
        technologies: ["C", "Asynchronous Programming"],
        githubUrl: "https://github.com/v0id-user/CAsyncPolling"
    },
    {
        name: "v0id-land",
        date: "January 2025",
        description: "My personal website, where I integrated my own blog system, portfolio, and other projects in it.",
        technologies: ["Next.js", "Tailwind CSS", "PostgreSQL", "Prisma", "S3", "Shadcn/UI"],
        githubUrl: "https://github.com/v0id-user/v0id-land"
    },
    {
        name: "GitNav",
        date: "February 2025",
        description: "Contributed to GitNav by refactoring the UI rendering system, implementing a debugger, and improving state management to fix re-rendering issues. Added key press throttling and optimized terminal performance.",
        technologies: ["Rust", "Terminal UI", "State Management", "Contribution"],
        githubUrl: "https://github.com/skiupace/GitNav/pull/2"
    },
    {
        name: "HoseWatcher",
        date: "March 2025", 
        description: "A real-time Bluesky firehose relay service that processes and streams AtProto events to clients via WebSockets, built on Cloudflare Workers.",
        technologies: ["Cloudflare Workers", "WebSocket", "CBOR", "Node.js", "ATProto", "Typescript"],
        githubUrl: "https://github.com/v0id-user/hosewatcher"
    }
];
