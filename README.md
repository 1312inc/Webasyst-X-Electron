# Webasyst-X-Electron
Boilerplate desktop Electron application with Webasyst ID authorization and access to installations on board. Allows to create Windows and macOS applications based on Webasyst API-enabled cloud apps.

## Developer Info
The application consists of three processes:

### Main process ([main.js](/main.js) file)
The main Node.js process. The primary purpose is to create and manage application windows with the Electron BrowserWindow module. Includes Webasyst authorization process.

### Renderer process ([renderer](/renderer) dir)
Core javascript application responsible for rendering web content in the Chromium. The primary purpose is the management of the Webasyst installations.

The renderer folder contains the required `api.js` file. It serves to communicate between the Main and Renderer processes. For the Renderer process, the `window.appState` object is available,
containing a set of methods and properties to use.

Each time you select an installation in the sidebar, the renderer process launches the user's app in the BrowserView, passing information about the installation to it.

### User's app ([app](/app) dir)
Location of your application. SPA running in the BrowserView is called within the Renderer process.

Directory content:
* `index.html` - entry-point file of your application
* `api.js` - the required file that provides a `ready` method to your application that fires a callback function when the application is loaded and the installation object is passed from the Renderer process. From this moment, the installation object becomes available.

Example usage:
```javascript
window.appState.ready((installation) => {
    console.log(installation.name)
})
```

[More about Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model)

# Configuration

Use `app.config.js` (or rename existing `app.config.js.example` template) file with configuration variables.

| value                  | description |
|------------------------|-------------|
| waidClientId           |             |
| waidRequestScopes      |             |
| devServerHost          |    e.g. `http://localhost:8080`         |
| appName                |     your app name        |
| apiClientId            |             |
| cloudBundle            |             |
| cloudPlanId            |             |
| sidebarBackgroundColor |      color in hex format       |

# Localization

At the moment, the localization of the wrapper is determined by the system settings.
Use `/rendered/locale/i18n.js` localization file to set Renderer messages. Currently, it has English and Russian languages.

# Application Distribution
We use [electron-forge](https://github.com/electron-userland/electron-forge) tool to distribute the application. See the `forge.config.js` configuration file for details.

[More about Electron application distribution](https://www.electronjs.org/docs/latest/tutorial/application-distribution)

## Dev mode
Use `npm run start` command for the developer mode. Dev tools can be used as well.

## Distribution
Use `npm run make` command for building.
Make sure you have Developer ID Application certificate installed if you building on macOS.

### Environments
Use `.env` (or rename existing `.env.example` template) file with environment variables.

Variables list:

* `APPLE_APPLEID`: Apple ID email address
* `APPLE_APPLEID_PASSWORD`: app-specific generated password (to avoid 2FA issues)
* `APPLE_TEAM_SHORT_NAME`: get Transporter.app from Apple and run `/Applications/Transporter.app/Contents/itms/bin/iTMSTransporter -m provider -u %APPLE_APPLEID% -p %APPLE_APPLEID_PASSWORD%` using the values above
* `APPLE_APP_BUNDLE_ID`: the main Bundle ID from the App Store Connect
