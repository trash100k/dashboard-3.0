import { useState, useCallback } from 'react';
import { useStore, genId, type FolderNode } from '../store';
import { Button, Badge } from '../components/ui';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Plus, CheckSquare, Square } from 'lucide-react';
import { cn } from '../lib/utils';

function TreeItem({
  node,
  depth,
  onToggleExpand,
  onToggleCheck,
}: {
  node: FolderNode;
  depth: number;
  onToggleExpand: (id: string) => void;
  onToggleCheck: (fileId: string, checkId: string) => void;
}) {
  const isFolder = node.type === 'folder';
  const isExpanded = isFolder && node.expanded;
  const hasChecklist = node.checklist && node.checklist.length > 0;

  const doneCount = node.checklist?.filter((c) => c.done).length ?? 0;
  const totalCount = node.checklist?.length ?? 0;

  return (
    <div>
      {/* Row */}
      <div
        className={cn(
          'flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200 group',
          'hover:bg-bg-elevated',
          isExpanded && 'bg-bg-elevated/50'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isFolder) onToggleExpand(node.id);
        }}
      >
        {/* Chevron for folders */}
        {isFolder ? (
          <span className="text-muted flex-shrink-0 transition-transform duration-200">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        ) : (
          <span className="w-[14px] flex-shrink-0" />
        )}

        {/* Icon */}
        {isFolder ? (
          isExpanded ? (
            <FolderOpen size={16} className="text-gold flex-shrink-0" />
          ) : (
            <Folder size={16} className="text-muted group-hover:text-fog/80 transition-colors flex-shrink-0" />
          )
        ) : (
          <FileText size={14} className="text-emerald/70 flex-shrink-0" />
        )}

        {/* Name */}
        <span
          className={cn(
            'text-sm truncate flex-1',
            isFolder ? 'text-fog font-medium' : 'text-fog/70'
          )}
        >
          {node.name}
        </span>

        {/* Checklist badge */}
        {hasChecklist && (
          <Badge variant={doneCount === totalCount ? 'emerald' : 'muted'} className="text-[10px] px-1.5 py-0">
            {doneCount}/{totalCount}
          </Badge>
        )}
      </div>

      {/* Checklist items (inline, for files) */}
      {!isFolder && hasChecklist && (
        <div className="space-y-0.5" style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}>
          {node.checklist!.map((check) => (
            <label
              key={check.id}
              className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-bg-elevated transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onToggleCheck(node.id, check.id)}
                className="flex-shrink-0 text-muted hover:text-emerald transition-colors cursor-pointer"
              >
                {check.done ? (
                  <CheckSquare size={14} className="text-emerald" />
                ) : (
                  <Square size={14} />
                )}
              </button>
              <span
                className={cn(
                  'text-xs transition-colors',
                  check.done ? 'text-muted line-through' : 'text-fog/60'
                )}
              >
                {check.label}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Children (for folders) — smooth expand/collapse */}
      {isFolder && node.children && (
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isExpanded ? `${node.children.length * 60}px` : '0px',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onToggleExpand={onToggleExpand}
              onToggleCheck={onToggleCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SuperFoldersPage() {
  const { folders, setFolders } = useStore();
  const [newFolderName, setNewFolderName] = useState('');

  const toggleExpand = useCallback(
    (id: string) => {
      const updateNodes = (nodes: FolderNode[]): FolderNode[] =>
        nodes.map((n) => {
          if (n.id === id && n.type === 'folder') {
            return { ...n, expanded: !n.expanded };
          }
          if (n.children) {
            return { ...n, children: updateNodes(n.children) };
          }
          return n;
        });
      setFolders(updateNodes(folders));
    },
    [folders, setFolders]
  );

  const toggleCheck = useCallback(
    (fileId: string, checkId: string) => {
      const updateNodes = (nodes: FolderNode[]): FolderNode[] =>
        nodes.map((n) => {
          if (n.id === fileId && n.checklist) {
            return {
              ...n,
              checklist: n.checklist.map((c) =>
                c.id === checkId ? { ...c, done: !c.done } : c
              ),
            };
          }
          if (n.children) {
            return { ...n, children: updateNodes(n.children) };
          }
          return n;
        });
      setFolders(updateNodes(folders));
    },
    [folders, setFolders]
  );

  const addFolder = () => {
    const name = newFolderName.trim() || 'New Folder';
    setFolders([
      ...folders,
      {
        id: genId(),
        name,
        type: 'folder',
        expanded: false,
        children: [],
      },
    ]);
    setNewFolderName('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-fog">Super Folders</h1>
          <p className="text-xs text-muted mt-0.5">Hierarchical file & checklist manager</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addFolder()}
            placeholder="Folder name..."
            className="bg-bg-base border border-border rounded-lg px-3 py-1.5 text-xs text-fog placeholder:text-muted focus:outline-none focus:border-emerald/40 transition-colors w-40"
          />
          <Button variant="emerald" size="sm" onClick={addFolder}>
            <Plus size={14} />
            New Folder
          </Button>
        </div>
      </div>

      {/* Tree */}
      <div className="bg-bg-surface border border-border rounded-xl p-3">
        {folders.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            depth={0}
            onToggleExpand={toggleExpand}
            onToggleCheck={toggleCheck}
          />
        ))}
      </div>
    </div>
  );
}
