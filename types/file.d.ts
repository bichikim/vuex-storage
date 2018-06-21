/**
 *
 * @author Bichi Kim <bichi@live.co.kr>
 */
declare module '*.json' {
  const value: {[name: string]: any}
  export default value
}

declare module '*.png' {
  const content: any
  export default content
}

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
