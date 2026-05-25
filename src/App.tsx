import { useState } from 'react';
import { StoreProvider } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import SuperFolders from './pages/SuperFolders';
import AppHub from './pages/AppHub';
import AssetLibrary from './pages/AssetLibrary';
import Projects from './pages/Projects';
import LivingDoc from './pages/LivingDoc';
import Settings from './pages/Settings';
import IntelSearch from './pages/IntelSearch';
import Factories from './pages/Factories';

const pages: Record<string, { title: string; component: React.ComponentType }> = {
  home: { title: 'Home', component: Home },
  superfolders: { title: 'Super-Folders', component: SuperFolders },
  apphub: { title: 'App Hub', component: AppHub },
  assets: { title: 'Asset Library', component: AssetLibrary },
  projects: { title: 'Projects', component: Projects },
  livingdoc: { title: 'Living Document', component: LivingDoc },
  settings: { title: 'Settings', component: Settings },
  intelsearch: { title: 'Intel & Search', component: IntelSearch },
  factories: { title: 'Factories', component: Factories },
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const page = pages[currentPage];
  const PageComponent = page.component;

  return (
    <StoreProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        <PageComponent />
      </Layout>
    </StoreProvider>
  );
}

export default App;