import { useState, useEffect, RefObject } from 'react';
import Hls from 'hls.js';

export interface VideoStats {
    url: string;
    resolution: string;
    viewport: string;
    buffer: string;
    bandwidth: string;
    droppedFrames: number;
    qualityLabel: string; // e.g. "720p"
    networkColor: 'text-green-500' | 'text-yellow-500' | 'text-red-500' | 'text-gray-500'; // For UI styling
    bitrate: number; // Raw number for logic if needed
}

export function useVideoStats(
    videoRef: RefObject<HTMLVideoElement | null>,
    hlsRef: RefObject<Hls | null>,
    isPlaying: boolean
) {
    const [stats, setStats] = useState<VideoStats>({
        url: 'N/A',
        resolution: '0x0',
        viewport: '0x0',
        buffer: '0s',
        bandwidth: '0 Mbps',
        droppedFrames: 0,
        qualityLabel: '-',
        networkColor: 'text-gray-500',
        bitrate: 0,
    });

    useEffect(() => {
        // Only poll if there's a video element
        if (!videoRef.current) return;

        const updateStats = () => {
            const video = videoRef.current;
            if (!video) return;

            // 1. Viewport & Resolution
            const viewport = `${video.clientWidth}x${video.clientHeight}`;
            const resolution = `${video.videoWidth}x${video.videoHeight}`;

            // Calculate Quality Label (e.g. 1920x1080 -> 1080p)
            const height = video.videoHeight;
            let qualityLabel = 'SD';
            if (height >= 2160) qualityLabel = '4K';
            else if (height >= 1440) qualityLabel = '2K';
            else if (height >= 1080) qualityLabel = '1080p';
            else if (height >= 720) qualityLabel = '720p';
            else if (height > 0) qualityLabel = `${height}p`;

            // 2. Buffer Health
            let bufferEnd = 0;
            const { buffered, currentTime } = video;
            if (buffered && buffered.length > 0) {
                for (let i = 0; i < buffered.length; i++) {
                    if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
                        bufferEnd = buffered.end(i);
                        break;
                    }
                }
            }
            const bufferVal = Math.max(0, bufferEnd - currentTime);
            const buffer = bufferVal.toFixed(1) + 's';

            // 3. Dropped Frames
            let droppedFrames = 0;
            if (video.getVideoPlaybackQuality) {
                droppedFrames = video.getVideoPlaybackQuality().droppedVideoFrames;
            }

            // 4. Bandwidth & Network Health (from Hls.js)
            let bandwidthStr = '0 Mbps';
            let bitrate = 0;
            let networkColor: VideoStats['networkColor'] = 'text-gray-500';

            if (hlsRef.current) {
                const estimate = hlsRef.current.bandwidthEstimate; // bits per second
                if (!isNaN(estimate)) {
                    bitrate = estimate;
                    const mbps = estimate / 1000000;
                    bandwidthStr = mbps.toFixed(1) + ' Mbps';

                    // Simple health check: > 5Mbps is usually good for HD
                    if (mbps > 5) networkColor = 'text-green-500';
                    else if (mbps > 2) networkColor = 'text-yellow-500';
                    else networkColor = 'text-red-500';
                }
            }

            // 5. URL (Truncate for UI)
            const src = video.currentSrc || '';
            const url = src.split('/').pop() || 'stream.m3u8';

            setStats({
                url,
                resolution,
                viewport,
                buffer,
                bandwidth: bandwidthStr,
                droppedFrames,
                qualityLabel,
                networkColor,
                bitrate
            });
        };

        const intervalId = setInterval(updateStats, 1000);
        return () => clearInterval(intervalId);
    }, [videoRef, hlsRef, isPlaying]);

    return stats;
}
