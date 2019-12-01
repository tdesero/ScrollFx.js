export class ScrollFx {

  constructor(options = {}) {
    this.defaults = {
      offset: .2,
      distance: .3,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      skewX: 0,
      skewY: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      blur: 0,
      easing: 'ease-out',
    };

    this.options = Object.assign({}, this.defaults, options);

    this.elements = document.querySelectorAll('.scroll-fx');
    this.elementsLength = this.elements.length;
    this.elementsInfo = [];

    this.staggerContainers = document.querySelectorAll('.scroll-fx-stagger-container');

    this.windowHeight = window.innerHeight || document.documentElement.clientHeight;
    this.scrollY = window.scrollY || window.pageYOffset;

    this.applyEffect = this.applyEffect.bind(this);
    this.resizeUpdate = this.resizeUpdate.bind(this);

    this.requestResize = this.requestFrame(this.resizeUpdate);
    this.requestEffect = this.requestFrame(this.applyEffect);

    this.easingFunctions = {
        'linear': (x) => x,
        'ease-out': (x) => {
          x = 1 - x;
          return 1 - (x * x * x);
        },

        'ease-in': (x) => x * x * x,
      };

    this.start();
  }

  start() {
    this.setInfos();
    this.applyEffect(true); //true means it will be applied to all elements.

    //Event Listeners
    document.addEventListener('scroll', this.requestEffect, { passive: true });
    window.addEventListener('resize', this.requestResize);
  }

  setInfos() {
    this.setStaggers();

    for (let i = 0; i < this.elementsLength; i++) {
      this.elementsInfo[i] = {};
      this.elementsInfo[i].top = this.getOffsetTop(this.elements[i]);

      //DOM ELement datasets
      this.elementsInfo[i].distance = Number(this.elements[i].getAttribute('data-distance')) || this.options.distance;
      this.elementsInfo[i].offset = this.elements[i].getAttribute('data-offset') !== null ?
                    Number(this.elements[i].getAttribute('data-offset')) :
                    this.options.offset;
      this.elementsInfo[i].translateX = Number(this.elements[i].getAttribute('data-translate-x')) || this.options.translateX;
      this.elementsInfo[i].translateY = Number(this.elements[i].getAttribute('data-translate-y')) || this.options.translateY;
      this.elementsInfo[i].translateZ = Number(this.elements[i].getAttribute('data-translate-z')) || this.options.translateZ;
      this.elementsInfo[i].skewX = Number(this.elements[i].getAttribute('data-skew-x')) || this.options.skewX;
      this.elementsInfo[i].skewY = Number(this.elements[i].getAttribute('data-skew-y')) || this.options.skewY;
      this.elementsInfo[i].rotate = Number(this.elements[i].getAttribute('data-rotate')) || this.options.rotate;
      this.elementsInfo[i].blur = Number(this.elements[i].getAttribute('data-blur')) || this.options.blur;

      //for scale & opacity we need to check typeof otherwise it would return false for "0"
      this.elementsInfo[i].scale = this.elements[i].getAttribute('data-scale') !== null ?
                    Number(this.elements[i].getAttribute('data-scale')) :
                    this.options.scale;
      this.elementsInfo[i].opacity = this.elements[i].getAttribute('data-opacity') !== null ?
                    Number(this.elements[i].getAttribute('data-opacity')) :
                    this.options.opacity;

      this.elementsInfo[i].easing = this.elements[i].getAttribute('data-easing') || this.options.easing;
      this.elementsInfo[i].easingFunction = this.easingFunctions[this.elementsInfo[i].easing];

      //not sure if will-change does anything in this case...
      //this.elements[i].style.willChange = 'transform, opacity';
    }
  }

  setStaggers() {
    const containersLength = this.staggerContainers.length;

    for (let i = 0; i < containersLength; i++) {
      const offset = (this.staggerContainers[i].getAttribute('data-stagger'));
      const staggerElements = this.staggerContainers[i].querySelectorAll('.scroll-fx');
      const staggerElemLength = staggerElements.length;

      for (let j = 0; j < staggerElemLength; j++) {
        staggerElements[j].setAttribute('data-offset', offset * j);
      }
    }
  }

  resizeUpdate() {
    //update offset top of each element
    for (let i = 0; i < this.elementsLength; i++) {
      this.elementsInfo[i].top = this.getOffsetTop(this.elements[i]);
    }

    //update windowHeight
    this.windowHeight = window.innerHeight || document.documentElement.clientHeight;

    //update the transforms according to new informations.
    this.applyEffect(true); //true means it will be applied to all elements.
  }

  applyEffect( all = false ) {
    //update this.scrollY as well. not sure if needed ...
    this.scrollY = window.scrollY || window.pageYOffset;
    let scrollY = this.scrollY;

    for (let i = 0; i < this.elementsLength; i++) {
      let element = this.elements[i];

      //TODO: come up with a better variable name than info xD
      let info = this.elementsInfo[i];
      let easingFunction = info.easingFunction;
      let top = scrollY - info.top;
      let isInView = scrollY + this.windowHeight + 200 > info.top
         && scrollY < info.top + this.windowHeight;

      if (isInView || all === true) {
        let factor = (top + this.windowHeight - (info.offset * this.windowHeight))
                / (info.distance * this.windowHeight);

        if (factor < 0) {
          factor = 0;
        } else if (factor > 1) {
          factor = 1;
        }

        let translateX = (1 - easingFunction(factor)) * info.translateX;
        let translateY = (1 - easingFunction(factor)) * info.translateY;
        let translateZ = (1 - easingFunction(factor)) * info.translateZ;
        let skewX = (1 - easingFunction(factor)) * info.skewX;
        let skewY = (1 - easingFunction(factor)) * info.skewY;
        let scale = ((easingFunction(factor) * (1 - info.scale)) + info.scale);
        let rotate = easingFunction(factor) * -1 * info.rotate + info.rotate;
        let opacity = ((easingFunction(factor) * (1 - info.opacity)) + info.opacity);
        let blur = (1 - easingFunction(factor)) * info.blur;

        element.style.transform =
          'translate3d(' + translateX + 'px, ' + translateY + 'px, ' + translateZ + 'px) ' +
          'skew(' + skewX + 'deg,' + skewY + 'deg)' +
          'scale(' + scale + ') ' +
          'rotate(' + rotate + 'deg) ';

        if (info.blur) {
          element.style.filter = 'blur(' + blur.toFixed(0) + 'px)';
        }
        element.style.opacity = opacity;
      }

    }

  }

  getOffsetTop(element) {
    let top = 0;
    do {
      top += element.offsetTop || 0;
      element = element.offsetParent;
    } while (element);

    return top;
  }

  destroy() {
    //undo transforms
    for (let i = 0; i < this.elementsLength; i++) {
      this.elements[i].style.transform = '';
      this.elements[i].style.opacity = '';
    }

    //Event Listeners
    document.removeEventListener('scroll', this.requestEffect, { passive: true });
    window.removeEventListener('resize', this.requestResize);
  }

  //utility requestanimationframe throttle function
  requestFrame (callback) {
    let wait = false;
    let args;
    return function () {
        if (!wait) {
          wait = true;
          args = arguments;
          requestAnimationFrame(function () {
              callback.apply(null, args);
              wait = false;
            });
        }
      };
  }

}
