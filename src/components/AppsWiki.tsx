import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { appsWikiData } from '../data/appsWikiData';

export default function AppsWiki() {
  const [activeTab, setActiveTab] = useState(appsWikiData[0].id);

  return (
    <div className="flex flex-col h-full bg-app-bg animate-in fade-in">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-app-border bg-app-card">
        <div className="p-2 bg-app-accent/10 rounded-lg text-app-accent">
          <BookOpen size={24} />
        </div>
        <h1 className="text-2xl font-bold text-app-text tracking-tight">Apps Wiki</h1>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-app-border bg-app-card/30 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {appsWikiData.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${
                  activeTab === item.id 
                    ? 'bg-app-accent text-white shadow-sm' 
                    : 'text-app-text hover:bg-app-accent/10 hover:text-app-accent'
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-3xl">
            {appsWikiData.map((item) => (
              <div 
                key={item.id}
                className={activeTab === item.id ? 'block animate-in fade-in slide-in-from-bottom-4' : 'hidden'}
              >
                <h2 className="text-3xl font-bold text-app-text mb-8">{item.title}</h2>
                <div className="prose prose-app dark:prose-invert max-w-none space-y-6 text-app-text leading-relaxed">
                  {item.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                      const lines = paragraph.split('\n');
                      const heading = lines[0].replace('### ', '');
                      const listItems = lines.slice(1);
                      return (
                        <div key={index} className="mb-8">
                          <h3 className="text-xl font-bold text-app-accent mb-4 border-b border-app-border pb-2">{heading}</h3>
                          {listItems.length > 0 && (
                            <ul className="list-disc pl-5 space-y-2 text-app-text/90 marker:text-app-accent/50">
                              {listItems.map((line, lIndex) => {
                                const cleanLine = line.replace(/^- /, '');
                                // Handle basic bolding
                                const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
                                return (
                                  <li key={lIndex} className="pl-1">
                                    {parts.map((part, pIndex) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={pIndex} className="font-semibold text-app-text">{part.replace(/\*\*/g, '')}</strong>;
                                      }
                                      return part;
                                    })}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    }
                    return <p key={index} className="text-app-text/90 mb-6">{paragraph}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
