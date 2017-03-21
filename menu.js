const { ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const os = require('os');

const Menu = require('electron').Menu || require('electron').remote.Menu;
const app = require('electron').app || require('electron').remote.app;

const consumer = require('./ipc/consumer');
const { getServerUrl } = require('./utils');

const isMainProcess = typeof ipcMain !== 'undefined';

function exec(commandId, args={}) {
  if (isMainProcess) {
    consumer(commandId, args);
  } else {
    ipcRenderer.send('main:command', { commandId, args });
  }
}

const template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New File',
				accelerator: 'CmdOrCtrl+N',
				click () {
          exec('createWindow', {url: `file://${path.join(__dirname, `index.html?target=${path.join(getServerUrl(), '/new')}`)}`})
				}
			},
			{
				label: 'New Window',
				accelerator: 'CmdOrCtrl+Shift+N',
				click () {
          exec('createWindow', {url: `file://${path.join(__dirname, 'index.html')}`})
				}
			}
		]
	},
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      },
			{
				type: 'separator',
			},
			{
				label: 'Customize HackMD server',
				click () {
					exec('configServerUrl');
				}
			}
    ]
  },
	{
		label: 'History',
		submenu: [
			{
				label: 'Forward',
				accelerator: 'CmdOrCtrl+]',
				click () {
					exec('goForward');
				}
			},
			{
				label: 'Back',
				accelerator: 'CmdOrCtrl+[',
				click () {
					exec('goBack');
				}
			},
		]
	},
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      },
			{
				type: 'separator'
			},
			{
				label: 'Refresh',
				accelerator: 'CmdOrCtrl+R',
				click () {
          exec('refreshWindow');
				}
			},
			{
				type: 'separator'
			},
      {
        role: 'togglefullscreen'
      },
      {
        role: 'toggledevtools'
      },
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () {
          exec('learnMore');
        }
      }
    ]
  }
]

if (os.platform() === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[2].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
}

module.exports = Menu.buildFromTemplate(template);
