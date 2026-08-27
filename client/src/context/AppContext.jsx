import { createContext, useCallback, useEffect, useState } from 'react';
import authService from '../service/authService.js';
import projectService from '@/service/projectService.js';

import toast from 'react-hot-toast';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@/constants/messages.constants.js';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext(undefined);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  //Auth
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  //project
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [loadingActiveProject, setLoadingActiveProject] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [generatingProject, setGeneratingProject] = useState(false);
  const [activeFile, setActiveFile] = useState('/App.js');
  const [showCode, setShowCode] = useState(false);

  console.log('activeFile', activeFile);
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
    if (!user) return;

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

    if (isOngoing) {
      setChatLoading(true);
      const interval = setInterval(() => {
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
    showCode,
    setActiveFile,
    setShowCode,
    loadProjects,
    loadProject,
    handleGenerate,
    handleDelete,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
