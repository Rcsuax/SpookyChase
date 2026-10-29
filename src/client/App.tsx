import { useState, type FormEvent } from 'react';
import { useWebSocket } from './useWebSocket';

export default function App() {
    const { messages, connected, send } = useWebSocket();
    const [input, setInput] = useState('');

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!input) return;
        send(input);
        setInput('');
    }

    return (
        <main className="mx-auto my-8 max-w-xl px-4 font-sans">
            <h1 className="text-3xl font-bold">Chase</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <span className={`size-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                {connected ? 'Connected' : 'Disconnected'}
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoComplete="off"
                    placeholder="Type a message"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
                <button
                    disabled={!connected}
                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    Send
                </button>
            </form>
            <ul className="mt-4 space-y-1 font-mono text-sm">
                {messages.map((message, i) => (
                    <li key={i}>{message}</li>
                ))}
            </ul>
        </main>
    );
}
