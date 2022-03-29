import React from 'react';
import dynamic from 'next/dynamic';

const componentsMap = {
    plus: dynamic(() => import('teenyicons/outline/plus-circle.svg')),
    user: dynamic(() => import('teenyicons/outline/user.svg')),
    sun: dynamic(() => import('teenyicons/outline/sun.svg')),
    moon: dynamic(() => import('teenyicons/outline/moon.svg')),
    bookmark: dynamic(() => import('teenyicons/outline/bookmark.svg')),
    bulbOn: dynamic(() => import('teenyicons/outline/double-caret-up-circle.svg')),
    cog: dynamic(() => import('teenyicons/outline/cog.svg')),
    arrowDownSmall: dynamic(() => import('teenyicons/outline/down-small.svg')),
    clipboardPlus: dynamic(() => import('teenyicons/outline/clipboard-plus.svg')),
    clipboardTick: dynamic(() => import('teenyicons/outline/clipboard-tick.svg')),
};

const sizesMap = {
    s: 16,
    m: 32,
    l: 48,
};

interface IconProps {
    type: keyof typeof componentsMap;
    size: keyof typeof sizesMap;
    color?: string;
    stroke?: number;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const Icon: React.FC<IconProps> = ({ type, size, color, stroke = 1, className, onClick }) => {
    const Component: React.ComponentType<any> = componentsMap[type];
    const sizePx = `${sizesMap[size]}px`;

    return (
        <span className={className} style={{ lineHeight: 'initial' }} onClick={onClick}>
            <Component width={sizePx} height={sizePx} color={color} strokeWidth={stroke} />
        </span>
    );
};
