// Pata Daisy (misma base de dibujo que Donald)
CHARACTER({
  id: "daisy", name: "Daisy", emoji: "🌸", female: true,
  // Usa la voz de Minnie con el tono un poco más grave (pitch), para ahorrar una voz de ElevenLabs
  voiceId: "gMjKNUC2AFdB75p87M2h",
  // Voz del navegador: un poco menos aguda que Minnie y más rápida, con carácter
  browser: { pitch: 1.6, rate: 1.05, female: true },
  pitch: "0.92",
  // Color del moño y los zapatos
  looks: [{ value: "pink", label: "Moño rosa" }, { value: "purple", label: "Moño violeta" }],
  // Rosa claro como en el dibujo original
  css: `#char[data-look="pink"]{--m:#f0a6d8; --md:#c46fa8}`,
  // Colores y recorte de la cara para el avatar del selector
  thumbCss: ".mfill{fill:#f0a6d8}.mstroke{stroke:#c46fa8}",
  thumbBox: "82 4 236 236",
  // Hombros y manos en reposo; brazos que se estiran un poco al levantarlos
  shoulders: [[160, 252], [240, 252]],
  hands: [[124, 342], [276, 342]],
  raiseScale: 1.35, kissAngle: 167, kissScale: 0.72, peekaboo: [168, 1.37], waveAngle: 118,
  // Altura del almohadón al sentarse
  seatY: 486,
  // Dónde van las prendas del armario (wardrobe.js): cinta del gorro, centro de los lentes,
  // cuello y cintura de la camisa, cintura y ruedo del pantalón, y [x, y, ancho] de cada zapato
  fit: {
    hat: { y: 100, w: 166 }, glasses: { cy: 130, s: 0.5 },
    top: { neck: 226, waist: 350, w: 148 }, sleeve: 1.3,
    bottom: { waist: 344, hem: 428, w: 150 },
    shoes: [[146, 488, 92], [254, 488, 92]]
  },
  // Pico: la parte de abajo ("jaw") baja al hablar y deja ver la boca
  // (coordenadas del pico antes de achicarlo: ver el grupo "billScale")
  mouth: {
    path: o => { const j = o * 24; return `M114 246 C150 266 250 266 286 246 L270 ${250 + j} C250 ${262 + j} 150 ${262 + j} 130 ${250 + j} Z`; },
    tongue: o => 262 + o * 18,
    jaw: 24
  },
  // Partes elásticas: centro (cx, cy), radio, punto de unión (base) y cuánto se estiran (max)
  parts: {
    cheekL: { kind: "cheek", cx: 142, cy: 190, r: 22, base: [165, 182], max: 100, blob: "cheekL", neck: "cheekLneck" },
    cheekR: { kind: "cheek", cx: 258, cy: 190, r: 22, base: [235, 182], max: 100, blob: "cheekR", neck: "cheekRneck" },
    nose:   { kind: "nose", cx: 200, cy: 190, r: 32, base: [200, 178], max: 120, blob: "nose", neck: "noseNeck", w0: 19 },
    footL:  { kind: "foot", cx: 144, cy: 492, hip: [180, 428], ankle: [172, 476], max: 110, blob: "footL", line: "legLline" },
    footR:  { kind: "foot", cx: 256, cy: 492, hip: [220, 428], ankle: [228, 476], max: 110, blob: "footR", line: "legRline" }
  },
  // Lo que dice al jugar con cada parte
  reactions: {
    cheek: ["¡Ay, mis cachetitos!", "¡Jiji! ¡Qué cosquillas!", "¡Ay, ay, mis cachetes!"],
    nose:  ["¡Mi piquito!", "¡Cuac, cuac! ¡Jiji!", "¡Ay, mi piquito!"],
    foot:  ["¡Mis zapatitos!", "¡Jiji, cosquillas en los pies!", "¡A bailar!"],
    pet:   ["¡Ay, qué mimo tan lindo, {nombre}!", "¡Me encantás, {nombre}!", "¡Gracias, cariño!"],
    tummy: ["¡Jijiji! ¡Cosquillas no!", "¡Jiji, basta, basta!"],
    bow:   ["¿Te gusta mi moño, {nombre}?", "¡Mi moño es divino!"],
    hand:  ["¡Choca esos cinco, {nombre}!", "¡Bien ahí, cariño!"],
    head:  ["¡Hola, cariño! ¡Soy Daisy!", "¡Hola, {nombre}! ¡Qué lindo verte!", "¿Jugamos juntas, {nombre}?", "¡Ay, qué día tan lindo!"]
  },
  svg: `
    <defs>
      <clipPath id="mouthClip"><path id="mouthClipPath" d="M114 246 Z"/></clipPath>
      <!-- plumas blancas con sombra celeste -->
      <radialGradient id="featherShade" cx="42%" cy="32%" r="75%">
        <stop offset="55%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#d3def0"/>
      </radialGradient>
      <radialGradient id="eyeShade" cx="45%" cy="40%" r="70%">
        <stop offset="50%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#d4e2f4"/>
      </radialGradient>
      <radialGradient id="clothShade" cx="42%" cy="28%" r="80%">
        <stop offset="50%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".22"/>
      </radialGradient>
      <linearGradient id="billShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffc64d"/>
        <stop offset="100%" stop-color="#f2a226"/>
      </linearGradient>
      <linearGradient id="lidShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#8fb2e6"/>
        <stop offset="100%" stop-color="#b9d0f2"/>
      </linearGradient>
    </defs>

    <g id="all"><g id="sway">
      <!-- colita de plumas esponjosa -->
      <path id="tail" d="M138 372 Q100 364 88 332 Q104 342 110 334 Q94 318 100 300 Q116 324 128 322 Q120 306 128 292 Q140 318 152 328 Z" fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- patas y zapatos de taco del color del moño -->
      <g id="legL">
        <path id="legLline" d="M180 428 L172 476" stroke="#d99418" stroke-width="18" stroke-linecap="round"/>
        <g id="footL" data-part="footL" class="grab">
          <g class="orig-shoes">
          <path d="M104 502 Q102 474 144 472 Q180 470 186 488 Q190 504 172 506 L116 508 Q104 508 104 502 Z" class="mfill mstroke" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M104 502 Q102 474 144 472 Q180 470 186 488 Q190 504 172 506 L116 508 Q104 508 104 502 Z" fill="url(#clothShade)"/>
          <rect x="174" y="498" width="10" height="18" rx="3" class="mfill mstroke" stroke-width="2"/>
          <ellipse cx="130" cy="482" rx="15" ry="4.5" fill="#fff" opacity=".45"/>
          </g>
        </g>
      </g>
      <g id="legR">
        <path id="legRline" d="M220 428 L228 476" stroke="#d99418" stroke-width="18" stroke-linecap="round"/>
        <g id="footR" data-part="footR" class="grab">
          <g class="orig-shoes">
          <path d="M296 502 Q298 474 256 472 Q220 470 214 488 Q210 504 228 506 L284 508 Q296 508 296 502 Z" class="mfill mstroke" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M296 502 Q298 474 256 472 Q220 470 214 488 Q210 504 228 506 L284 508 Q296 508 296 502 Z" fill="url(#clothShade)"/>
          <rect x="216" y="498" width="10" height="18" rx="3" class="mfill mstroke" stroke-width="2"/>
          <ellipse cx="270" cy="482" rx="15" ry="4.5" fill="#fff" opacity=".45"/>
          </g>
        </g>
      </g>

      <!-- cuerpo con la parte de abajo esponjosa, como un tutú de plumas -->
      <path data-part="tummy" d="M168 226 C136 252 118 300 122 346 Q108 384 126 420 Q136 434 152 430 Q162 448 180 440 Q192 454 208 444 Q224 454 236 440 Q254 446 264 430 Q284 428 282 402 Q290 368 278 346 C282 300 264 252 232 226 Z" fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M150 400 Q160 414 172 406 M196 412 Q206 424 218 412 M238 400 Q250 412 258 400" stroke="#aebfd6" stroke-width="2" fill="none" opacity=".8"/>
      <!-- blusa lila con cuello en V -->
      <g data-part="tummy" class="orig-top">
        <path d="M168 228 L232 228 C258 256 272 300 272 346 C246 362 154 362 128 346 C128 300 142 256 168 228 Z" fill="#9d95dc" stroke="#6b63b5" stroke-width="3" stroke-linejoin="round"/>
        <path d="M168 228 L232 228 C258 256 272 300 272 346 C246 362 154 362 128 346 C128 300 142 256 168 228 Z" fill="url(#clothShade)"/>
        <path d="M180 229 L200 266 L220 229 Z" fill="url(#featherShade)" stroke="#6b63b5" stroke-width="2" stroke-linejoin="round"/>
        <path d="M150 300 Q156 330 150 350 M250 300 Q244 330 250 350" stroke="#6b63b5" stroke-width="1.8" fill="none" opacity=".45"/>
      </g>

      <g id="head" data-part="head">
        <!-- plumitas en la cabeza (detrás del moño) -->
        <path d="M184 76 Q170 50 184 40 Q184 56 196 60 Q196 40 212 36 Q204 54 212 68 Q222 52 236 56 Q220 64 216 80 Z" fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2" stroke-linejoin="round"/>
        <!-- cabeza -->
        <path d="M200 62 C250 62 282 96 280 142 C280 166 288 184 278 204 C266 226 236 236 200 236 C164 236 134 226 122 204 C112 184 120 166 120 142 C118 96 150 62 200 62 Z" fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2.5"/>

        <!-- cachetes elásticos (blancos: solo se ven al estirarlos) -->
        <g data-part="cheekL" class="grab">
          <path id="cheekLneck" fill="none" stroke="#fff" stroke-linecap="round"/>
          <circle id="cheekL" cx="142" cy="190" r="22" fill="#fff"/>
        </g>
        <g data-part="cheekR" class="grab">
          <path id="cheekRneck" fill="none" stroke="#fff" stroke-linecap="round"/>
          <circle id="cheekR" cx="258" cy="190" r="22" fill="#fff"/>
        </g>

        <!-- ojos grandes con párpados celestes y pestañas largas -->
        <g id="eyes">
          <ellipse cx="183" cy="126" rx="18.5" ry="31" fill="url(#eyeShade)" stroke="#1d2a44" stroke-width="2.5"/>
          <ellipse cx="217" cy="126" rx="18.5" ry="31" fill="url(#eyeShade)" stroke="#1d2a44" stroke-width="2.5"/>
          <g id="pupils">
            <ellipse cx="189" cy="138" rx="9" ry="15" fill="#111"/>
            <ellipse cx="211" cy="138" rx="9" ry="15" fill="#111"/>
            <ellipse cx="191" cy="132" rx="3" ry="4.2" fill="#fff"/>
            <ellipse cx="213" cy="132" rx="3" ry="4.2" fill="#fff"/>
          </g>
          <path d="M164.6 124 C163 102 172 95 183 95 C194 95 203 102 201.4 124 Q183 110 164.6 124 Z" fill="url(#lidShade)" stroke="#1d2a44" stroke-width="2.2"/>
          <path d="M198.6 124 C197 102 206 95 217 95 C228 95 237 102 235.4 124 Q217 110 198.6 124 Z" fill="url(#lidShade)" stroke="#1d2a44" stroke-width="2.2"/>
          <g stroke="#1d2a44" stroke-width="3.6" stroke-linecap="round" fill="none">
            <path d="M168 104 Q156 96 150 84"/>
            <path d="M165 112 Q151 108 142 100"/>
            <path d="M164 121 Q150 120 140 116"/>
            <path d="M173 98 Q168 86 170 74"/>
            <path d="M232 104 Q244 96 250 84"/>
            <path d="M235 112 Q249 108 258 100"/>
            <path d="M236 121 Q250 120 260 116"/>
            <path d="M227 98 Q232 86 230 74"/>
          </g>
        </g>
        <g id="happyEyes" stroke="#111" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M166 132 Q183 112 200 132"/>
          <path d="M200 132 Q217 112 234 132"/>
          <path d="M165 124 L152 116 M168 118 L160 106 M235 124 L248 116 M232 118 L240 106" stroke-width="3.6"/>
        </g>

        <!-- pico (como el de Donald, un poco más chico); la parte de abajo (jaw) baja al hablar -->
        <g data-part="nose" class="grab">
          <path id="noseNeck" fill="none" stroke="#f7a21b" stroke-linecap="round"/>
          <g id="nose">
            <g id="billScale" transform="translate(200 186) scale(.74) translate(-200 -228)">
              <path id="mouthOpen" d="M114 246 Z" fill="#5a0a14"/>
              <ellipse id="tongue" cx="200" cy="262" rx="28" ry="10" fill="#ff8fa3" clip-path="url(#mouthClip)"/>
              <g id="jaw">
                <path d="M128 250 C150 262 250 262 272 250 C268 280 240 296 200 296 C160 296 132 280 128 250 Z" fill="#f5a826" stroke="#c9780f" stroke-width="3" stroke-linejoin="round"/>
              </g>
              <path d="M184 186 Q200 180 216 186 C236 198 262 212 284 224 Q302 234 292 248 C282 264 244 268 200 268 C156 268 118 264 108 248 Q98 234 116 224 C138 212 164 198 184 186 Z" fill="url(#billShade)" stroke="#c9780f" stroke-width="3" stroke-linejoin="round"/>
              <path d="M190 200 Q192 204 190 208 M210 200 Q208 204 210 208" stroke="#a85a08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path d="M110 246 Q100 236 108 224 M290 246 Q300 236 292 224" stroke="#c9780f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <ellipse cx="164" cy="222" rx="26" ry="6" fill="#fff" opacity=".4" transform="rotate(-12 164 222)"/>
            </g>
          </g>
        </g>

        <!-- moño grande rosa claro, un poco ladeado -->
        <g id="bow" data-part="bow" class="orig-hat">
          <g transform="rotate(-8 200 60)">
            <path d="M200 60 C176 12 116 8 114 50 C112 96 172 100 200 60 Z" class="mfill mstroke" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M200 60 C224 12 284 8 286 50 C288 96 228 100 200 60 Z" class="mfill mstroke" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M200 60 C176 12 116 8 114 50 C112 96 172 100 200 60 Z M200 60 C224 12 284 8 286 50 C288 96 228 100 200 60 Z" fill="url(#clothShade)"/>
            <path d="M194 56 Q160 40 126 48 M194 68 Q160 84 128 80 M206 56 Q240 40 274 48 M206 68 Q240 84 272 80" class="mstroke" stroke-width="2.2" fill="none" opacity=".55"/>
            <ellipse cx="200" cy="62" rx="16" ry="20" class="mfill mstroke" stroke-width="3.5"/>
            <ellipse cx="195" cy="54" rx="5" ry="7" fill="#fff" opacity=".4"/>
          </g>
        </g>
      </g>

      <!-- brazos blancos con manos blancas; pulsera turquesa en una mano -->
      <g id="armL" data-part="handL">
        <g class="armline">
          <path d="M160 252 Q140 292 130 326" stroke="#aebfd6" stroke-width="19" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <path d="M160 252 Q140 292 130 326" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </g>
        <g class="reach"><g transform="translate(124 342) rotate(18)">
          <g fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2">
            <ellipse cx="-16" cy="-2" rx="5.5" ry="9.5" transform="rotate(50 -16 -2)"/>
            <ellipse cx="-8" cy="14" rx="5.5" ry="9.5" transform="rotate(20 -8 14)"/>
            <ellipse cx="1" cy="17" rx="5.5" ry="10"/>
            <ellipse cx="10" cy="13" rx="5.5" ry="9.5" transform="rotate(-20 10 13)"/>
            <circle cx="0" cy="2" r="14"/>
          </g>
        </g></g>
      </g>
      <g id="armR" data-part="handR">
        <g class="armline">
          <path d="M240 252 Q260 292 270 326" stroke="#aebfd6" stroke-width="19" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <path d="M240 252 Q260 292 270 326" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </g>
        <g class="reach"><g transform="translate(276 342) rotate(-18)">
          <g fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2">
            <ellipse cx="16" cy="-2" rx="5.5" ry="9.5" transform="rotate(-50 16 -2)"/>
            <ellipse cx="8" cy="14" rx="5.5" ry="9.5" transform="rotate(-20 8 14)"/>
            <ellipse cx="-1" cy="17" rx="5.5" ry="10"/>
            <ellipse cx="-10" cy="13" rx="5.5" ry="9.5" transform="rotate(20 -10 13)"/>
            <circle cx="0" cy="2" r="14"/>
          </g>
          <ellipse cx="0" cy="-13" rx="14" ry="6" fill="#7fd8d4" stroke="#3ea7a2" stroke-width="2.5"/>
          <ellipse cx="-5" cy="-15" rx="5" ry="1.8" fill="#fff" opacity=".55"/>
        </g></g>
      </g>
      <!-- mangas abullonadas con puño -->
      <g data-part="tummy" class="orig-top">
        <path d="M140 262 Q138 234 164 232 Q186 234 184 258 Q182 280 160 282 Q142 280 140 262 Z" fill="#9d95dc" stroke="#6b63b5" stroke-width="2.5"/>
        <path d="M143 272 Q160 286 180 272" stroke="#6b63b5" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M150 244 Q160 250 170 244" stroke="#6b63b5" stroke-width="1.8" fill="none" opacity=".5"/>
        <path d="M260 262 Q262 234 236 232 Q214 234 216 258 Q218 280 240 282 Q258 280 260 262 Z" fill="#9d95dc" stroke="#6b63b5" stroke-width="2.5"/>
        <path d="M257 272 Q240 286 220 272" stroke="#6b63b5" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M250 244 Q240 250 230 244" stroke="#6b63b5" stroke-width="1.8" fill="none" opacity=".5"/>
      </g>
    </g></g>
`
});
