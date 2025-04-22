/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect } from 'react';

// A custom hook to handle keyboard shortcuts in the application
const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the event contains metaKey (Command on macOS, Windows key on Windows)
      // or ctrlKey (Control key)
      const isMeta = event.metaKey || event.ctrlKey;
      
      // Find a matching shortcut and execute its action
      shortcuts.forEach((shortcut) => {
        if (
          isMeta === shortcut.meta &&
          event.shiftKey === !!shortcut.shift &&
          event.altKey === !!shortcut.alt &&
          event.key.toLowerCase() === shortcut.key.toLowerCase()
        ) {
          event.preventDefault(); // Prevent default browser behavior
          shortcut.action();
        }
      });
    };
    
    // Add event listener for keyboard shortcuts
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

export default useKeyboardShortcuts;