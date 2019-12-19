const tabletWidth = 768;
const desktopWidth = 1300;
const imageSize = [124, 106];
const imageSizeSmall = [60.34, 51.58];
const companyCoords = [59.938631, 30.323055];
const mapDesktopCenter = [companyCoords[0], 30.319171];

ymaps.ready(init);

var myMap;

function init() {
  myMap = new ymaps.Map("map", {
    center: companyCoords,
    zoom: 17,
    controls: ["zoomControl", "fullscreenControl"]
  }, {
    searchControlProvider: "yandex#search"
  }),

    myPlacemark = new ymaps.Placemark(companyCoords, {
      hintContent: "HTML Academy",
      balloonContent: "Россия, Санкт-Петербург, Большая Конюшенная улица, 19/8"
    }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: "default#image",
      // Своё изображение иконки метки.
      iconImageHref: "img/map-pin.png",
      // Размеры метки.
      iconImageSize: imageSizeSmall,
      // Смещение левого верхнего угла иконки относительно её "ножки" (точки привязки).
      iconImageOffset: [0, 0]
    });

  myMap.geoObjects
    .add(myPlacemark);

  // Реагируем на изменение ширины
  // Мониторим планшетную ширину
  var mediaTablet = window.matchMedia("(min-width: " + tabletWidth + "px)");
  function handleTablet(evt) {
    if (evt.matches) {
      myPlacemark.options.set("iconImageSize", imageSize);
      myPlacemark.options.set("iconImageOffset", [-60, -90])
    } else {
      myPlacemark.options.set("iconImageSize", imageSizeSmall);
      myPlacemark.options.set("iconImageOffset", [-30, -40])
    }
  }
  mediaTablet.addListener(handleTablet);
  handleTablet(mediaTablet);

  // Мониторим десктопную ширину
  var mediaDesktop = window.matchMedia("(min-width: " + desktopWidth + "px)");
  function handleDesktop(evt) {
    if (evt.matches) {
      myMap.setCenter(mapDesktopCenter);
    } else {
      myMap.setCenter(companyCoords);
    }
  }
  mediaDesktop.addListener(handleDesktop);
  handleDesktop(mediaDesktop);
}
