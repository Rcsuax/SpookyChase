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
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-lg bg-[#1a1326] p-6 shadow-xl"
            >
                <h2 className="text-xl font-semibold text-white">What's your name?</h2>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    autoComplete="off"
                    maxLength={20}
                    placeholder="Your name"
                    className="mt-4 w-full rounded-md border border-gray-600 bg-black/30 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
                <button
                    disabled={!trimmed}
                    className="mt-4 w-full rounded-md bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-500 disabled:opacity-50"
                >
                    Continue
                </button>
            </form>
        </div>
    );
}
