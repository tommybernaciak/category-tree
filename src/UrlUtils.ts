export class UrlUtils {
  static isValidUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  static handleImageUrl = (
    url: string,
    customUrl = 'https://testprovider.com',
    ex = 'jpg'
  ): string => {
    if (!UrlUtils.isValidUrl(url)) {
      return '';
    }
    const imageName = url.split('/').pop();
    if (!imageName) {
      return '';
    }
    const normalizedImageName = imageName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return customUrl + '/categories/' + normalizedImageName + '.' + ex;
  };
}
