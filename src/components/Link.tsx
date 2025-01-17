import React from 'react';
import styled, { css } from 'styled-components';

import { link10 } from '../design/@generated/themes';

interface LinkProps extends React.HTMLProps<HTMLLinkElement> {
    inline?: boolean;
    className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledLink = styled(({ forwardRef, inline, ...props }) => <a ref={forwardRef} {...props} />)`
    color: ${link10};

    transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
    transition-property: color;

    cursor: pointer;

    &:hover,
    &:focus {
        transition-duration: 0.1s;
    }

    ${({ inline }) =>
        inline &&
        css`
            color: inherit;
            text-decoration: none;

            &:hover {
                color: ${link10};
            }
        `}
`;

// eslint-disable-next-line react/display-name
export const Link = React.forwardRef<HTMLLinkElement, LinkProps>(({ as, ...props }, ref) => {
    return <StyledLink {...props} forwardRef={ref} />;
});
