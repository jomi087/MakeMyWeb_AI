import Loading from '@/components/common/Loading.jsx';
import FullPagePreview from '@/components/preview/FullPagePreview.jsx';
import { useAppContext } from '@/hook/useAppContext.js';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PreviewPage = () => {
  const { id } = useParams();

  const {
    activeProject: project,
    loadingActiveProject: loading,
    loadProject,
  } = useAppContext();

  useEffect(() => {
    if (!id) return;
    loadProject(id);
  }, [id, loadProject]);

  if (loading || !project) {
    return <Loading />;
  }

  return <FullPagePreview files={project.files} />;
};

export default PreviewPage;
