import * as pathModule from '@zenfs/core/path'

import { DEFAULT_REGISTRY_URL, PACKAGE_JSON_FILE_NAME, PM_CONFIG_FILE_PATH } from '@/constants/env'
import { createDirectory, exists, readFile, writeFile } from '@/lib/file-system'

interface ConfigData {
  registry: string
}

export class Config implements ConfigData {
  private data: Partial<ConfigData> = {}

  constructor () {
    this.readConfigDataFromFile().catch(console.error)
  }

  set registry (registry: string) {
    this.data.registry = registry
    this.writeConfigDataToFile(this.data).catch(console.error)
  }

  get registry () {
    return this.data.registry ?? DEFAULT_REGISTRY_URL
  }

  private async readConfigDataFromFile () {
    let config: Partial<ConfigData> = {}
    if (await exists(PM_CONFIG_FILE_PATH)) {
      const fileContent = await readFile(PM_CONFIG_FILE_PATH)
      config = JSON.parse(fileContent.toString()) as Partial<ConfigData>
    }
    this.data = config
  }

  private async writeConfigDataToFile (config: Partial<ConfigData>) {
    const configDir = pathModule.dirname(PM_CONFIG_FILE_PATH)
    if (!(await exists(configDir))) {
      await createDirectory(configDir)
    }
    await writeFile(PM_CONFIG_FILE_PATH, JSON.stringify(config))
  }
}

export class PackageManager {
  private config: Config
  public cwd: string

  constructor (cwd: string) {
    this.cwd = cwd
    this.config = new Config()
  }

  public async init () {
    const packageJsonPath = pathModule.join(this.cwd, PACKAGE_JSON_FILE_NAME)
    if (await exists(packageJsonPath)) {
      throw Error('Project already initialized')
    }
    if (!(await exists(this.cwd))) {
      throw Error('Project path does not exist')
    }
    const projectName = pathModule.basename(this.cwd)
    await writeFile(packageJsonPath, JSON.stringify({ name: projectName, private: true }))

    await createDirectory(pathModule.join(this.cwd, 'src'))
    await writeFile(pathModule.join(this.cwd, 'src/main.js'), '')
  }

  public install (packageName: string) {
    console.log(`Installing package: ${packageName} in ${this.cwd}`)
  }

  public uninstall (packageName: string) {
    console.log(`Uninstalling package: ${packageName} from ${this.cwd}`)
  }

  public update (packageName: string) {
    console.log(`Updating package: ${packageName} in ${this.cwd}`)
  }
}
