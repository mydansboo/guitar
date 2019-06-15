import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'excerpt'})

export class ExcerptPipe implements PipeTransform {
  transform(str: any): any {

    function getPosition(tempStr, subString, index) {
      return tempStr.split(subString, index).join(subString).length
    }

    const temp = str.split(',')[0].split('.')[0]
    const idx1 = getPosition(temp, ' ', 5)
    const idx2 = getPosition(temp, ' ', 6)
    const idx3 = getPosition(temp, ' ', 7)
    const str1 = temp.substring(0, idx1)
    const str2 = temp.substring(0, idx2)
    const str3 = temp.substring(0, idx3)

    return (str1.split('-').length === str2.split('-').length) ? str1 : str3
  }
}
