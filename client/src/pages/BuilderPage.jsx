import BuilderHeader from '@/components/builder/BuilderHeader.jsx';
import ChatPanel from '@/components/builder/ChatPanel.jsx';
import Loading from '@/components/common/Loading.jsx';
import { useAppContext } from '@/hook/useAppContext.js';
import { FolderTreeIcon, MessageSquareIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leftTab, setLeftTab] = useState('chat');
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  const {
    activeProject,
    loadingActiveProject,
    activeFile,
    showCode,
    setActiveFile,
    setShowCode,
    loadProject,
    logout,
    handleChat,
    chatLoading,
  } = useAppContext();

  useEffect(() => {
    if (!id) return;

    loadProject(id);
  }, [id, loadProject]);

  //#do we need this
  // useEffect(() => {
  //   if (!id || !activeProject) return;
  //   console.log(activeProject.status);

  //   if (
  //     activeProject.status === 'pending' ||
  //     activeProject.status === 'generating'
  //   ) {
  //     const interval = setInterval(() => {
  //       console.log('hi i am polling loadProject from builder Page');
  //       loadProject(id, true);
  //     }, 1500);

  //     return () => clearInterval(interval);
  //   }
  // }, [id, activeProject, loadProject]);

  const handleOpenPreview = () => {
    if (!id) return;

    window.open(`/preview/${id}`, '_blank');
  };

  const handlePublish = () => {};
  const handleDownFload = () => {};

  if (loadingActiveProject || !activeProject) {
    return <Loading />;
  }

  return (
    <div
      className="h-screen flex flex-col bg-white overflow-hidden text-zinc-900
      relative"
    >
      {/* Top Bar Header */}
      <BuilderHeader
        projectName={activeProject.name}
        version={activeProject.version}
        showCode={showCode}
        publishing={publishing}
        onToggleShowCode={() => setShowCode(!showCode)}
        onOpenPreview={handleOpenPreview}
        onPublish={handlePublish}
        onDownload={handleDownFload}
        onBack={() => navigate('/')}
        onLogout={logout}
      />
      {/* MainLayout */}

      <div className="flex-1 flex overflow-hidden">
        {/* left sideBar */}
        <div className="w-[320px] shrink-0 flex flex-col border-r border-zinc-200 bg-white ">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-zinc-100">
            <button
              onClick={() => setLeftTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer ${
                leftTab === 'chat'
                  ? 'text-zinc-900 border-b-2 border-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <MessageSquareIcon size={13} /> Chat
            </button>

            <button
              onClick={() => setLeftTab('files')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer ${
                leftTab === 'files'
                  ? 'text-zinc-900 border-b-2 border-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <FolderTreeIcon size={13} /> Files
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden">
            {leftTab === 'chat' ? (
              <ChatPanel
                messages={activeProject.messages}
                onSend={handleChat}
                loading={chatLoading}
              />
            ) : (
              <div>file Explorer</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
