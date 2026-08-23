import { BRAND_NAME } from '@/constants/app.constants.js';
import React from 'react';

const LoginLeft = () => {
  return (
    <div className="hidden lg:flex lg:w-2/5 bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat flex-col justify-between p-12 shrink-0 select-none">
      <div>
        <div className="tracking-tight text-4xl font-bold  text-white">
          <p className="">
            <span className="font-serif">M</span>ake My
          </p>
          <div className="flex pl-4">
            <img src="/logo.svg" alt="Logo" className="size-16.5" />
            <div>
              <p className="font-serif">ebsite</p>
              <p className="font-mono tracking-wider text-zinc-400 text-xs text-center">
                A.I Website Builder
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-3xl text-white font-medium leading-snug mb-3 tracking-tight">
          Build your presence on web
        </h2>
        <p className="text-zinc-300">
          Describe what you need, previw instantly, and customize your site in
          real-time. React with clean JSX, verified layout code exports.
        </p>
        <p className="text-zinc-300 text-sm mt-12">
          Copyright {new Date().getFullYear()}{' '}
          <span className="font-bold">{BRAND_NAME}</span>
        </p>
      </div>
    </div>
  );
};

export default LoginLeft;
