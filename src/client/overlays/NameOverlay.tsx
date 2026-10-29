import { useState, type FormEvent } from 'react';

type Props = {
    onSubmit: (name: string) => void;
};

export default function NameOverlay({ onSubmit }: Props) {
    const [name, setName] = useState('');
    const trimmed = name.trim();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!trimmed) return;
        onSubmit(trimmed);
    }

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
            >
                <h2 className="text-xl font-semibold">What's your name?</h2>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    autoComplete="off"
                    placeholder="Your name"
                    className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
                <button
                    disabled={!trimmed}
                    className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    Continue
                </button>
            </form>
        </div>
    );
}
