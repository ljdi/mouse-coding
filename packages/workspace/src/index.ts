import { TMP_PATH, WORKSPACES_PATH } from '@mc/workspace/constants/path'
import { configure, InMemory } from '@zenfs/core'
import * as fs from '@zenfs/core/promises'
import { IndexedDB } from '@zenfs/dom'

export class Workspace {
  constructor(
    public name: string,
    public path: string,
  ) {}

  changeWorkspace(newPath: string) {
    this.path = newPath
  }

  static async listWorkspaces() {
    return fs.readdir(WORKSPACES_PATH)
  }

  static createWorkspace({ name, path }: Workspace) {
    return new Workspace(name, path)
  }

  static async initWorkspaces() {
    await configure({
      mounts: {
        [WORKSPACES_PATH]: IndexedDB,
        [TMP_PATH]: InMemory,
      },
      disableAccessChecks: true,
      disableAsyncCache: true,
    })

    console.log(fs.readdir('/'))
  }
}
