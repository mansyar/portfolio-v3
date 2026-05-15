import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { useStore } from '@/lib/useStore';
import { $windows, $activeWindow, focusWindow, openWindow } from '@/stores/windows';
import { COMMAND_REGISTRY, parseCommand } from '@/lib/commands';
import { getChildren } from '@/lib/filesystem';
import type { WindowId } from '@/stores/windows';
import type { CmdOutput } from '@/lib/commands';

interface CmdPromptProps {
  windowId: string;
}

const WELCOME_BANNER = [
  '',
  '  __  __    _    ____  ____',
  ' |  \\/  |  / \\  |  _ \\|  _ \\',
  ' | |\\/| | / _ \\ | |_) | |_) |',
  ' | |  | |/ ___ \\|  __/|  __/',
  ' |_|  |_/_/   \\_\\_|   |_|',
  '      __  __    _    ____  ____',
  '      \\ \\/ /   / \\  |  _ \\|  _ \\',
  '       \\  /   / _ \\ | |_) | |_) |',
  '        /  \\  / ___ \\|  __/|  __/',
  '       /_/\\_\\/_/   \\_\\_|   |_|',
  '',
  '===============================================',
  ' Welcome to Luna OS Command Prompt v1.0',
  " Type 'help' to see available commands.",
  '===============================================',
  '',
];

function getPrompt(cmdPath: string): string {
  const drive = cmdPath.split('\\')[0] || 'C:';
  const rest = cmdPath.slice(drive.length);
  const dir = rest || '\\';
  return `C:${dir} [MANSYAR]>`;
}

/** Format command output lines as JSX elements */
function formatOutput(lines: string[], keyPrefix: string) {
  return lines.map((line, i) => (
    <div key={`${keyPrefix}-${i}`} style={{ whiteSpace: 'pre', lineHeight: '1.3' }}>
      {line}
    </div>
  ));
}

/**
 * Find command completions for a given prefix.
 * Returns up to the first 9 matches.
 */
function getTabCompletions(prefix: string, cmdPath: string): string[] {
  const trimmed = prefix.trim();
  if (!trimmed) return [];

  // Check if completing a command name (no space in input yet)
  if (!trimmed.includes(' ')) {
    const canonicalNames = Object.keys(COMMAND_REGISTRY).filter(
      (name) =>
        name === name.toLowerCase() && !['dir', 'chdir', 'type', 'cls', '/?'].includes(name),
    );
    const matches = canonicalNames.filter((cmd) => cmd.startsWith(trimmed));
    return matches.slice(0, 9);
  }

  // Completing an argument
  const parts = trimmed.split(/\s+/);
  const command = parts[0]!.toLowerCase();
  const partial = parts.slice(1).join(' ') || '';
  const children = getChildren(cmdPath);

  if (command === 'cd' || command === 'chdir') {
    // Tab-complete folder/drive names from the filesystem
    const folderMatches = children
      .filter((n) => n.type === 'folder' || n.type === 'drive')
      .map((n) => n.name)
      .filter((name) => name.toLowerCase().startsWith(partial.toLowerCase()))
      .slice(0, 9);
    return folderMatches;
  }

  if (command === 'cat' || command === 'type' || command === 'open') {
    // Tab-complete file slugs from the current directory
    const fileMatches = children
      .filter((n) => n.type === 'file')
      .map((n) => n.slug)
      .filter((slug) => slug.toLowerCase().startsWith(partial.toLowerCase()))
      .slice(0, 9);
    return fileMatches;
  }

  return [];
}

