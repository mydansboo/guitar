import { browser, by, element } from 'protractor'

export class AppPage {
  // noinspection JSMethodCanBeStatic
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>
  }

  // noinspection JSMethodCanBeStatic
  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>
  }
}
