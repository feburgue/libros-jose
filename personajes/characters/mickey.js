// Mickey Mouse (misma base de dibujo que Minnie)
CHARACTER({
  id: "mickey", name: "Mickey", emoji: "🐭", female: false,
  // Voz de ElevenLabs por defecto (se puede cambiar en Ajustes de voz)
  voiceId: "i8vki8gZhHyJqjwRblDZ",
  looks: [],
  // Hombros y manos en reposo (brazos de "manguera" como los de Minnie)
  shoulders: [[166, 282], [234, 282]],
  hands: [[114, 368], [286, 368]],
  raiseScale: 1.9, kissAngle: 176, kissScale: 0.7, peekaboo: [156, 1.38], waveAngle: 118,
  // Altura del almohadón al sentarse
  seatY: 452,
  // Dónde van las prendas del armario (wardrobe.js): cinta del gorro, centro de los lentes,
  // cuello y cintura de la camisa, cintura y ruedo del pantalón, y [x, y, ancho] de cada zapato
  fit: {
    hat: { y: 106, w: 172 }, glasses: { cy: 144, s: 0.5 },
    top: { neck: 254, waist: 332, w: 98 }, sleeve: 1,
    bottom: { waist: 326, hem: 394, w: 100 },
    shoes: [[155, 468, 96], [245, 468, 96]]
  },
  // Arranca vestido de explorador
  defaultOutfit: { hat: "safari", top: "safari", bottom: "safari", shoes: "botas" },
  // Sonrisa ancha que se abre hacia abajo
  mouth: {
    path: o => `M150 200 Q200 238 250 200 Q200 ${(238 + o * 46).toFixed(1)} 150 200 Z`,
    tongue: o => 226 + o * 16
  },
  // Partes elásticas: centro (cx, cy), radio, punto de unión (base) y cuánto se estiran (max)
  parts: {
    earL:  { kind: "ear",  cx: 104, cy: 76,  r: 56, base: [147, 116], max: 115, blob: "earL", neck: "earLneck" },
    earR:  { kind: "ear",  cx: 296, cy: 76,  r: 56, base: [253, 116], max: 115, blob: "earR", neck: "earRneck" },
    nose:  { kind: "nose", cx: 200, cy: 184, r: 16, base: [200, 184], max: 120, blob: "nose", neck: "noseNeck", w0: 11 },
    footL: { kind: "foot", cx: 155, cy: 470, hip: [186, 390], ankle: [182, 458], max: 110, blob: "footL", line: "legLline" },
    footR: { kind: "foot", cx: 245, cy: 470, hip: [214, 390], ankle: [218, 458], max: 110, blob: "footR", line: "legRline" }
  },
  // Lo que dice al jugar con cada parte
  reactions: {
    ear:   ["¡Ay, mis orejotas!", "¡Jaja! ¡Qué orejas tan largas!", "¡Boing! ¡Mis orejas son de goma!"],
    nose:  ["¡Mi nariz!", "¡Jaja, cosquillas en la nariz!", "¡Pip, pip!"],
    foot:  ["¡Jaja, mis zapatones!", "¡Cosquillas en los pies!", "¡A bailar!"],
    pet:   ["¡Qué lindo mimo, {nombre}!", "¡Gracias, amiga!", "¡Me encanta, {nombre}!"],
    tummy: ["¡Jajaja! ¡Cosquillas no!", "¡Jaja, me hacés reír!", "¡Jajaja, basta, basta!"],
    hand:  ["¡Choca esos cinco, {nombre}!", "¡Bien ahí, campeona!"],
    head:  ["¡Hola, {nombre}! ¡Soy yo, Mickey!", "¡Oh, qué alegría verte!", "¿Vamos a jugar, {nombre}?", "¡Qué lindo día!", "¡Jaja! ¡Hola, amiga!"]
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
      <path id="tail" d="M250 380 C304 404 334 364 318 330 C310 312 292 318 300 334" stroke="#111" stroke-width="4.5" fill="none" stroke-linecap="round"/>

      <!-- piernas finas y zapatones -->
      <g id="legL">
        <path id="legLline" d="M186 390 L182 458" stroke="#111" stroke-width="10" stroke-linecap="round"/>
        <g id="footL" data-part="footL" class="grab">
          <g class="orig-shoes">
          <path d="M108 482 Q104 448 156 446 Q200 446 202 470 Q204 490 184 492 L126 492 Q108 492 108 482 Z" fill="url(#shoeShade)" stroke="#b98200" stroke-width="2.5"/>
          <ellipse cx="138" cy="460" rx="16" ry="6" fill="#fff" opacity=".5"/>
          </g>
        </g>
      </g>
      <g id="legR">
        <path id="legRline" d="M214 390 L218 458" stroke="#111" stroke-width="10" stroke-linecap="round"/>
        <g id="footR" data-part="footR" class="grab">
          <g class="orig-shoes">
          <path d="M292 482 Q296 448 244 446 Q200 446 198 470 Q196 490 216 492 L274 492 Q292 492 292 482 Z" fill="url(#shoeShade)" stroke="#b98200" stroke-width="2.5"/>
          <ellipse cx="262" cy="460" rx="16" ry="6" fill="#fff" opacity=".5"/>
          </g>
        </g>
      </g>

      <!-- torso negro -->
      <path data-part="tummy" d="M176 256 L224 256 Q248 294 246 334 L154 334 Q152 294 176 256 Z" fill="url(#blackShade)"/>
      <!-- pantalón rojo con dos botones grandes -->
      <g data-part="tummy" class="orig-bottom">
        <path d="M152 326 L248 326 Q260 360 264 394 L212 396 L200 376 L188 396 L136 394 Q140 360 152 326 Z" class="mfill mstroke" stroke-width="3" stroke-linejoin="round"/>
        <path d="M152 326 L248 326 Q260 360 264 394 L212 396 L200 376 L188 396 L136 394 Q140 360 152 326 Z" fill="url(#clothShade)"/>
        <ellipse cx="182" cy="348" rx="9.5" ry="14" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="1.5"/>
        <ellipse cx="218" cy="348" rx="9.5" ry="14" fill="url(#gloveShade)" stroke="#c9ced8" stroke-width="1.5"/>
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
        <ellipse class="cheek" cx="142" cy="208" rx="14" ry="9" fill="#ff8fab" opacity=".2"/>
        <ellipse class="cheek" cx="258" cy="208" rx="14" ry="9" fill="#ff8fab" opacity=".2"/>

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
        </g>
        <g id="happyEyes" stroke="#111" stroke-width="5.5" stroke-linecap="round" fill="none">
          <path d="M167 148 Q182 128 197 148"/>
          <path d="M203 148 Q218 128 233 148"/>
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
    </g></g>
`
});
