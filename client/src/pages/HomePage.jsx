import PromptInput from '@/components/PromptInput.jsx';
import { useAppContext } from '@/hook/useAppContext.js';
import { Button } from '@base-ui/react/button';

const HomePage = () => {
  const { user } = useAppContext();
  return (
    <div className="h-screen overflow-y-scroll text-white font-sans bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <img src="/logo.svg" alt="logo" className="size-8 rotate-180" />
            <span className="text-xl font-semibold tracking-tight">ake My</span>
          </div>
          <div className="flex items-center">
            <img src="/logo.svg" alt="logo" className="size-10 " />
            <span className="text-xl font-semibold tracking-tight">eb</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-zinc-300">
          <span>{user?.name}</span>
          <Button className="py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 text-xs rounded-md cursor-pointer bg-transparent">
            Sign out
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 mt-8 xl:mt-28">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Promo badge */}
          <div className="flex items-center gap-2 p-1.5 pr-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[13px] text-white/90">
            <span className="px-3  py-1 text-[11px] bg-red-700 rounded-full font-medium tracking-wider">
              PROMO
            </span>
            <span>
              Create your first project for{' '}
              <span className="font-semibold">Free</span>.
            </span>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl md:text-6xl font-medium mt-4 max-w-2xl text-white">
            Let's build your app together
          </h1>
          <p className="text-center text-sm md:text-base max-w-xl mt-4 text-white/65 leading-relaxed">
            Describe your idea and watch AI design, structure, and launch your
            website instantly. No coding required.
          </p>

          {/* Promt input with glassmosphic variant */}
          <div className="w-full mt-6">
            <PromptInput
              onSubmit={() => {console.log("logic need to be added")}}
              loading={false} // temp value
              placeholder="Create a portfolio website..."
              variant="glass"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
