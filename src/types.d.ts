export interface IVuexStorageOptions {
  /**
   * @deprecated
   */
  isServer?: boolean,
  isRestore?: boolean,
  isRun?: boolean
  session?: IFilterOptions
  local?: IFilterOptions
  key?: string
}

export interface IFilterOptions {
  except?: string[],
  only?: string[],
}