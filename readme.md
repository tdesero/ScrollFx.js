## Basic usage

Add the class ".scroll-fx" to your element. And optionally use some data-attributes to describe the animation. See the options below for details.

```html
<div class="scroll-fx" data-translate-x="-50" data-opacity="0" data-scale="0">ScrollFx.js</div>
```

Initialize the ScrollFx class.

```html
<script>
  window.addEventListener('load', function() {
    var test = new ScrollFx();
  })
</script>
```


## Options & Defaults

You can pass an Object to setup your Effects: `new ScrollFx({ ... your options });`.
The Options can be overwritten by data-attributes inside the elements you want to animate. For the data-attributes you have to change e.g. `skewX` into `data-skew-x`.
The values represent the beginning state of the transformations. The completed scroll-animation will show the element without transformations.

```html
{
  offset: .2, // 0.2 * windowHeight
  distance: .3, // 0.3 * windowHeight
  translateX: 0, //px
  translateY: 0, //px
  translateZ: 0, //px
  skewX: 0, //deg
  skewY: 0, //deg
  scale: 1,
  rotate: 0, //deg
  opacity: 1,
  blur: 0, //px
  easing: 'ease-out', // other available options are 'ease-in' & 'linear'
}
```
