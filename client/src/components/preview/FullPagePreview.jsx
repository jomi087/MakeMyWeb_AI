import { detectDependencies } from '@/utils/sandpackUtils.js';
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import React, { useMemo, useState } from 'react';
import SandPackErrorMonitor from '../builder/SandPackErrorMonitor.jsx';

const FullPagePreview = ({ files }) => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);

  // convert live files to sandpack format
  const sandPackFiles = useMemo(() => {
    if (!files) return {};

    const spFiles = {};
    for (const [path, content] of Object.entries(files)) {
      spFiles[path] = {
        code: content,
      };
    }
    return spFiles;
  }, [files]);

  // detect dependencies from import statement using files
  const dependencies = useMemo(() => {
    if (!files) return {};

    return detectDependencies(files);
  }, [files]);

  return (
    <div className="h-screen w-screen bg-white overflow-hidden">
      <SandpackProvider
        template="react"
        files={sandPackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            'https://cdn.tailwindcss.com',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
          ],
          logLevel: 0,
        }}
        className="h-full w-full"
      >
        <SandPackErrorMonitor onErrorChange={setShowErrorOverlay} />
        <SandpackLayout className="w-full h-full border-none! bg-transparent!">
          <SandpackPreview
            showNavigator={false}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
            showSandpackErrorOverlay={showErrorOverlay}
            className="h-full w-full"
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default FullPagePreview;
