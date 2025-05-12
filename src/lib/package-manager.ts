import * as path from '@zenfs/core/path'
import * as fs from '@zenfs/core/promises'

import {
  DEFAULT_REGISTRY_URL,
  PACKAGE_JSON_FILE_NAME,
  PM_CONFIG_FILE_PATH,
} from '@/constants/fs'

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
    if (await fs.exists(PM_CONFIG_FILE_PATH)) {
      const fileContent = await fs.readFile(PM_CONFIG_FILE_PATH)
      config = JSON.parse(fileContent.toString()) as Partial<ConfigData>
    }
    this.data = config
  }

  private async writeConfigDataToFile (config: Partial<ConfigData>) {
    const configDir = path.dirname(PM_CONFIG_FILE_PATH)
    if (!(await fs.exists(configDir))) {
      await fs.mkdir(configDir, { recursive: true })
    }
    await fs.writeFile(PM_CONFIG_FILE_PATH, JSON.stringify(config))
  }
}

export class PackageManager {
  private static config = new Config()
  constructor (public cwd: string) {}

  public async init () {
    const packageJsonPath = path.join(this.cwd, PACKAGE_JSON_FILE_NAME)
    if (await fs.exists(packageJsonPath)) {
      throw Error('Project already initialized')
    }
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify({ name: path.basename(this.cwd), private: true })
    )
    await fs.mkdir(path.join(this.cwd, 'src/test'), { recursive: true })
    await fs.mkdir(path.join(this.cwd, 'public'), { recursive: true })
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
