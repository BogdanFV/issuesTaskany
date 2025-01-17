import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

import { gapXs, gray10, gray5, gray6, gray9, radiusL } from '../design/@generated/themes';

import { CleanButton } from './CleanButton';

interface TagProps {
    title: string;
    description?: string;
    size?: 's' | 'm';
    className?: string;

    onClick?: () => void;
    onHide?: () => void;
}

const StyledCleanButton = styled(CleanButton)``;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledTag = styled(({ onHide, ...props }) => <div {...props} />)<{
    size: TagProps['size'];
    onClick: TagProps['onClick'];
    onHide: TagProps['onHide'];
}>`
    display: inline-block;
    position: relative;
    padding: 4px 12px 5px;

    border-radius: ${radiusL};

    font-size: 12px;
    line-height: 12px;
    font-weight: 500;
    color: ${gray9};
    user-select: none;

    cursor: default;

    background-color: ${gray5};

    transition: background-color, color 300ms ease-in-out;

    & + & {
        margin-left: ${gapXs};
    }

    ${({ onHide }) =>
        !onHide &&
        css`
            &:hover {
                color: ${gray10};

                background-color: ${gray6};
            }
        `}

    &:hover {
        ${StyledCleanButton} {
            visibility: visible;

            cursor: pointer;
        }
    }

    ${({ onClick }) =>
        onClick &&
        css`
            cursor: pointer;
        `}

    ${({ size }) =>
        size === 's' &&
        css`
            padding: 3px 10px;
            font-size: 11px;
        `}
`;

export const Tag: React.FC<TagProps> = ({ title, description, size = 'm', onClick, onHide, className }) => {
    const onHideClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            onHide && onHide();
        },
        [onHide],
    );

    return (
        <StyledTag size={size} onClick={onClick} onHide={onHide} title={description} className={className}>
            {onHide && <StyledCleanButton onClick={onHideClick} />}
            {title}
        </StyledTag>
    );
};
