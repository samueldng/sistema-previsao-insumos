import React from 'react';

export function Card({ children, title, className = '', headerContent }: { children: React.ReactNode, title?: string, className?: string, headerContent?: React.ReactNode }) {
    return (
        <div className={`card ${className}`}>
            {(title || headerContent) && (
                <div className="card-header">
                    {title ? <span className="card-title">{title}</span> : <div />}
                    {headerContent}
                </div>
            )}
            {children}
        </div>
    )
}

export function StatCard({ label, value, sub, colorClass = '' }: { label: string, value: string | number, sub: string, colorClass?: string }) {
    return (
        <div className="stat-card">
            <div className="stat-label">{label}</div>
            <div className={`stat-value ${colorClass}`}>{value}</div>
            <div className="stat-sub">{sub}</div>
        </div>
    )
}

export function Badge({ children, colorClass }: { children: React.ReactNode, colorClass: 'bg-green' | 'bg-blue' | 'bg-orange' | 'bg-red' }) {
    return <span className={`badge ${colorClass}`}>{children}</span>
}

export function Alert({ children, type = 'info', className = '' }: { children: React.ReactNode, type?: 'info' | 'success' | 'warn', className?: string }) {
    return (
        <div className={`alert alert-${type} ${className}`}>
            {children}
        </div>
    )
}

export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', className = '' }: any) {
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
    const valClass = `btn-${variant}`;
    return (
        <button type={type} onClick={onClick} className={`btn ${valClass} ${sizeClass} ${className}`}>
            {children}
        </button>
    )
}
