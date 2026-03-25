'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export function Header({ dataStatus }: { dataStatus: string }) {
    const [time, setTime] = useState('—');

    useEffect(() => {
        const clock = setInterval(() => {
            setTime(new Date().toLocaleString('pt-BR'));
        }, 1000);
        return () => clearInterval(clock);
    }, []);

    return (
        <header>
            <div className="logo" style={{ alignItems: 'center' }}>
                <div style={{ background: '#ffffff', padding: '12px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                    <Image src="/logo.png" alt="Hemolab" width={190} height={65} style={{ objectFit: 'contain' }} priority />
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: `'DM Mono', monospace`, letterSpacing: '1px' }}>
                        SISTEMA DE PREVISÃO DE INSUMOS
                    </div>
                </div>
            </div>
            <div className="header-meta">
                <div id="clock">{time}</div>
                <div id="data-status" style={{ color: 'var(--muted)' }}>
                    {dataStatus}
                </div>
            </div>
        </header>
    )
}
