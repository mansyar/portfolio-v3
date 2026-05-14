import React, { useState, useEffect } from 'react';
import { PROJECTS_METADATA, ARTICLES_METADATA, CONTACT_METADATA } from '@/lib/projects-data';
import { toggleForceDesktop } from '@/stores/desktop';

type View =
  | 'main'
  | 'projects'
  | 'knowledge-base'
  | 'contact'
  | 'project-detail'
  | 'article-detail';

interface TerminalNavProps {
  onRestart?: () => void;
}

const TerminalNav: React.FC<TerminalNavProps> = ({ onRestart }) => {
  const [currentView, setCurrentView] = useState<View>('main');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const projects = Object.entries(PROJECTS_METADATA).map(([slug, meta]) => ({ slug, ...meta }));
  const articles = Object.entries(ARTICLES_METADATA).map(([slug, meta]) => ({ slug, ...meta }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView === 'main') {
        if (e.key === '1') setCurrentView('projects');
        if (e.key === '2') setCurrentView('knowledge-base');
        if (e.key === '3') setCurrentView('contact');
        if (e.key === '4') toggleForceDesktop();
        if (e.key === '5' && onRestart) onRestart();
      } else {
        if (e.key === '0') {
          if (currentView === 'project-detail') setCurrentView('projects');
          else if (currentView === 'article-detail') setCurrentView('knowledge-base');
          else setCurrentView('main');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, onRestart]);

  const renderMain = () => (
    <div className="space-y-4">
      <h2 className="text-xl border-b border-[#00ff41] pb-2">Main Menu</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => setCurrentView('projects')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [1] Projects
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentView('knowledge-base')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [2] Knowledge Base
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentView('contact')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [3] Contact
          </button>
        </li>
        <li>
          <button
            onClick={() => toggleForceDesktop()}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [4] Desktop Mode
          </button>
        </li>
        <li>
          <button
            onClick={() => onRestart?.()}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [5] Restart
          </button>
        </li>
      </ul>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <h2 className="text-xl border-b border-[#00ff41] pb-2">Projects</h2>
      <ul className="space-y-2">
        {projects.map((p, idx) => (
          <li key={p.slug}>
            <button
              onClick={() => {
                setSelectedId(p.slug);
                setCurrentView('project-detail');
              }}
              className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
            >
              [{idx + 1}] {p.title}
            </button>
          </li>
        ))}
        <li className="mt-4 pt-4 border-t border-[#00ff41]">
          <button
            onClick={() => setCurrentView('main')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [0] Back
          </button>
        </li>
      </ul>
    </div>
  );

  const renderKB = () => (
    <div className="space-y-4">
      <h2 className="text-xl border-b border-[#00ff41] pb-2">Knowledge Base</h2>
      <ul className="space-y-2">
        {articles.map((a, idx) => (
          <li key={a.slug}>
            <button
              onClick={() => {
                setSelectedId(a.slug);
                setCurrentView('article-detail');
              }}
              className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
            >
              [{idx + 1}] {a.title}
            </button>
          </li>
        ))}
        <li className="mt-4 pt-4 border-t border-[#00ff41]">
          <button
            onClick={() => setCurrentView('main')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [0] Back
          </button>
        </li>
      </ul>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-4">
      <h2 className="text-xl border-b border-[#00ff41] pb-2">Contact</h2>
      <div className="space-y-2 py-2">
        <p>Name: {CONTACT_METADATA.name}</p>
        <p>Title: {CONTACT_METADATA.title}</p>
        <p>Email: {CONTACT_METADATA.email}</p>
        <p>GitHub: {CONTACT_METADATA.github}</p>
        <p>LinkedIn: {CONTACT_METADATA.linkedin}</p>
        <p>Location: {CONTACT_METADATA.location}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-[#00ff41]">
        <button
          onClick={() => setCurrentView('main')}
          className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
        >
          [0] Back
        </button>
      </div>
    </div>
  );

  const renderProjectDetail = () => {
    const p = PROJECTS_METADATA[selectedId!];
    return (
      <div className="space-y-4">
        <h2 className="text-xl border-b border-[#00ff41] pb-2">{p.title}</h2>
        <div className="space-y-2 py-2">
          <p className="italic">{p.description}</p>
          <p>Language: {p.language}</p>
          <p>Stack: {p.techStack.join(', ')}</p>
          <p>Stars: {p.stars}</p>
          <p>
            Repo: <span className="underline">{p.repoUrl}</span>
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-[#00ff41]">
          <button
            onClick={() => setCurrentView('projects')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [0] Back
          </button>
        </div>
      </div>
    );
  };

  const renderArticleDetail = () => {
    const a = ARTICLES_METADATA[selectedId!];
    return (
      <div className="space-y-4">
        <h2 className="text-xl border-b border-[#00ff41] pb-2">{a.title}</h2>
        <div className="space-y-2 py-2">
          <p className="italic">{a.description}</p>
          <p>Category: {a.category}</p>
          <p>Last Updated: {a.lastUpdated}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-[#00ff41]">
          <button
            onClick={() => setCurrentView('knowledge-base')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [0] Back
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="terminal-text p-2">
      {currentView === 'main' && renderMain()}
      {currentView === 'projects' && renderProjects()}
      {currentView === 'knowledge-base' && renderKB()}
      {currentView === 'contact' && renderContact()}
      {currentView === 'project-detail' && renderProjectDetail()}
      {currentView === 'article-detail' && renderArticleDetail()}
    </div>
  );
};

export default TerminalNav;