export function CmdPrompt({ windowId }: CmdPromptProps) {
  const windows = useStore($windows);
  const activeWindow = useStore($activeWindow);
  const windowState = windows[windowId as WindowId];
  const cmdPath = windowState?.cmdPath ?? 'C:\\';

  const [outputLines, setOutputLines] = useState<(string | string[])[]>(() => [WELCOME_BANNER]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Focus input when window becomes active
  useEffect(() => {
    if (activeWindow === windowId && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [activeWindow, windowId]);

  const executeCommand = useCallback(
    (text: string) => {
      const { command, args } = parseCommand(text);

      if (!command) return; // Empty input, do nothing

      // Add to history (don't add duplicates of the last entry)
      setHistory((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === text) return prev;
        return [...prev, text];
      });
      setHistoryIndex(-1);

      const handler = COMMAND_REGISTRY[command];

      if (!handler) {
        // Unknown command — XP-style error
        setOutputLines((prev) => [
          ...prev,
          `${getPrompt(cmdPath)}${text}`,
          `'${command}' is not recognized as an internal or external command,`,
          'operable program or batch file.',
          '',
        ]);
        return;
      }

      const result: CmdOutput = handler(args, { cmdPath });

      if (result.clear) {
        setOutputLines([WELCOME_BANNER]);
        return;
      }

      const newLines: (string | string[])[] = [`${getPrompt(cmdPath)}${text}`];

      if (result.lines.length > 0) {
        newLines.push(result.lines);
      } else {
        newLines.push('');
      }

      // Handle newCmdPath - update the store
      if (result.newCmdPath !== undefined) {
        const current = $windows.get();
        const state = current[windowId as WindowId];
        if (state && state.cmdPath !== result.newCmdPath) {
          const updated = { ...state, cmdPath: result.newCmdPath };
          $windows.set({ ...current, [windowId as WindowId]: updated });
        }
      }

      // Handle openExplorer - open Explorer and navigate to the path
      if (result.openExplorer) {
        openWindow('explorer');
        const current = $windows.get();
        const explorer = current.explorer;
        if (explorer) {
          const updated = { ...explorer, explorerPath: result.openExplorer };
          $windows.set({ ...current, explorer: updated });
        }
      }

      // Handle openUrl - open in new tab
      if (result.openUrl) {
        window.open(result.openUrl, '_blank');
      }

      // Handle openWindow - open a game/app window
      if (result.openWindow) {
        openWindow(result.openWindow);
      }

      setOutputLines((prev) => [...prev, ...newLines]);
    },
    [cmdPath, windowId],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion
      const completions = getTabCompletions(input, cmdPath);
      if (completions.length === 1) {
        // Single match: auto-complete
        const rest = input.trim().includes(' ')
          ? input.replace(/\S+$/, completions[0]!)
          : `${completions[0]} `;
        setInput(rest);
      } else if (completions.length > 1) {
        // Multiple matches: show options
        setOutputLines((prev) => [...prev, '', completions.join('    '), '']);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]!);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]!);
      }
    }
  };

  const prompt = getPrompt(cmdPath);

  return (
    <div
      role="terminal"
      aria-label="Command Prompt"
      ref={outputRef}
      style={{
        backgroundColor: '#000000',
        color: '#00aa00',
        fontFamily: '"Courier New", Consolas, monospace',
        fontSize: 13,
        height: '100%',
        overflow: 'auto',
        padding: '4px 0 4px 6px',
      }}
      onClick={() => hiddenInputRef.current?.focus()}
    >
      {/* Output content — flows naturally, outer wrapper handles scrollbars */}
      <div
        role="log"
        aria-live="polite"
        style={{ minWidth: 'max-content', whiteSpace: 'pre', lineHeight: '1.3' }}
      >
        {outputLines.map((item, i) => {
          if (Array.isArray(item)) {
            return formatOutput(item, `block-${i}`);
          }
          return (
            <div key={`line-${i}`} style={{ whiteSpace: 'pre', lineHeight: '1.3' }}>
              {item}
            </div>
          );
        })}
      </div>

      {/* Input line — sticky at bottom, always visible when scrolling vertically */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          minHeight: 19,
          paddingRight: 6,
          backgroundColor: '#000000',
        }}
      >
        <span style={{ whiteSpace: 'pre', flexShrink: 0 }}>{prompt}</span>
        <div style={{ position: 'relative', flex: 1, minHeight: 19 }}>
          {/* Visible text + blinking cursor */}
          <span
            style={{
              whiteSpace: 'pre',
              color: '#00aa00',
              pointerEvents: 'none',
              lineHeight: '19px',
            }}
          >
            {input}
            <span className="cmd-cursor-blink" style={{ backgroundColor: '#00aa00' }}>
              {' '}
            </span>
          </span>
          {/* Hidden input captures keystrokes */}
          <input
            ref={hiddenInputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => focusWindow(windowId as WindowId)}
            role="textbox"
            aria-label="Command input"
            spellCheck={false}
            autoComplete="off"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              caretColor: 'transparent',
              fontSize: 13,
              fontFamily: '"Courier New", Consolas, monospace',
              border: 'none',
              outline: 'none',
              padding: 0,
              margin: 0,
              background: 'transparent',
              color: 'transparent',
            }}
          />
        </div>
      </div>
    </div>
  );
}
