import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { useStore } from '@/lib/useStore';
import { $windows, $activeWindow, focusWindow, openWindow } from '@/stores/windows';
import { COMMAND_REGISTRY, parseCommand } from '@/lib/commands';
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
  return `C:${dir}MANSYAR>`;
}

/** Format command output lines as JSX elements */
function formatOutput(lines: string[], keyPrefix: string) {
  return lines.map((line, i) => (
    <div key={`${keyPrefix}-${i}`} style={{ whiteSpace: 'pre', lineHeight: '1.3' }}>
      {line}
    </div>
  ));
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
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Focus input when window becomes active
  useEffect(() => {
    if (activeWindow === windowId && inputRef.current) {
      inputRef.current.focus();
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

      setOutputLines((prev) => [...prev, ...newLines]);
    },
    [cmdPath, windowId],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      setInput('');
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
      style={{
        backgroundColor: '#000000',
        color: '#00aa00',
        fontFamily: '"Courier New", Consolas, monospace',
        fontSize: 13,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '4px 6px',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output area */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          whiteSpace: 'pre',
          lineHeight: '1.3',
        }}
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

      {/* Input line with blinking block cursor */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ whiteSpace: 'pre' }}>{prompt}</span>
        <span
          className="cmd-cursor-blink"
          style={{
            display: 'inline-block',
            width: 8,
            height: 15,
            backgroundColor: '#00aa00',
            marginRight: 2,
          }}
        />
        <input
          ref={inputRef}
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
            background: 'transparent',
            border: 'none',
            color: '#00aa00',
            fontFamily: '"Courier New", Consolas, monospace',
            fontSize: 13,
            outline: 'none',
            flex: 1,
            caretColor: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
