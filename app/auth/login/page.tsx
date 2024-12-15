"use client";

import React, { useState } from 'react';
import { useJellyfinStore } from '@/store/jellyfinStore';

const Login: React.FC = () => {
    const { connect } = useJellyfinStore();
    const [serverUrl, setServerUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setError(null);
            await connect(serverUrl, username, password);
            console.log('Login successful.');
        } catch (err) {
            setError('Failed to connect to Jellyfin. Check your credentials.');
        }
    };

    return (
        <div>
            <h1>Login to Jellyfin</h1>
            <input
                type="text"
                placeholder="Jellyfin Server URL"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;
