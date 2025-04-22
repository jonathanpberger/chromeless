/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { renderHook } from '@testing-library/react';
import useKeyboardShortcuts from './use-keyboard-shortcuts';

describe('useKeyboardShortcuts', () => {
  const addEventListenerMock = jest.spyOn(window, 'addEventListener');
  const removeEventListenerMock = jest.spyOn(window, 'removeEventListener');
  
  beforeEach(() => {
    addEventListenerMock.mockClear();
    removeEventListenerMock.mockClear();
  });
  
  it('adds event listener on mount and removes on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts([]));
    
    expect(addEventListenerMock).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    unmount();
    
    expect(removeEventListenerMock).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
  
  it('executes action when shortcut is triggered', () => {
    const actionMock = jest.fn();
    const preventDefaultMock = jest.fn();
    const shortcuts = [
      {
        key: 'a',
        meta: true,
        action: actionMock,
      },
    ];
    
    renderHook(() => useKeyboardShortcuts(shortcuts));
    
    // Get the event handler that was registered
    const eventHandler = addEventListenerMock.mock.calls[0][1];
    
    // Simulate key press that doesn't match the shortcut
    eventHandler({
      key: 'b',
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      preventDefault: preventDefaultMock,
    });
    
    expect(actionMock).not.toHaveBeenCalled();
    expect(preventDefaultMock).not.toHaveBeenCalled();
    
    // Simulate key press that matches the shortcut
    eventHandler({
      key: 'a',
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      preventDefault: preventDefaultMock,
    });
    
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  });
});