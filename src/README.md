# Chromeless Renderer Process

This directory contains the React application for the Chromeless renderer process.

## IPC Communication

The application has been updated to use the contextBridge API for secure IPC communication between the renderer and main processes:

### Synchronous to Asynchronous Migration

We have migrated all synchronous IPC calls to asynchronous patterns using `ipcRenderer.invoke` and `ipcMain.handle`. Legacy synchronous methods are kept for backward compatibility but will emit warnings when used.

### Using Async IPC Methods

```javascript
import { getPreferenceAsync } from '../senders';

const Component = () => {
  const [preference, setPreference] = useState(null);
  
  useEffect(() => {
    const loadPreference = async () => {
      const value = await getPreferenceAsync('somePreference');
      setPreference(value);
    };
    
    loadPreference();
  }, []);
  
  return (
    <div>{preference}</div>
  );
};
```

### Available Async Methods

- `getPreferenceAsync(name)`: Get a single preference value
- `getPreferencesAsync()`: Get all preferences
- `getSystemPreferenceAsync(name)`: Get a single system preference value
- `getSystemPreferencesAsync()`: Get all system preferences
- `getShouldUseDarkColorsAsync()`: Get dark mode status

### Security Improvements

The contextBridge API allows us to:
1. Expose only specific IPC methods to the renderer
2. Validate and filter all IPC messages and channels
3. Prevent direct access to Node.js APIs from the renderer
4. Create a proper separation between renderer and main processes

This approach follows Electron's security best practices and helps prevent potential security vulnerabilities.