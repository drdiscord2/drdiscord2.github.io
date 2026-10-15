import { lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CompareTray } from '@/components/CompareTray';
import { Toaster } from '@/components/Toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Home = lazy(() => import('@/pages/Home'));
const HardwareList = lazy(() => import('@/pages/HardwareList'));
const HardwareDetail = lazy(() => import('@/pages/HardwareDetail'));
const Compare = lazy(() => import('@/pages/Compare'));
const Builder = lazy(() => import('@/pages/Builder'));
const Benchmarks = lazy(() => import('@/pages/Benchmarks'));
const News = lazy(() => import('@/pages/News'));
const ArticlePage = lazy(() => import('@/pages/ArticlePage'));
const Guides = lazy(() => import('@/pages/Guides'));
const Glossary = lazy(() => import('@/pages/Glossary'));
const Tools = lazy(() => import('@/pages/Tools'));
const Games = lazy(() => import('@/pages/Games'));
const Community = lazy(() => import('@/pages/Community'));
const About = lazy(() => import('@/pages/About'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          {/* Layout renders <Outlet/> inside <main>, with per-route error boundary */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cpu" element={<HardwareList kind="cpu" />} />
            <Route path="gpu" element={<HardwareList kind="gpu" />} />
            <Route path="cpu/:slug" element={<HardwareDetail kind="cpu" />} />
            <Route path="gpu/:slug" element={<HardwareDetail kind="gpu" />} />
            <Route path="compare" element={<Compare />} />
            <Route path="builder" element={<Builder />} />
            <Route path="benchmarks" element={<Benchmarks />} />
            <Route path="news" element={<News />} />
            <Route path="article/:slug" element={<ArticlePage />} />
            <Route path="guides" element={<Guides />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="tools" element={<Tools />} />
            <Route path="games" element={<Games />} />
            <Route path="community" element={<Community />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <CompareTray />
        <Toaster />
      </HashRouter>
    </ErrorBoundary>
  );
}
