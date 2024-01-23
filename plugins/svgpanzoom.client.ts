import svgPanZoom from 'svg-pan-zoom'
import Hammer from 'hammerjs'

// eslint-disable
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('svg-pan-zoom', {
    mounted (el) {
      const eventsHandler = {
        haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
        init: function (options) {
          const instance = options.instance
          let initialScale = 1
          let pannedX = 0
          let pannedY = 0

          // Init Hammer
          // Listen only for pointer and touch events
          this.hammer = Hammer(options.svgElement, {
            inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
          })

          // Enable pinch
          this.hammer.get('pinch').set({ enable: true })

          // Handle double tap
          this.hammer.on('doubletap', () => {
            instance.zoomIn()
          })

          // Handle pan
          this.hammer.on('panstart panmove', function (ev) {
            // On pan start reset panned variables
            if (ev.type === 'panstart') {
              pannedX = 0
              pannedY = 0
            }

            // Pan only the difference
            instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY })
            pannedX = ev.deltaX
            pannedY = ev.deltaY
          })

          // Handle pinch
          this.hammer.on('pinchstart pinchmove', function (ev) {
            // On pinch start remember initial zoom
            if (ev.type === 'pinchstart') {
              initialScale = instance.getZoom()
              instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
            }

            instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
          })

          // Prevent moving the page on some devices when panning over SVG
          options.svgElement.addEventListener('touchmove', function (e) { e.preventDefault() })
        },

        destroy: function () {
          this.hammer.destroy()
        }
      }

      svgPanZoom(el, {
        zoomEnabled: true,
        fit: 1,
        center: 1,
        customEventsHandler: eventsHandler
      })
    }
  })
})
