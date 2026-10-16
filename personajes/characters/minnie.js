// Minnie Mouse
CHARACTER({
  id: "minnie", name: "Minnie", emoji: "🎀", female: true,
  // Voz de ElevenLabs por defecto (se puede cambiar en Ajustes de voz)
  voiceId: "gMjKNUC2AFdB75p87M2h",
  // Voz del navegador: tono y velocidad propios, y si busca voz de hombre o de mujer
  browser: { pitch: 1.9, rate: 0.95, female: true },
  // Opciones de ropa (colores del vestido y el moño)
  looks: [{ value: "red", label: "Rojo clásico" }, { value: "pink", label: "Rosa (La Casa de Mickey)" }],
  // Hombros: desde donde giran los brazos
  shoulders: [[166, 282], [234, 282]],
  // Dónde quedan las manos en reposo (los brazos se estiran desde el hombro hasta ahí)
  hands: [[114, 368], [286, 368]],
  // Brazos de "manguera": al levantarlos se estiran (raiseScale); ángulo y largo para tirar
  // besitos (kissAngle, kissScale) y [ángulo, largo] para taparse los ojos en "Cucú"
  raiseScale: 1.9, kissAngle: 176, kissScale: 0.7, peekaboo: [156, 1.38], waveAngle: 118,
  // Altura del almohadón al sentarse
  seatY: 466,
  // Dónde van las prendas del armario (wardrobe.js): cinta del gorro, centro de los lentes,
  // cuello y cintura de la camisa, cintura y ruedo del pantalón, y [x, y, ancho] de cada zapato
  fit: {
    hat: { y: 106, w: 172 }, glasses: { cy: 144, s: 0.5 },
    top: { neck: 258, waist: 318, w: 80 }, sleeve: 0.95,
    bottom: { waist: 312, hem: 398, w: 84 },
    shoes: [[160, 476, 80], [240, 476, 80]]
  },
  // Sonrisa ancha de cachete a cachete que se abre hacia abajo
  mouth: {
    path: o => `M150 200 Q200 238 250 200 Q200 ${(238 + o * 46).toFixed(1)} 150 200 Z`,
    tongue: o => 226 + o * 16
  },
  // Partes elásticas: centro (cx, cy), radio, punto de unión (base) y cuánto se estiran (max)
  parts: {
    earL:  { kind: "ear",  cx: 104, cy: 76,  r: 56, base: [147, 116], max: 115, blob: "earL", neck: "earLneck" },
    earR:  { kind: "ear",  cx: 296, cy: 76,  r: 56, base: [253, 116], max: 115, blob: "earR", neck: "earRneck" },
    nose:  { kind: "nose", cx: 200, cy: 184, r: 16, base: [200, 184], max: 120, blob: "nose", neck: "noseNeck", w0: 11 },
    footL: { kind: "foot", cx: 160, cy: 480, hip: [184, 404], ankle: [180, 466], max: 110, blob: "footL", line: "legLline" },
    footR: { kind: "foot", cx: 240, cy: 480, hip: [216, 404], ankle: [220, 466], max: 110, blob: "footR", line: "legRline" }
  },
  // Lo que dice al jugar con cada parte
  reactions: {
    ear:   ["¡Ay, mis orejitas!", "¡Jiji! ¡Qué orejas tan largas!", "¡Boing! ¡Mis orejas son de goma!"],
    nose:  ["¡Mi naricita!", "¡Jiji, me hacés cosquillas en la nariz!", "¡Pip, pip!"],
    foot:  ["¡Jiji, cosquillas en los pies!", "¡Mis zapatitos!", "¡A bailar!"],
    pet:   ["Mmm, ¡qué lindo mimo, {nombre}!", "¡Me encantan tus caricias!", "Gracias, {nombre}. ¡Te quiero!"],
    tummy: ["¡Jajaja! ¡Cosquillas no!", "¡Jiji, me hacés reír!", "¡Jajaja, basta, basta!"],
    bow:   ["¿Te gusta mi moño?", "¡Mi moño es mi favorito!"],
    hand:  ["¡Choca esos cinco, {nombre}!", "¡Bien ahí, {nombre}!"],
    head:  ["¡Hola {nombre}!", "¡Jiji! ¡Me hacés cosquillas!", "¿Me das un abrazo, {nombre}?", "¡Qué lindo día para jugar!", "¡Te quiero mucho, {nombre}!"]
  },
  svg: `
    <defs>
      <!-- lunares grandes, como en el vestido original -->
      <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
        <rect width="30" height="30" class="mfill"/>
        <circle cx="8" cy="8" r="6" fill="#fff"/>
        <circle cx="23" cy="23" r="6" fill="#fff"/>
      </pattern>
      <pattern id="dotsBig" width="42" height="42" patternUnits="userSpaceOnUse">
        <rect width="42" height="42" class="mfill"/>
        <circle cx="10" cy="10" r="8.5" fill="#fff"/>
        <circle cx="31" cy="31" r="8.5" fill="#fff"/>
      </pattern>
      <!-- volumen: brillo en lo negro, sombra en la cara, la ropa y los zapatos -->
      <radialGradient id="blackShade" cx="38%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#3a3a3a"/>
        <stop offset="55%" stop-color="#151515"/>
        <stop offset="100%" stop-color="#050505"/>
      </radialGradient>
      <radialGradient id="faceShade" cx="50%" cy="38%" r="68%">
        <stop offset="60%" stop-color="#fcd9bc"/>
        <stop offset="100%" stop-color="#eeb892"/>
      </radialGradient>
      <radialGradient id="clothShade" cx="42%" cy="30%" r="80%">
        <stop offset="55%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".22"/>
      </radialGradient>
      <linearGradient id="shoeShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffd84a"/>
        <stop offset="100%" stop-color="#e5a300"/>
      </linearGradient>
      <radialGradient id="gloveShade" cx="40%" cy="35%" r="70%">
        <stop offset="65%" stop-color="#fff"/>
        <stop offset="100%" stop-color="#dfe3ea"/>
      </radialGradient>
      <clipPath id="mouthClip"><path id="mouthClipPath" d="M150 200 Q200 238 250 200 Q200 238 150 200 Z"/></clipPath>
    </defs>

    <g id="all"><g id="sway">
      <!-- cola fina -->
      <path id="tail" d="M252 392 C304 416 334 376 318 342 C310 324 292 330 300 346" stroke="#111" stroke-width="4.5" fill="none" stroke-linecap="round"/>

      <!-- piernas finas y zapatos grandes -->
      <g id="legL">
        <path id="legLline" d="M184 404 L180 466" stroke="#111" stroke-width="10" stroke-linecap="round"/>
        <g id="footL" data-part="footL" class="grab">
          <g class="orig-shoes">
          <path d="M122 486 Q118 458 158 456 Q194 456 198 478 Q200 494 184 496 L136 496 Q122 496 122 486 Z" fill="url(#shoeShade)" stroke="#b98200" stroke-width="2.5"/>
          <ellipse cx="146" cy="468" rx="13" ry="5" fill="#fff" opacity=".5"/>
          </g>
        </g>
      </g>
      <g id="legR">
        <path id="legRline" d="M216 404 L220 466" stroke="#111" stroke-width="10" stroke-linecap="round"/>
        <g id="footR" data-part="footR" class="grab">
          <g class="orig-shoes">
          <path d="M278 486 Q282 458 242 456 Q206 456 202 478 Q200 494 216 496 L264 496 Q278 496 278 486 Z" fill="url(#shoeShade)" stroke="#b98200" stroke-width="2.5"/>
          <ellipse cx="254" cy="468" rx="13" ry="5" fill="#fff" opacity=".5"/>
          </g>
        </g>
      </g>

      <!-- falda corta con vuelo -->
      <g id="skirt" data-part="tummy" class="orig-bottom">
        <path d="M168 312 L232 312 Q274 350 298 398 Q276 410 250 404 Q226 416 200 408 Q174 416 150 404 Q124 410 102 398 Q126 350 168 312 Z" fill="url(#dotsBig)" class="mstroke" stroke-width="3" stroke-linejoin="round"/>
        <path d="M168 312 L232 312 Q274 350 298 398 Q276 410 250 404 Q226 416 200 408 Q174 416 150 404 Q124 410 102 398 Q126 350 168 312 Z" fill="url(#clothShade)"/>
        <path d="M184 318 Q176 360 164 404 M216 318 Q224 360 236 404" class="mstroke" stroke-width="2" fill="none" opacity=".45"/>
      </g>
      <!-- torso del vestido -->
      <g data-part="tummy" class="orig-top">
        <path d="M178 260 L222 260 Q238 290 234 318 L166 318 Q162 290 178 260 Z" fill="url(#dots)" class="mstroke" stroke-width="3"/>
        <path d="M178 260 L222 260 Q238 290 234 318 L166 318 Q162 290 178 260 Z" fill="url(#clothShade)"/>
      </g>

      <g id="head" data-part="head">
        <!-- orejas elásticas: "neck" une la oreja estirada con la cabeza -->
        <g data-part="earL" class="grab">
          <path id="earLneck" fill="none" stroke="#111" stroke-linecap="round"/>
          <circle id="earL" cx="104" cy="76" r="56" fill="url(#blackShade)"/>
        </g>
        <g data-part="earR" class="grab">
          <path id="earRneck" fill="none" stroke="#111" stroke-linecap="round"/>
          <circle id="earR" cx="296" cy="76" r="56" fill="url(#blackShade)"/>
        </g>
        <circle cx="200" cy="160" r="88" fill="url(#blackShade)"/>

        <!-- cara: pico entre los ojos y cachetes redondos -->
        <path d="M200 114 C190 86 150 84 144 118 C130 132 114 164 116 198 C118 240 152 264 200 264 C248 264 282 240 284 198 C286 164 270 132 256 118 C250 84 210 86 200 114 Z" fill="url(#faceShade)"/>
        <!-- hocico con un brillo suave -->
        <ellipse cx="200" cy="202" rx="48" ry="36" fill="#fff" opacity=".13"/>

        <!-- cachetes -->
        <ellipse class="cheek" cx="142" cy="208" rx="14" ry="9" fill="#ff8fab" opacity=".35"/>
        <ellipse class="cheek" cx="258" cy="208" rx="14" ry="9" fill="#ff8fab" opacity=".35"/>

        <!-- ojos -->
        <g id="eyes">
          <ellipse cx="182" cy="142" rx="16.5" ry="28.5" fill="#fff" stroke="#111" stroke-width="2.5"/>
          <ellipse cx="218" cy="142" rx="16.5" ry="28.5" fill="#fff" stroke="#111" stroke-width="2.5"/>
          <g id="pupils">
            <ellipse cx="185" cy="152" rx="10.5" ry="18" fill="#111"/>
            <ellipse cx="215" cy="152" rx="10.5" ry="18" fill="#111"/>
            <ellipse cx="187.5" cy="144" rx="3.5" ry="5" fill="#fff"/>
            <ellipse cx="217.5" cy="144" rx="3.5" ry="5" fill="#fff"/>
          </g>
          <!-- pestañas largas y curvadas -->
          <g stroke="#111" stroke-width="4.5" stroke-linecap="round" fill="none">
            <path d="M170 121 Q158 112 152 98"/>
            <path d="M167 130 Q153 126 143 118"/>
            <path d="M176 116 Q172 103 174 90"/>
            <path d="M230 121 Q242 112 248 98"/>
            <path d="M233 130 Q247 126 257 118"/>
            <path d="M224 116 Q228 103 226 90"/>
          </g>
        </g>
        <g id="happyEyes" stroke="#111" stroke-width="5.5" stroke-linecap="round" fill="none">
          <path d="M167 148 Q182 128 197 148"/>
          <path d="M203 148 Q218 128 233 148"/>
          <path d="M165 138 L154 128 M169 132 L162 118 M235 138 L246 128 M231 132 L238 118" stroke-width="4"/>
        </g>

        <!-- nariz elástica -->
        <g data-part="nose" class="grab">
          <path id="noseNeck" fill="none" stroke="#f0c29e" stroke-linecap="round"/>
          <g id="nose">
            <ellipse cx="200" cy="184" rx="21" ry="14" fill="url(#blackShade)"/>
            <ellipse cx="193" cy="179" rx="7" ry="3.5" fill="#fff" opacity=".6"/>
          </g>
        </g>

        <!-- boca -->
        <path id="mouthOpen" d="M150 200 Q200 238 250 200 Q200 238 150 200 Z" fill="#5a0a14" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
        <ellipse id="tongue" cx="200" cy="232" rx="19" ry="10" fill="#ff6f8a" clip-path="url(#mouthClip)"/>
        <path d="M150 200 Q200 238 250 200" stroke="#111" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M144 193 Q152 198 153 206 M256 193 Q248 198 247 206" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>

        <!-- moño grande con pliegues -->
        <g id="bow" data-part="bow" class="orig-hat">
          <path d="M200 70 C176 24 108 18 104 64 C100 112 170 116 200 70 Z" fill="url(#dotsBig)" class="mstroke" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M200 70 C224 24 292 18 296 64 C300 112 230 116 200 70 Z" fill="url(#dotsBig)" class="mstroke" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M200 70 C176 24 108 18 104 64 C100 112 170 116 200 70 Z M200 70 C224 24 292 18 296 64 C300 112 230 116 200 70 Z" fill="url(#clothShade)"/>
          <path d="M194 66 Q158 50 120 60 M194 78 Q158 96 122 90 M206 66 Q242 50 280 60 M206 78 Q242 96 278 90" class="mstroke" stroke-width="2.2" fill="none" opacity=".55"/>
          <ellipse cx="200" cy="72" rx="19" ry="24" class="mfill mstroke" stroke-width="3.5"/>
          <ellipse cx="200" cy="72" rx="19" ry="24" fill="url(#clothShade)"/>
          <ellipse cx="194" cy="63" rx="5.5" ry="8" fill="#fff" opacity=".4"/>
        </g>
      </g>

      <!-- brazos finos y guantes grandes (por delante de la cabeza, para poder tirar besitos) -->
      <g id="armL" data-part="handL">
        <g class="armline"><path d="M166 282 Q134 314 118 356" stroke="#111" stroke-width="10" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/></g>
        <g class="reach"><g transform="translate(114 368) rotate(20)">
          <ellipse cx="0" cy="-15" rx="13" ry="7.5" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <ellipse cx="-19" cy="-1" rx="8" ry="11" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2" transform="rotate(-25 -19 -1)"/>
          <ellipse cx="-9" cy="20" rx="7" ry="9" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <ellipse cx="1" cy="23" rx="7" ry="9" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <ellipse cx="11" cy="20" rx="7" ry="9" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <circle cx="0" cy="5" r="19" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <path d="M-6 -1 L-6 10 M0 -2 L0 11 M6 -1 L6 10" stroke="#111" stroke-width="2" stroke-linecap="round"/>
        </g></g>
      </g>
      <g id="armR" data-part="handR">
        <g class="armline"><path d="M234 282 Q266 314 282 356" stroke="#111" stroke-width="10" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/></g>
        <g class="reach"><g transform="translate(286 368) rotate(-20)">
          <ellipse cx="0" cy="-15" rx="13" ry="7.5" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <ellipse cx="19" cy="-1" rx="8" ry="11" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2" transform="rotate(25 19 -1)"/>
          <ellipse cx="9" cy="20" rx="7" ry="9" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <ellipse cx="-1" cy="23" rx="7" ry="9" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <ellipse cx="-11" cy="20" rx="7" ry="9" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <circle cx="0" cy="5" r="19" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="2"/>
          <path d="M-6 -1 L-6 10 M0 -2 L0 11 M6 -1 L6 10" stroke="#111" stroke-width="2" stroke-linecap="round"/>
        </g></g>
      </g>
      <!-- mangas abullonadas -->
      <g data-part="tummy" class="orig-top">
        <circle cx="166" cy="280" r="19" fill="url(#dots)" class="mstroke" stroke-width="3"/>
        <circle cx="234" cy="280" r="19" fill="url(#dots)" class="mstroke" stroke-width="3"/>
        <circle cx="166" cy="280" r="19" fill="url(#clothShade)"/>
        <circle cx="234" cy="280" r="19" fill="url(#clothShade)"/>
      </g>
    </g></g>
`
});
