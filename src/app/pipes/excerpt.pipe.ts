import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'excerpt'})

export class ExcerptPipe implements PipeTransform {
  transform(str: any): any {

    function getPosition(tempStr, subString, index) {
      return tempStr.split(subString, index).join(subString).length
    }

    const temp = str.split(',')[0].split('.')[0]
    const idx = getPosition(temp, ' ', 5)

    return temp.substring(0, idx)
  }
}
