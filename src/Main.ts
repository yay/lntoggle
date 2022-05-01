import {
  window,
  commands,
  workspace,
  ExtensionContext,
  StatusBarItem,
  StatusBarAlignment,
  WorkspaceConfiguration,
  ConfigurationChangeEvent
} from 'vscode'

export default class Main {
  public context: ExtensionContext

  private switch?: StatusBarItem
  private config: WorkspaceConfiguration

  constructor(context: ExtensionContext) {
    this.context = context
    this.config = workspace.getConfiguration()
    this.Initialize()
  }

  private Initialize() {
    this.registerCommand('lntoggle.show', () => {
      this.config.update('editor.lineNumbers', 'on', true)
    })

    this.registerCommand('lntoggle.hide', () => {
      this.config.update('editor.lineNumbers', 'off', true)
    })

    this.registerCommand('lntoggle.toggle', () => {
      const lineNumbers = this.config.get('editor.lineNumbers')

      this.config.update('editor.lineNumbers', lineNumbers !== 'on' ? 'on' : 'off', true)
    })

    this.update()
  }

  public destroy() {
    this.switch?.dispose?.()
  }

  public configUpdate(event: ConfigurationChangeEvent) {
    this.config = workspace.getConfiguration()
    event.affectsConfiguration('lntoggle.priority') && this.update(true)
  }

  // update the statusbar item
  private update(force = false) {
    // create the switch if it does not already exist
    if (this.switch === undefined || force) {
      this.switch?.dispose?.()
      this.switch = window.createStatusBarItem(StatusBarAlignment.Right, this.config.get('lntoggle.priority', 0))
      this.switch.command = 'lntoggle.toggle'
      this.switch.text = '$(list-ordered)'
      this.switch.tooltip = 'Toggle Line Numbers'
      this.context.subscriptions.push(this.switch)
    }
    this.switch.show()
  }

  public registerCommand(uri: string, callback: (...args: any[]) => any) {
    this.context.subscriptions.push(commands.registerCommand(uri, callback))
  }
}
