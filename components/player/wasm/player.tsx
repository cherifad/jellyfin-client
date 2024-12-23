'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useRef, useState } from 'react';

export default function VideoPlayer() {
    const [isFFmpegLoaded, setFFmpegLoaded] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [jellyfinUrl, setJellyfinUrl] = useState('');
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    // Initialize ffmpeg.wasm
    const initializeFFmpeg = async () => {
        setProcessing(true);
        const ffmpeg = ffmpegRef.current;
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        try {
            ffmpeg.on('log', ({ message }) => {
                if (messageRef.current) messageRef.current.textContent = message;
            });

            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            setFFmpegLoaded(true);
        } catch (error) {
            console.error('Failed to load ffmpeg:', error);
        } finally {
            setProcessing(false);
        }
    };

    // Fetch video stream from Jellyfin API
    const fetchJellyfinStream = async () => {
        try {
            const response = await fetch('https://your-jellyfin-server/api/stream', {
                headers: {
                    Authorization: 'Bearer your-access-token', // Replace with actual token
                },
            });
            if (!response.ok) throw new Error('Failed to fetch stream');
            setJellyfinUrl(response.url);
        } catch (error) {
            console.error('Error fetching Jellyfin stream:', error);
            if (messageRef.current) messageRef.current.textContent = 'Failed to fetch Jellyfin stream.';
        }
    };

    // Transcode and play the video
    const transcodeAndPlay = async () => {
        if (!jellyfinUrl) {
            if (messageRef.current) messageRef.current.textContent = 'No Jellyfin stream URL available.';
            return;
        }

        const ffmpeg = ffmpegRef.current;
        setProcessing(true);

        try {
            await ffmpeg.writeFile('input', await fetchFile(jellyfinUrl));
            await ffmpeg.exec(['-i', 'input', '-c:v', 'libx264', 'output.mp4']);
            const data = await ffmpeg.readFile('output.mp4');

            if (videoRef.current) {
                videoRef.current.src = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
            }
        } catch (error) {
            console.error('Error during transcoding:', error);
            if (messageRef.current) messageRef.current.textContent = 'Error during transcoding.';
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="video-player-container">
            {!isFFmpegLoaded ? (
                <button onClick={initializeFFmpeg} disabled={isProcessing}>
                    {isProcessing ? 'Loading FFmpeg...' : 'Load FFmpeg'}
                </button>
            ) : (
                <>
                    <button onClick={fetchJellyfinStream}>Fetch Jellyfin Stream</button>
                    <button onClick={transcodeAndPlay} disabled={isProcessing || !jellyfinUrl}>
                        {isProcessing ? 'Processing...' : 'Transcode & Play'}
                    </button>
                    <video ref={videoRef} controls style={{ width: '100%' }}></video>
                    <p ref={messageRef}></p>
                </>
            )}
        </div>
    );
}
