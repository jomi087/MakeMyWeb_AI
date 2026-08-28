import { Loader2Icon } from 'lucide-react';
import React from 'react';

const Loading = () => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="h-screen flex items-center justify-center bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat"
    >
      <Loader2Icon size={46} className="animate-spin text-white" />
    </div>
  );
};

export default Loading;
