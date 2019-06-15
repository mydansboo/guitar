import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'capitalise'})
export class CapitalisePipe implements PipeTransform {
  transform(str: string): any {
    if (str) {
      str = str.trim()
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return str
  }
}
