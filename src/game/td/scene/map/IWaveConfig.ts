
export interface IWaveGroup {
  key: string                      // Texture key to use for this group
  count: number                    // Number of enemies in group
  offset: number                   // Time offset before starting group
  spacing: number                  // Enemy spacing time within group
}

export interface IWaveModel {
  groups: IWaveGroup[]
}

export const DEFAULT_WAVES: IWaveModel = {
  groups: [
    { key: "path-green", count: 3, offset: 0, spacing: 250 },
    { key: "path-blue", count: 3, offset: 1500, spacing: 250 },
    { key: "path-red", count: 3, offset: 3000, spacing: 250 }
  ]
}
