'use client';

import { useState, useRef, useEffect } from 'react';


export default function WWSignPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('[SYSTEM]: AWAITING INPUT...');
    const [isShaking, setIsShaking] = useState(false);
    const [borderColor, setBorderColor] = useState('white');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const formRef = useRef<HTMLDivElement>(null);

    const defaultMessage = '[SYSTEM]: AWAITING INPUT...';
    const typingMessage = '[SYSTEM]: USER IS TYPING...';

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            setMessage(typingMessage);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            if (message === typingMessage) {
                setMessage(defaultMessage);
            }
        }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username.toLowerCase() === 'admin' && password.toLowerCase() === 'admin') {
            const messages = [
                '[SYSTEM]: WOW HITMAN DETECTED...',
                '[SYSTEM]: UNAUTHORIZED ACCESS DETECTED...',
                '[SYSTEM]: INTRUDER ALERT! INTRUDER ALERT!',
                '[SYSTEM]: NICE TRY, AGENT 47...',
                '[SYSTEM]: SECURITY BREACH DETECTED...',
                '[SYSTEM]: SYSTEM COMPROMISED...',
                '[SYSTEM]: INVALID CREDENTIALS, AGENT...',
                '[SYSTEM]: ACCESS VIOLATION DETECTED...',
                '[SYSTEM]: SECURITY PROTOCOLS ENGAGED...',
                '[SYSTEM]: UNAUTHORIZED PERSONNEL DETECTED...',
                '[SYSTEM]: SYSTEM LOCKDOWN INITIATED...',
                '[SYSTEM]: SECURITY ALERT LEVEL CRITICAL...',
                '[SYSTEM]: BREACH ATTEMPT LOGGED...',
                '[SYSTEM]: UNAUTHORIZED LOGIN DETECTED...',
                '[SYSTEM]: SECURITY COUNTERMEASURES ACTIVE...',
                '[SYSTEM]: INTRUSION DETECTED...',
                '[SYSTEM]: SECURITY BREACH IN PROGRESS...',
                '[SYSTEM]: UNAUTHORIZED ACCESS POINT DETECTED...',
                '[SYSTEM]: SYSTEM DEFENSE ACTIVATED...',
                '[SYSTEM]: SECURITY VIOLATION LOGGED...',
                '[SYSTEM]: UNAUTHORIZED USER DETECTED...',
                '[SYSTEM]: SYSTEM INTEGRITY COMPROMISED...',
                '[SYSTEM]: SECURITY PERIMETER BREACHED...',
                '[SYSTEM]: UNAUTHORIZED ENTRY DETECTED...',
                '[SYSTEM]: SECURITY ALERT: INTRUDER DETECTED...'
            ];

            setMessage(messages[Math.floor(Math.random() * messages.length)]);
            setBorderColor('red');
            setIsShaking(true);
            // Flash effect for 3 seconds
            const colors = ['red', 'orange', 'yellow', 'red'];
            const flashInterval = setInterval(() => {
                colors.forEach((color, i) => {
                    setTimeout(() => setBorderColor(color), i * 200);
                });
            }, 800);

            setTimeout(() => {
                clearInterval(flashInterval);
                window.location.reload();
            }, 3000);
            return;
        }

        if (username.toLowerCase() === 'hello' && password.toLowerCase() === 'world') {
            setMessage('[SYSTEM]: CLASSIC PROGRAMMER DETECTED!');
            setBorderColor('green');
            setTimeout(() => setMessage('[SYSTEM]: BUT NOT GOOD ENOUGH...'), 2000);
            return;
        }

        if (username.toLowerCase().includes('hack')) {
            setMessage('[SYSTEM]: UNAUTHORIZED HACKING ATTEMPT DETECTED');
            setBorderColor('red');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 1000);
            return;
        }

        // Default response
        setMessage('[SYSTEM]: ACCESS DENIED');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono p-8 flex items-center justify-center">
            <div className="w-full max-w-md">
                <pre className="text-center mb-8">
                    {`+------------------+
|     W W SIGN     |
+------------------+`}
                </pre>

                <div
                    ref={formRef}
                    className={`border transition-colors duration-200 p-8 relative ${isShaking ? 'animate-shake' : ''
                        }`}
                    style={{ borderColor }}
                >
                    <span className="absolute top-0 left-0 -mt-2 -ml-2">╔</span>
                    <span className="absolute top-0 right-0 -mt-2 -mr-2">╗</span>
                    <span className="absolute bottom-0 left-0 -mb-2 -ml-2">╚</span>
                    <span className="absolute bottom-0 right-0 -mb-2 -mr-2">╝</span>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm mb-2">USERNAME</label>
                            <input
                                type="text"
                                className="w-full bg-black border border-white p-2 focus:outline-none focus:border-green-500"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    handleTyping();
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">PASSWORD</label>
                            <input
                                type="password"
                                className="w-full bg-black border border-white p-2 focus:outline-none focus:border-green-500"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    handleTyping();
                                }}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full border border-white py-2 hover:bg-white hover:text-black transition-colors"
                            >
                                &gt; ENTER
                            </button>
                        </div>
                    </form>
                </div>

                <pre className={`text-center mt-8 ${message.includes('DENIED') || message.includes('HACKER') || message.includes('UNAUTHORIZED')
                        ? 'text-red-500'
                        : message.includes('CLASSIC') ? 'text-green-500' : 'text-gray-500'
                    }`}>
                    {message}
                </pre>
            </div>
        </div>
    );
}


console.log("%c...So, you’re snooping around to get the job, huh? ;)", "color: #444; font-style: italic;");
console.log("%cThey say painters use two strokes to get in... =) ", "color: #666;");
console.log("%cA name spoken twice... Think about it or Search for it. :) ", "color: #888; font-weight: bold;");
console.log("%cWet floors leave marks. Professionals leave none(I'm not one of them). ;P", "color: #555;");