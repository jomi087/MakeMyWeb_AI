import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import authService from '../service/authService.js';
import projectService from '@/service/projectService.js';

import toast from 'react-hot-toast';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@/constants/messages.constants.js';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

export const AppContext = createContext(undefined);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  //Auth
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  //project
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [activeProject, setActiveProject] = useState(null);
  const [loadingActiveProject, setLoadingActiveProject] = useState(true);

  const [chatLoading, setChatLoading] = useState(false);
  const [generatingProject, setGeneratingProject] = useState(false);

  const [activeFile, setActiveFile] = useState('/App.js');
  const [showCode, setShowCode] = useState(false);

  // console.log('activeFile', activeFile);
  //Auth Actions
  const checkSession = async () => {
    try {
      const user = await authService.check();
      setUser(user);
    } catch (error) {
      console.log('checkSession', error);
      const errorMessage = error?.response?.data?.error;
      toast.error(errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const register = async (name, email, password) => {
    const user = await authService.register(name, email, password);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setProjects([]);
      setActiveProject(null);
      toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
      navigate('/login');
    } catch (error) {
      console.log('logout', error);
      //const errorMessage = error?.response?.data?.error;
      toast.error(ERROR_MESSAGES.LOGOUT_FAILED);
    }
  };

  const loadProjects = async () => {
    if (!user) {
      setLoadingProjects(false);
      return;
    }

    try {
      const data = await projectService.list();
      setProjects(data);
    } catch (error) {
      console.log('Failed to list projects', error);
      toast.error(ERROR_MESSAGES.PROJECT_LIST_FAILED);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadProject = useCallback(
    async (id, silent = false) => {
      //silent means silent api call (reason using poll to make api call)
      if (!user) return;

      if (!silent) setLoadingActiveProject(true);

      try {
        const data = await projectService.getById(id);
        console.log('loaded project data', data);
        setActiveProject(data);

        //default file selection
        const files = Object.keys(data.files);
        console.log('files from API', files);

        if (files.length > 0) {
          setActiveFile((prev) => {
            if (files.includes(prev)) return prev;
            if (files.includes('/App.js')) return '/App.js';
            console.log('files outcome', files);
            return files[0];
          });
        }
      } catch (error) {
        console.log('Failed to get project', error);
        if (!silent) {
          toast.error(ERROR_MESSAGES.PROJECT_GET_FAILED);
          navigate('/');
        }
      } finally {
        if (!silent) {
          setLoadingActiveProject(false);
        }
      }
    },
    [user, navigate]
  );

  //Automatically poll active project status if generating or pending
  useEffect(() => {
    if (!activeProject?._id || !user) return;

    const isOngoing =
      activeProject?.status === 'generating' ||
      activeProject?.status === 'pending' ||
      activeProject?.status === 'revising';

    // console.log(activeProject.status)
    if (isOngoing) {
      setChatLoading(true);
      const interval = setInterval(() => {
        console.log('hi i am polling loadProject from AppContext');
        loadProject(activeProject._id, true);
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setChatLoading(false);
    }
  }, [activeProject?._id, activeProject?.status, loadProject, user]);

  const handleGenerate = useCallback(
    async (prompt) => {
      if (!user) return;
      setGeneratingProject(true);
      try {
        const data = await projectService.generate(prompt);
        console.log('generated project data', data);
        toast.success(SUCCESS_MESSAGES.PROJECT_GENERATION_STARTED);
        navigate(`/builder/${data._id}`);
      } catch (error) {
        console.log('Failed to generate project', error);
        const errorMessage = error?.response?.data?.error;
        toast.error(errorMessage || ERROR_MESSAGES.PROJECT_GENERATATION_FAILED);
      } finally {
        setGeneratingProject(false);
      }
    },
    [navigate, user]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!user) return;
      try {
        await projectService.remove(id);
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success(SUCCESS_MESSAGES.PROJECT_DELETE_SUCCESS);
      } catch (error) {
        console.log('Failed to delete project', error);
        toast.error(ERROR_MESSAGES.PROJECT_DELETE_FAILED);
      }
    },
    [user]
  );

  const handleChat = useCallback(
    async (prompt) => {
      if (!activeProject || !user) return;

      setChatLoading(true);
      try {
        const data = await projectService.projectChat(
          activeProject._id,
          prompt
        );
        setActiveProject(data);

        if (data.errors && data.errors.length > 0) {
          toast.error(ERROR_MESSAGES.REVISION_PATCH_FAILED(data.errors.length));
        } else {
          toast.success(
            SUCCESS_MESSAGES.PROJECT_REVISION_SUCCESS(data.version)
          );
        }
      } catch (error) {
        console.log('Revision request failed', error);
        const errorMessage = error?.response?.data?.error;
        toast.error(errorMessage || ERROR_MESSAGES.PROJECT_REVISION_FAILED);
      } finally {
        setChatLoading(false);
      }
    },
    [activeProject, user]
  );

  // Purpose of useMemo:
  // Lodash's debounce method is not aware of React's render cycle.
  // useMemo preserves the same debounced function instance across re-renders,
  // preventing a new debounce timer from being created on every render.
  // The empty dependency array means it is created once per component mount.
  //
  // Alternative:
  // Use useDebouncedCallback from the "use-debounce" package.
  // It is designed for React and manages the debounced callback across re-renders,
  // so you don't need to wrap Lodash's debounce method in useMemo.
  const debouncedSave = useMemo(
    () =>
      debounce(async (files, id) => {
        try {
          await projectService.updateProjectFiles(files, id);
        } catch (err) {
          console.error('Failed to auto-save files:', err);
          toast.error('Failed to save code modifications');
        }
      }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  //auto save logic
  const updateProjectFiles = useCallback(
    async (files) => {
      if (!activeProject || !user) return;
      debouncedSave(files, activeProject._id);
    },
    [activeProject, user, debouncedSave]
  );

  const value = {
    user,
    loadingUser,
    login,
    register,
    logout,
    projects,
    loadingProjects,
    activeProject,
    loadingActiveProject,
    chatLoading,
    generatingProject,
    activeFile,
    updateProjectFiles,
    showCode,
    setActiveFile,
    setShowCode,
    loadProjects,
    loadProject,
    handleGenerate,
    handleDelete,
    handleChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
