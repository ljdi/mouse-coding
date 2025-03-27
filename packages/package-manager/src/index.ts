import {
  DEFAULT_REGISTRY_URL,
  PACKAGE_JSON_FILE_NAME,
  PM_CONFIG_FILE_PATH,
  PM_CONFIG_PATH,
} from '@mc/shared/constants/fs'
import * as path from '@zenfs/core/path.js'
import * as fs from '@zenfs/core/promises'

interface ConfigData {
  registry: string
}

export class Config implements ConfigData {
  private data: Partial<ConfigData> = {}
  constructor() {
    this.readConfigDataFromFile().catch(console.error)
  }

  set registry(registry: string) {
    this.data.registry = registry
    this.writeConfigDataToFile(this.data).catch(console.error)
  }

  get registry() {
    return this.data.registry ?? DEFAULT_REGISTRY_URL
  }

  private async readConfigDataFromFile() {
    let config: Partial<ConfigData> = {}
    if (await fs.exists(PM_CONFIG_FILE_PATH)) {
      const fileContent = await fs.readFile(PM_CONFIG_FILE_PATH)
      config = JSON.parse(fileContent.toString()) as Partial<ConfigData>
    }
    this.data = config
  }

  private async writeConfigDataToFile(config: Partial<ConfigData>) {
    if (!(await fs.exists(PM_CONFIG_PATH))) {
      await fs.mkdir(PM_CONFIG_PATH, { recursive: true })
    }
    await fs.writeFile(PM_CONFIG_FILE_PATH, JSON.stringify(config))
  }
}

export class PackageManager {
  private static config = new Config()
  constructor(public cwd: string) {}

  public async init() {
    if (await fs.exists(path.join(this.cwd, PACKAGE_JSON_FILE_NAME))) {
      throw Error('Project already initialized')
    }
    await fs.writeFile(
      PACKAGE_JSON_FILE_NAME,
      JSON.stringify({ name: path.basename(this.cwd), private: true }),
    )
  }

  public install(packageName: string) {
    console.log(`Installing package: ${packageName} in ${this.cwd}`)
  }

  public uninstall(packageName: string) {
    console.log(`Uninstalling package: ${packageName} from ${this.cwd}`)
  }

  public update(packageName: string) {
    console.log(`Updating package: ${packageName} in ${this.cwd}`)
  }
}
