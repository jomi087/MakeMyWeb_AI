import { homeTags } from '@/assets/assets.js';
import PromptInput from '@/components/PromptInput.jsx';
import { useAppContext } from '@/hook/useAppContext.js';
import { Button } from '@base-ui/react/button';
import { ArrowRightIcon, ClockIcon, Trash2Icon } from 'lucide-react';
import moment from 'moment/moment.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const {
    user,
    projects,
    loadingProjects,
    generatingProject,
    loadProjects,
    handleGenerate,
    handleDelete,
    logout,
  } = useAppContext();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="h-screen overflow-y-scroll text-white font-sans bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat">
      {/* Nav */}
      <nav className="sticky bg- top-0 z-10 flex items-center justify-between px-6 py-4 backdrop-blur-xs">
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
          <Button
            onClick={logout}
            className="py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 text-xs rounded-md cursor-pointer bg-transparent"
          >
            Sign out
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center  justify-center px-6 pb-20 mt-8 xl:mt-10">
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
              onSubmit={handleGenerate}
              loading={generatingProject} // temp value
              placeholder="Create a portfolio website..."
              variant="glass"
              autoFocus
            />
          </div>

          {/* Scroolling Marque tags */}
          <div className="masked-marquee w-full mt-6 max-w-2xl overflow-hidden py-1">
            <div className="animate-marquee gap-3">
              {homeTags.map((tag, i) => (
                <Button
                  disabled={generatingProject}
                  className="px-4 py-1.5 border rounded-full text-sm text-white bg-white/10 border-white/25 haver:bg-white/20 transition cursor-pointer shrink-0 font-medium"
                  onClick={() => handleGenerate(tag)}
                  key={i}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* All Projects */}
          {!loadingProjects && projects.length > 0 && (
            <div className="mt-12 w-full">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <p className="text-xs font-medimum uppercase text-zinc-100 tracking-widest ">
                  All Projects
                </p>
                <span className="text-xs text-zinc-100 font-normal">
                  {projects.length}{' '}
                  {projects.length === 1 ? 'Project' : 'Projects'}
                </span>
              </div>

              <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-1">
                {projects.map((p) => (
                  <div
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between group hover:border-white/20 hover:bg-white/10 cursor-pointer backdrop-blur-md transition-all"
                    key={p._id}
                    onClick={() => navigate(`/builder/${p._id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-zinc-300 flex items-center gap-1">
                          <ClockIcon sizse={10} />
                          {moment(p.updateAt || p.createdAt).fromNow()}
                        </span>
                        <span className="text-xs text-white/60 font-medium">
                          v{p.version}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p._id);
                        }}
                        className="p-1.5 rounded-md text-zinc-200 hover:text-red-400 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2Icon size={14} />
                      </Button>
                      <ArrowRightIcon
                        size={14}
                        className="text-zinc-200 group-hover:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
