import { Loader2Icon } from 'lucide-react';
import React from 'react';

const Loading = () => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="h-screen flex flex-col items-center justify-center bg-white text-zinc-900"
    >
      <Loader2Icon size={46} className="animate-spin text-black" />
    </div>
  );
};

export default Loading;
