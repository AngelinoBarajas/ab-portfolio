  /* =========================================================
     TOPICWEAVE KIT (mission topicweave, renamed from CKS; the scenes are 24-tw-*.js)
     The v3 site's own look: black, bone, Fraunces + Inter Tight, square corners, and the four weave colors
     (lilac, coral, teal, cobalt). Marks are the site's real SVGs (cks-v3/build.py LOGO + ICON).
     K.tw.weave is the site's thread cloth (cks-v3 js/site.js sheetWeave), ported to ES5:
       radial: threads fly out from a point and knit a cover, then unravel (monitor channel changes)
       band  : a strip of cloth knits in from one side with a slow wave running through it (section seams)
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K) return;
    var q = K.q, esc = K.esc;
    var C = { void: '#000', bone: '#fff', ash: '#9a9a9a', mist: '#bdbdbd', soft: '#e2e2e2', line: 'rgba(255,255,255,.12)',
      lilac: '#9b87f5', lilacText: '#b9a6ff', coral: '#ef5b3f', teal: '#139e8a', cobalt: '#4f7bff', cobaltDeep: '#2f5bea', paper: '#f7f5f0', night: '#0b1b2b' };
    var WEAVE = [C.lilac, C.coral, C.teal, C.cobalt];
    var LOGO = '<svg viewBox="0 0 528.58 76.07" aria-hidden="true"><path fill="#9085bf" d="M28.98,1.78v31h-14.83V1.78c0-.98.8-1.78,1.78-1.78h11.27c.98,0,1.78.8,1.78,1.78Z"/><path fill="#9085bf" d="M14.15,56.54h14.83v8.41c0,.98-.8,1.78-1.78,1.78h-11.27c-.98,0-1.78-.8-1.78-1.78v-8.41Z"/><path fill="#f05b40" d="M1.78,14.15h7.41v14.83H1.78c-.98,0-1.78-.8-1.78-1.78v-11.27c0-.98.8-1.78,1.78-1.78Z"/><path fill="#0f9e8a" d="M32.78,37.74v14.83H1.78c-.98,0-1.78-.8-1.78-1.78v-11.27c0-.98.8-1.78,1.78-1.78h31Z"/><path fill="#0f9e8a" d="M66.73,39.52v11.27c0,.98-.8,1.78-1.78,1.78h-7.41v-14.83h7.41c.98,0,1.78.8,1.78,1.78Z"/><path fill="#4861ad" d="M52.57,1.78v7.41h-14.83V1.78c0-.98.8-1.78,1.78-1.78h11.27c.98,0,1.78.8,1.78,1.78Z"/><path fill="#4861ad" d="M37.74,33.95h14.83v31c0,.98-.8,1.78-1.78,1.78h-11.27c-.98,0-1.78-.8-1.78-1.78v-31Z"/><path fill="#f05b40" d="M66.73,15.94v11.27c0,.98-.8,1.78-1.78,1.78h-31v-14.83h31c.98,0,1.78.8,1.78,1.78Z"/><g fill="currentColor"><path d="M146.47,17.57c.27-.49.32-1.13.16-1.9l-2.68-12.83c-.27-1.04-.63-1.77-1.1-2.2C142.38.21,141.7,0,140.79,0c-.59,0-1.13.12-1.64.36-.51.24-1.08.49-1.72.74-.64.25-1.47.38-2.48.38h-27.9c-1.01,0-1.84-.13-2.48-.38-.64-.25-1.21-.5-1.72-.74C102.35.12,101.8,0,101.22,0c-.91,0-1.59.21-2.06.64-.47.43-.83,1.16-1.1,2.2l-2.68,12.83c-.16.77-.1,1.41.18,1.9.28.49.74.79,1.38.9.61.13,1.16.09,1.64-.14.48-.23.88-.69,1.2-1.38,1.38-3.09,2.57-5.44,3.56-7.04.99-1.6,1.98-2.69,2.98-3.28,1-.59,2.21-.88,3.62-.88h4.88v44.89c0,.61-.17,1.11-.52,1.48s-.84.65-1.48.84l-2.28.52c-1.15.35-1.72,1.04-1.72,2.08,0,.56.2,1.01.6,1.36.4.35,1.03.52,1.88.52h19.43c1.65,0,2.48-.63,2.48-1.88,0-1.04-.57-1.73-1.72-2.08l-2.28-.52c-.64-.19-1.13-.47-1.48-.84-.35-.37-.52-.87-.52-1.48V5.76h4.88c1.44,0,2.65.29,3.64.88s1.97,1.68,2.96,3.28,2.17,3.94,3.56,7.04c.32.69.72,1.15,1.2,1.38.48.23,1.03.27,1.64.14.67-.11,1.13-.41,1.4-.9Z"/><path d="M177.26,21.13c-3.13-1.69-6.76-2.54-10.89-2.54s-7.87.86-11.05,2.58c-3.18,1.72-5.68,4.07-7.47,7.05-1.8,2.99-2.7,6.38-2.7,10.19s.88,7.38,2.64,10.39,4.2,5.37,7.32,7.08,6.74,2.56,10.87,2.56,7.87-.87,11.05-2.6c3.18-1.73,5.68-4.1,7.47-7.1s2.7-6.38,2.7-10.13c0-3.97-.87-7.46-2.62-10.45-1.75-3-4.18-5.34-7.32-7.04ZM175.72,45.91c-.29,2.44-.99,4.35-2.1,5.74s-2.58,2.23-4.42,2.52c-1.87.32-3.6,0-5.2-.98s-2.99-2.57-4.18-4.8c-1.19-2.22-2.09-5.04-2.7-8.46-.61-3.44-.78-6.38-.5-8.81.28-2.44.97-4.35,2.08-5.74,1.11-1.39,2.58-2.22,4.42-2.52,1.86-.32,3.6,0,5.22.98,1.61.97,3,2.57,4.18,4.8,1.17,2.23,2.06,5.04,2.68,8.45.64,3.44.81,6.38.52,8.81Z"/><path d="M226.98,21.01c-2.49-1.61-5.31-2.42-8.45-2.42-3.38,0-6.46.93-9.23,2.8-1.3.87-2.52,1.91-3.68,3.1v-3.1c0-.77-.22-1.4-.66-1.88-.44-.48-1.13-.72-2.06-.72-.51,0-1.08.08-1.72.24-.64.16-1.45.44-2.44.84l-6.84,2.72c-.72.29-1.21.57-1.48.82-.27.25-.4.61-.4,1.06,0,.4.11.72.32.96.21.24.56.41,1.04.52l2.12.16c.45.08.79.27,1,.58.21.31.32.81.32,1.5v41.37c0,.85-.12,1.47-.36,1.86-.24.39-.6.66-1.08.82l-1.56.4c-.51.19-.88.42-1.12.7-.24.28-.36.63-.36,1.06,0,.51.18.91.54,1.22.36.31.93.46,1.7.46h16.35c.77,0,1.34-.15,1.7-.46.36-.31.54-.71.54-1.22,0-.43-.12-.79-.36-1.08-.24-.29-.63-.52-1.16-.68l-2.12-.44c-.48-.13-.84-.4-1.08-.8-.24-.4-.36-1.01-.36-1.84v-14.16c.38.28.76.54,1.16.79,2.48,1.5,5.32,2.26,8.51,2.26,3.6,0,6.85-.86,9.75-2.58s5.21-4.14,6.92-7.28c1.71-3.13,2.56-6.83,2.56-11.09,0-3.7-.71-6.98-2.14-9.81-1.43-2.84-3.38-5.06-5.88-6.68ZM222.01,47.25c-.83,2.24-1.96,3.89-3.4,4.96-1.44,1.07-3.06,1.6-4.88,1.6-1.92,0-3.7-.54-5.34-1.62-.8-.53-1.57-1.19-2.3-1.99v-21.94c.76-.86,1.56-1.58,2.38-2.15,1.69-1.17,3.51-1.76,5.46-1.76,1.79,0,3.38.52,4.78,1.56,1.4,1.04,2.5,2.62,3.32,4.74.81,2.12,1.22,4.8,1.22,8.05,0,3.46-.41,6.32-1.24,8.55Z"/><path d="M257.47,54l-1.48-.4c-.48-.16-.84-.44-1.08-.84-.24-.4-.36-1.01-.36-1.84v-29.54c0-.77-.22-1.4-.66-1.88-.44-.48-1.11-.72-2.02-.72-.45,0-1,.08-1.64.24-.64.16-1.49.44-2.56.84l-7.31,2.72c-.72.27-1.21.53-1.48.8-.27.27-.4.63-.4,1.08,0,.4.11.72.32.96s.56.41,1.04.52l2.12.16c.45.08.79.27,1,.58.21.31.32.81.32,1.5v22.75c0,.85-.12,1.47-.36,1.84-.24.37-.6.65-1.08.84l-1.56.4c-.51.19-.88.42-1.12.7-.24.28-.36.63-.36,1.06,0,.51.18.91.54,1.22.36.31.93.46,1.7.46h15.71c.77,0,1.35-.15,1.72-.46.37-.31.56-.71.56-1.22,0-.43-.13-.79-.38-1.08s-.65-.52-1.18-.68Z"/><path d="M242.86,10.99c1.29,1.09,3.02,1.64,5.18,1.64s3.89-.55,5.2-1.64c1.31-1.09,1.96-2.54,1.96-4.36s-.65-3.22-1.96-4.3-3.04-1.62-5.2-1.62-3.88.54-5.18,1.62c-1.29,1.08-1.94,2.51-1.94,4.3s.65,3.26,1.94,4.36Z"/><path d="M297.4,44.05c-.32,0-.62.09-.9.28-.28.19-.66.55-1.14,1.08-.99,1.68-2.33,2.98-4.04,3.9-1.71.92-3.69,1.38-5.96,1.38-2.56,0-4.84-.59-6.84-1.78-2-1.19-3.56-2.92-4.7-5.22-1.13-2.29-1.7-5.12-1.7-8.47,0-2.64.39-4.9,1.16-6.78.77-1.88,1.83-3.32,3.16-4.32,1.33-1,2.84-1.5,4.52-1.5,1.92,0,3.44.55,4.56,1.66,1.12,1.11,1.68,2.57,1.68,4.38v1.24c0,1.52.45,2.75,1.36,3.7.91.95,2.21,1.42,3.92,1.42s3.21-.52,4.28-1.56c1.07-1.04,1.6-2.3,1.6-3.8,0-2.03-.65-3.88-1.94-5.56-1.29-1.68-3.12-3.02-5.5-4.02-2.37-1-5.18-1.5-8.43-1.5-4.18,0-7.82.91-10.89,2.72-3.08,1.81-5.46,4.28-7.16,7.42-1.69,3.13-2.54,6.67-2.54,10.61s.85,7.19,2.56,10.05c1.71,2.87,4.05,5.09,7.04,6.68s6.41,2.38,10.27,2.38c3.22,0,6.08-.57,8.55-1.7,2.48-1.13,4.45-2.64,5.92-4.54,1.46-1.89,2.25-3.96,2.36-6.2.03-.56-.06-1.03-.26-1.4-.2-.37-.51-.56-.94-.56Z"/><path d="M366.21,19.97c-.39-.31-.93-.46-1.62-.46h-10.15c-.67,0-1.19.15-1.58.46-.39.31-.58.73-.58,1.26,0,.43.13.78.38,1.06.25.28.67.49,1.26.62l1.48.28c1.01.19,1.59.63,1.74,1.34s-.09,1.98-.7,3.82l-6.59,20.52-6.92-21.4c-.48-1.52-.66-2.59-.54-3.22.12-.62.51-.99,1.18-1.1l1.84-.28c.53-.08.92-.27,1.16-.56.24-.29.36-.65.36-1.08,0-1.15-.71-1.72-2.12-1.72h-16.43c-1.47,0-2.2.57-2.2,1.72,0,.43.11.78.32,1.06.21.28.57.5,1.08.66l1.32.36c.45.11.82.31,1.1.6.28.29.58.89.9,1.8l.84,2.47-7.24,20.66-6.99-21.14c-.56-1.71-.76-2.84-.6-3.4s.69-.93,1.6-1.12l1.48-.28c.61-.13,1.05-.34,1.3-.62.25-.28.38-.63.38-1.06,0-.53-.19-.95-.58-1.26-.39-.31-.91-.46-1.58-.46h-17.11c-.67,0-1.19.15-1.58.46-.39.31-.58.73-.58,1.26,0,.43.11.78.32,1.06.21.28.57.5,1.08.66l1.28.36c.43.11.79.33,1.1.66s.62.99.94,1.98l10.23,29.14c.35.99.83,1.68,1.44,2.08.61.4,1.33.6,2.16.6h3.96c.72,0,1.4-.17,2.04-.5s1.15-.97,1.52-1.9l7.59-20.84,7,20.6c.32.93.8,1.61,1.44,2.02s1.36.62,2.16.62h3.8c.72,0,1.41-.17,2.08-.5.67-.33,1.16-.97,1.48-1.9l9.43-27.74c.53-1.54.99-2.64,1.38-3.28.39-.64.82-1.03,1.3-1.16l1.24-.28c.64-.16,1.07-.38,1.28-.66.21-.28.32-.62.32-1.02,0-.53-.19-.95-.58-1.26Z"/><path d="M402.48,37.08c.83-.79,1.24-1.9,1.24-3.34,0-2.96-.67-5.58-2-7.85-1.33-2.28-3.26-4.06-5.8-5.36-2.53-1.29-5.58-1.94-9.15-1.94-4.18,0-7.79.89-10.81,2.66-3.03,1.77-5.35,4.21-6.98,7.32-1.63,3.1-2.44,6.7-2.44,10.77,0,3.84.85,7.19,2.56,10.05,1.71,2.87,4.06,5.09,7.05,6.68s6.43,2.38,10.29,2.38c3.3,0,6.23-.57,8.77-1.7,2.54-1.13,4.56-2.65,6.04-4.56,1.48-1.9,2.27-3.98,2.38-6.22.03-.56-.06-1.03-.26-1.42-.2-.39-.51-.58-.94-.58-.29,0-.59.09-.88.28-.29.19-.68.55-1.16,1.08-1.01,1.71-2.41,3.03-4.18,3.96s-3.83,1.4-6.18,1.4c-4,0-7.21-1.29-9.63-3.88-1.92-2.05-3.07-4.91-3.47-8.55h21.93c1.57,0,2.77-.39,3.6-1.18ZM390.29,35.14h-13.51c0-2.6.36-4.84,1.08-6.7.72-1.88,1.72-3.32,3-4.32,1.28-1,2.76-1.5,4.44-1.5,2.16,0,3.88.9,5.16,2.7s1.92,4.44,1.92,7.93c0,1.25-.69,1.88-2.08,1.88Z"/><path d="M447.94,50.77c-.24,0-.44.07-.6.2-.16.13-.32.29-.48.48-.21.27-.47.54-.76.82-.29.28-.73.42-1.32.42s-.99-.19-1.3-.56c-.31-.37-.46-.93-.46-1.68v-20.79c0-3.38-1.2-6.07-3.6-8.05s-6.05-2.98-10.95-2.98c-3.97,0-7.31.53-10.01,1.58-2.71,1.05-4.75,2.39-6.14,4.02-1.39,1.63-2.08,3.28-2.08,4.96,0,1.39.43,2.47,1.28,3.26s2.12,1.18,3.8,1.18c1.95,0,3.46-.43,4.54-1.3s1.62-2.11,1.62-3.74v-3.52c0-.96.43-1.78,1.28-2.46.85-.68,2.07-1.02,3.64-1.02,1.73,0,3.08.51,4.04,1.54.96,1.03,1.44,2.49,1.44,4.38v11.25c-.51-.15-1.04-.29-1.62-.41-1.4-.29-2.96-.44-4.7-.44-5.36,0-9.53,1.03-12.51,3.08-2.99,2.05-4.48,4.74-4.48,8.07,0,2.8,1.09,5.06,3.28,6.8,2.18,1.73,5.02,2.6,8.51,2.6,2.77,0,5.4-.57,7.87-1.7,1.76-.8,3.26-1.86,4.52-3.14.26,1.3.93,2.37,2.02,3.2,1.42,1.09,3.34,1.64,5.74,1.64,1.84,0,3.38-.34,4.64-1.02,1.25-.68,2.19-1.51,2.82-2.48.62-.97.94-1.91.94-2.82,0-.4-.08-.73-.24-.98-.16-.25-.4-.38-.72-.38ZM425.79,53.32c-1.68,0-3.05-.53-4.12-1.6s-1.6-2.58-1.6-4.56.63-3.56,1.88-4.7c1.25-1.13,2.98-1.7,5.2-1.7,1.09,0,2.11.12,3.06.36.56.14,1.11.33,1.66.54v9.39c-.58.49-1.22.91-1.92,1.26-1.33.67-2.72,1-4.16,1Z"/><path d="M491.07,19.97c-.39-.31-.93-.46-1.62-.46h-10.87c-.67,0-1.19.15-1.58.46-.39.31-.58.73-.58,1.26,0,.43.13.78.4,1.06.27.28.69.49,1.28.62l1.48.28c1.2.27,1.92.72,2.16,1.36s.05,1.77-.56,3.4l-8.17,21.61-8.38-21.61c-.61-1.62-.8-2.76-.56-3.4.24-.64.97-1.09,2.2-1.36l1.44-.28c.61-.13,1.04-.34,1.3-.62.25-.28.38-.63.38-1.06,0-1.15-.72-1.72-2.16-1.72h-17.91c-.67,0-1.19.15-1.58.46-.39.31-.58.73-.58,1.26,0,.43.11.78.32,1.06.21.28.57.5,1.08.66l1.28.36c.4.11.74.33,1.02.68.28.35.63,1.04,1.06,2.08l11.75,29.06c.37.91.86,1.57,1.46,2,.6.43,1.31.64,2.14.64h4.08c.75,0,1.43-.16,2.06-.48.62-.32,1.12-.96,1.5-1.92l11.03-27.74c.61-1.54,1.12-2.64,1.54-3.28.41-.64.86-1.03,1.34-1.16l1.24-.28c.64-.16,1.07-.38,1.28-.66.21-.28.32-.62.32-1.02,0-.53-.19-.95-.58-1.26Z"/><path d="M527.3,43.97c-.29,0-.59.09-.88.28-.29.19-.68.55-1.16,1.08-1.01,1.71-2.41,3.03-4.18,3.96s-3.83,1.4-6.18,1.4c-4,0-7.21-1.29-9.63-3.88-1.92-2.05-3.07-4.91-3.47-8.55h21.93c1.57,0,2.77-.39,3.6-1.18s1.24-1.9,1.24-3.34c0-2.96-.67-5.58-2-7.85-1.33-2.28-3.26-4.06-5.8-5.36-2.53-1.29-5.58-1.94-9.15-1.94-4.18,0-7.79.89-10.81,2.66-3.03,1.77-5.35,4.21-6.98,7.32-1.63,3.1-2.44,6.7-2.44,10.77,0,3.84.85,7.19,2.56,10.05,1.71,2.87,4.06,5.09,7.05,6.68s6.43,2.38,10.29,2.38c3.3,0,6.23-.57,8.77-1.7,2.54-1.13,4.56-2.65,6.04-4.56,1.48-1.9,2.27-3.98,2.38-6.22.03-.56-.06-1.03-.26-1.42-.2-.39-.51-.58-.94-.58ZM505.72,24.12c1.28-1,2.76-1.5,4.44-1.5,2.16,0,3.88.9,5.16,2.7s1.92,4.44,1.92,7.93c0,1.25-.69,1.88-2.08,1.88h-13.51c0-2.6.36-4.84,1.08-6.7.72-1.88,1.72-3.32,3-4.32Z"/></g></svg>';
    var ICON = '<svg viewBox="0 0 66.73 66.73" aria-hidden="true"><path fill="#9085bf" d="M28.98,1.78v31h-14.83V1.78c0-.98.8-1.78,1.78-1.78h11.27c.98,0,1.78.8,1.78,1.78Z"/><path fill="#9085bf" d="M14.15,56.54h14.83v8.41c0,.98-.8,1.78-1.78,1.78h-11.27c-.98,0-1.78-.8-1.78-1.78v-8.41Z"/><path fill="#f05b40" d="M1.78,14.15h7.41v14.83H1.78c-.98,0-1.78-.8-1.78-1.78v-11.27c0-.98.8-1.78,1.78-1.78Z"/><path fill="#0f9e8a" d="M32.78,37.74v14.83H1.78c-.98,0-1.78-.8-1.78-1.78v-11.27c0-.98.8-1.78,1.78-1.78h31Z"/><path fill="#0f9e8a" d="M66.73,39.52v11.27c0,.98-.8,1.78-1.78,1.78h-7.41v-14.83h7.41c.98,0,1.78.8,1.78,1.78Z"/><path fill="#4861ad" d="M52.57,1.78v7.41h-14.83V1.78c0-.98.8-1.78,1.78-1.78h11.27c.98,0,1.78.8,1.78,1.78Z"/><path fill="#4861ad" d="M37.74,33.95h14.83v31c0,.98-.8,1.78-1.78,1.78h-11.27c-.98,0-1.78-.8-1.78-1.78v-31Z"/><path fill="#f05b40" d="M66.73,15.94v11.27c0,.98-.8,1.78-1.78,1.78h-31v-14.83h31c.98,0,1.78.8,1.78,1.78Z"/></svg>';
    // the site's typefaces, loaded once, only when a Topicweave scene is built; a scene measured before Fraunces
    // arrived rebuilds itself once (fonts.check() reports true while the stylesheet itself is still loading)
    var FP = null, FONTS_OK = false;
    function fonts(sc){
      if (!FP) FP = new Promise(function(done){
        function res(){ FONTS_OK = true; done(); }
        var l = document.createElement('link'); l.id = 'tw-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..500,0..100&family=Inter+Tight:wght@300;400;500;600&display=swap';
        l.onload = function(){ (document.fonts ? Promise.all([document.fonts.load('350 24px "Fraunces"'), document.fonts.load('400 12px "Inter Tight"')]) : Promise.resolve()).then(res, res); };
        l.onerror = function(){ res(); };
        document.head.appendChild(l);
        setTimeout(res, 5000);
      });
      if (sc && !sc._tf && !FONTS_OK){ sc._tf = true; FP.then(function(){ if (K.rebuild) K.rebuild(sc); }); }
    }
    // a browser bar in the site's look (black glass, the mark, the url)
    function bar(url){ return '<div class="tw-bar"><i></i><i></i><i></i><span>' + ICON + esc(url) + '</span></div>'; }
    // images shipped in this repo (code/vendor/topicweave/), same tag as the bundle
    function asset(name){ return VENDOR + 'topicweave/' + name; }
    function c01(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(v){ return 1 - Math.pow(1 - v, 3); }

    /* ---------- the thread cloth ---------- */
    // weave(host, { mode: 'radial'|'band', cover: '#000', grid: 15, len: 11, durIn: .5, durOut: .75, from: 'left'|'right' })
    // returns fn(open, [x, y]) + fn.destroy(); the canvas fills the host (position it with CSS: .tw-weave)
    function weave(host, o){
      o = o || {};
      var cv = document.createElement('canvas'); cv.className = 'tw-weave' + (o.cls ? ' ' + o.cls : ''); cv.setAttribute('aria-hidden', 'true');
      host.appendChild(cv);
      var ctx = cv.getContext('2d'), radial = o.mode !== 'band', cells = [], w = 0, h = 0, dpr = 1, gsz = o.grid || 15, len = o.len || 11;
      var P = 0, target = 0, raf = 0, last = 0, t0 = 0, ox = 0, oy = 0, PS = null, TILE = null, dead = false, onDone = null;
      var cover = o.cover || C.void, durIn = o.durIn || .5, durOut = o.durOut || .75;
      function size(){
        w = cv.clientWidth; h = cv.clientHeight; if (!w || !h) return false;
        dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
        cells = [];
        for (var r = 0; r * gsz < h + gsz; r++) for (var c = 0; c * gsz < w + gsz; c++){
          var vert = ((c >> 1) + (r >> 1)) & 1, x = c * gsz + gsz / 2, y = r * gsz + gsz / 2, j = ((c * 37 + r * 91) % 100) / 100, d, ux, uy;
          if (radial){
            var dx = x - ox, dy = y - oy, L = Math.sqrt(dx * dx + dy * dy) || 1, far = Math.sqrt(Math.pow(Math.max(ox, w - ox), 2) + Math.pow(Math.max(oy, h - oy), 2)) || 1;
            d = (L / far) * .62 + ((c * 7 + r * 13) % 10) / 10 * .08; ux = dx / L; uy = dy / L;
          } else {
            var fx = o.from === 'right' ? 1 - x / Math.max(1, w) : x / Math.max(1, w);
            d = fx * .55 + j * .25; ux = o.from === 'right' ? 1 : -1; uy = (j - .5) * .45;
          }
          cells.push({ x: x, y: y, c: c, r: r, vert: vert, col: WEAVE[(vert ? c : r) % 4], d: d, j: j, ux: ux, uy: uy, over: ((c + r) & 1) === (vert ? 0 : 1) });
        }
        PS = new Float32Array(cells.length); TILE = null;
        return true;
      }
      // the settled cloth repeats every 4 cells: one tile, drawn once, filled across every settled cell in one call
      function tile(){
        var key = cover + gsz + dpr; if (TILE && TILE.k === key) return TILE.pat;
        var tc = document.createElement('canvas'), T4 = gsz * 4; tc.width = tc.height = Math.round(T4 * dpr);
        var tx = tc.getContext('2d'); tx.setTransform(dpr, 0, 0, dpr, 0, 0); tx.fillStyle = cover; tx.fillRect(0, 0, T4, T4); tx.lineCap = 'round'; tx.lineWidth = 1.4;
        for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++){
          var vert = ((c >> 1) + (r >> 1)) & 1, over = ((c + r) & 1) === (vert ? 0 : 1), x = Math.round(c * gsz + gsz / 2) + .5, y = Math.round(r * gsz + gsz / 2) + .5;
          tx.globalAlpha = over ? .85 : .2; tx.strokeStyle = WEAVE[(vert ? c : r) % 4]; tx.beginPath();
          if (vert){ tx.moveTo(x, y - len / 2); tx.lineTo(x, y + len / 2); } else { tx.moveTo(x - len / 2, y); tx.lineTo(x + len / 2, y); }
          tx.stroke();
        }
        var pat = ctx.createPattern(tc, 'repeat'); if (pat.setTransform && window.DOMMatrix) pat.setTransform(new DOMMatrix().scale(1 / dpr));
        TILE = { k: key, pat: pat }; return pat;
      }
      function line(k, x, y, a, alpha){
        var ex = Math.cos(a) * len / 2, ey = Math.sin(a) * len / 2;
        ctx.globalAlpha = alpha; ctx.strokeStyle = k.col; ctx.beginPath(); ctx.moveTo(x - ex, y - ey); ctx.lineTo(x + ex, y + ey); ctx.stroke();
      }
      function draw(now){
        if (dead) return;
        var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
        if (radial) P = target ? Math.min(1, P + Math.min(dt, .034) / durIn) : Math.max(0, P - Math.min(dt, .034) / durOut);
        else { P += (target - P) * Math.min(1, dt * (target ? 2.6 : 6)); if (Math.abs(target - P) < .002) P = target; }
        var T = (now - t0) / 1000, n, k, p;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.lineCap = 'round'; ctx.lineWidth = 1.4;
        if (radial){
          // first the cover, one square per cell (solid once its threads are mostly in), then the threads on top
          ctx.fillStyle = cover;
          for (n = 0; n < cells.length; n++){
            k = cells[n];
            p = ease(c01(target ? (P * 1.6 - k.d) / .9 : (P * 1.6 - (.7 - k.d)) / .9)); PS[n] = p;
            if (p <= 0 || p * 1.7 >= 1) continue;
            ctx.globalAlpha = p * 1.7; ctx.fillRect(k.c * gsz - .5, k.r * gsz - .5, gsz + 1, gsz + 1);
          }
          ctx.globalAlpha = 1; ctx.beginPath();
          for (n = 0; n < cells.length; n++){ if (PS[n] * 1.7 >= 1 && PS[n] < .999){ k = cells[n]; ctx.rect(k.c * gsz - .5, k.r * gsz - .5, gsz + 1, gsz + 1); } }
          ctx.fillStyle = cover; ctx.fill();
          ctx.beginPath();
          for (n = 0; n < cells.length; n++){ if (PS[n] >= .999){ k = cells[n]; ctx.rect(k.c * gsz, k.r * gsz, gsz, gsz); } }
          ctx.fillStyle = tile(); ctx.fill();
          for (n = 0; n < cells.length; n++){
            p = PS[n]; if (p <= 0 || p >= .999) continue; k = cells[n];
            var fly = (1 - p) * (target ? -(40 + k.j * 50) : 70 + k.j * 90);
            line(k, Math.round(k.x + k.ux * fly) + .5, Math.round(k.y + k.uy * fly) + .5, (k.vert ? Math.PI / 2 : 0) * (target ? p : 1), p * (k.over ? .85 : .2));
          }
        } else {
          // a slow wave runs through the cloth and the thread on top brightens as it passes
          for (n = 0; n < cells.length; n++){
            k = cells[n]; p = ease(c01((P * 1.7 - k.d) / .7)); if (p <= 0) continue;
            var wv = K.reduce ? 0 : Math.sin(k.c * .45 - k.r * .3 + T * 1.3);
            var x = k.x + (k.vert ? wv * 1.2 : 0) - k.ux * (1 - p) * (90 + k.j * 140), y = k.y + (k.vert ? 0 : wv * 1.2) + (1 - p) * (k.j - .5) * 40;
            line(k, x, y, (k.vert ? Math.PI / 2 : 0) * p, p * (k.over ? .8 + .2 * wv : .14));
          }
        }
        ctx.globalAlpha = 1;
        var settled = P === target;
        raf = 0;
        if (settled && onDone){ var f = onDone; onDone = null; f(); settled = P === target; if (raf) return; }
        // a band keeps its wave running while woven and on screen; everything else stops once it settles
        raf = !settled || (!radial && target && !K.reduce && o.live !== false && seen) ? requestAnimationFrame(draw) : 0;
      }
      var seen = true;
      if (!radial && window.IntersectionObserver) new IntersectionObserver(function(es){
        seen = es[0].isIntersecting; if (seen && target && !raf && !dead){ last = 0; raf = requestAnimationFrame(draw); }
      }).observe(cv);
      function fn(open, at, done){
        if (dead) return;
        target = open ? 1 : 0; onDone = done || null;
        if (at){ ox = at[0]; oy = at[1]; }
        if (open || !cells.length){ if (!size()) { if (done) done(); return; } }
        if (!t0) t0 = window.performance ? performance.now() : Date.now();
        if (!raf){ last = 0; raf = requestAnimationFrame(draw); }
      }
      // jump to a settled state (no motion), e.g. under reduced motion
      fn.set = function(open){ if (dead) return; target = P = open ? 1 : 0; if (!cells.length && !size()) return; last = 0; if (!raf) raf = requestAnimationFrame(draw); };
      fn.canvas = cv;
      fn.destroy = function(){ dead = true; if (raf) cancelAnimationFrame(raf); if (cv.parentNode) cv.parentNode.removeChild(cv); };
      return fn;
    }

    K.tw = { C: C, WEAVE: WEAVE, LOGO: LOGO, ICON: ICON, fonts: fonts, bar: bar, asset: asset, weave: weave, c01: c01, ease: ease };
  })();
