// src/components/Navigation/RedirectMessage.tsx
import React from 'react';
import { RedirectMessage as StyledRedirectMessage } from '@components/Navbar/NavbarStyles';

interface RedirectMessageProps {
  countdown: number;
  cancelRedirect: () => void;
}

const RedirectMessage: React.FC<RedirectMessageProps> = ({ countdown, cancelRedirect }) => (
  <StyledRedirectMessage redirecting={true}>
    <div className="flex w-full items-center justify-between">
      <span>Redirecting in {countdown} seconds...</span>
      <div className="px-4 py-1 md:visible">
        <button
          onClick={cancelRedirect}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              cancelRedirect();
            }
          }}
          tabIndex={0}
          className="text-white bg-transparent cursor-pointer hover:text-[#bfbfbf] transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </StyledRedirectMessage>
);

export default RedirectMessage;
