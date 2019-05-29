/* eslint-disable typescript/interface-name-prefix,typescript/no-namespace */
/**
 *
 * @author Bichi Kim <bichi@live.co.kr> <bichi@pjfactory.com>
 */
/* tslint:disable-next-line: no-namespace*/
declare namespace NodeJS {
  /* tslint:disable-next-line: interface-name*/
  export interface Process {
    client: boolean
    server: boolean
    browser: boolean
    BROWSER_BUILD: boolean
  }
}

// eslint-disable-next-line no-unused-vars
// declare const process: Process
