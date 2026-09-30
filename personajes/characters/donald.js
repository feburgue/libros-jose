// Pato Donald
CHARACTER({
  id: "donald", name: "Donald", emoji: "🦆", female: false,
  // Voz de ElevenLabs por defecto (se puede cambiar en Ajustes de voz)
  voiceId: "NyN6nrH7ausSBWuLonyY",
  looks: [],
  // Color de la camisa y el gorro
  colors: { m: "#2f5fb3", md: "#1d3c7c" },
  // Colores y recorte de la cara para el avatar del selector
  thumbCss: ".mfill{fill:#2f5fb3}.mstroke{stroke:#1d3c7c}",
  thumbBox: "82 18 236 236",
  // Hombros y manos en reposo; mangas que se estiran un poco al levantar los brazos
  shoulders: [[160, 252], [240, 252]],
  hands: [[124, 342], [276, 342]],
  raiseScale: 1.35, kissAngle: 167, kissScale: 0.72, peekaboo: [168, 1.37], waveAngle: 118,
  // Canta con voz "de pato"
  singWave: "sawtooth",
  // Altura del almohadón al sentarse
  seatY: 488,
  // Dónde van las prendas del armario (wardrobe.js): cinta del gorro, centro de los lentes,
  // cuello y cintura de la camisa, cintura y ruedo del pantalón, y [x, y, ancho] de cada zapato
  fit: {
    hat: { y: 98, w: 166 }, glasses: { cy: 128, s: 0.5 },
    top: { neck: 226, waist: 352, w: 154 }, sleeve: 1.3,
    bottom: { waist: 346, hem: 428, w: 152 },
    shoes: [[142, 490, 110], [258, 490, 110]]
  },
  // Pico: la parte de abajo ("jaw") baja al hablar y deja ver la boca
  // (coordenadas del pico antes de achicarlo: ver el grupo "billScale")
  mouth: {
    path: o => { const j = o * 26; return `M114 246 C150 266 250 266 286 246 L270 ${250 + j} C250 ${262 + j} 150 ${262 + j} 130 ${250 + j} Z`; },
    tongue: o => 262 + o * 20,
    jaw: 26
  },
  // Partes elásticas: centro (cx, cy), radio, punto de unión (base) y cuánto se estiran (max)
  parts: {
    cheekL: { kind: "cheek", cx: 142, cy: 190, r: 22, base: [165, 182], max: 100, blob: "cheekL", neck: "cheekLneck" },
    cheekR: { kind: "cheek", cx: 258, cy: 190, r: 22, base: [235, 182], max: 100, blob: "cheekR", neck: "cheekRneck" },
    nose:   { kind: "nose", cx: 200, cy: 190, r: 34, base: [200, 178], max: 120, blob: "nose", neck: "noseNeck", w0: 20 },
    footL:  { kind: "foot", cx: 144, cy: 494, hip: [180, 428], ankle: [170, 478], max: 110, blob: "footL", line: "legLline" },
    footR:  { kind: "foot", cx: 256, cy: 494, hip: [220, 428], ankle: [230, 478], max: 110, blob: "footR", line: "legRline" }
  },
  // Lo que dice al jugar con cada parte
  reactions: {
    cheek: ["¡Ay, mis cachetes!", "¡Oh, oh! ¡Soltame los cachetes!", "¡Jua, jua! ¡Qué cosquillas!"],
    nose:  ["¡Mi pico!", "¡Cuac, cuac!", "¡Ey, ey, cuidado con mi pico!"],
    foot:  ["¡Mis patitas!", "¡Cosquillas no, cosquillas no!", "¡A bailar!"],
    pet:   ["¡Oh, qué lindo mimo, {nombre}!", "¡Gracias, {nombre}! ¡Sos la mejor!"],
    tummy: ["¡Jua, jua, jua! ¡Cosquillas!", "¡Basta, basta, me hacés reír!"],
    bow:   ["¡Mi gorro de marinero!", "¡Ey, cuidado con mi gorro!"],
    hand:  ["¡Choca esas plumas, {nombre}!", "¡Bien ahí, campeona!"],
    head:  ["¡Hola, {nombre}! ¡Soy yo, el pato Donald!", "¡Cuac! ¡Qué alegría verte!", "¿Jugamos, {nombre}?", "¡Oh, oh, qué divertido!"]
  },
  svg: `
    <defs>
      <clipPath id="mouthClip"><path id="mouthClipPath" d="M114 246 Z"/></clipPath>
      <!-- plumas blancas con sombra celeste, como en el dibujo original -->
      <radialGradient id="featherShade" cx="42%" cy="32%" r="75%">
        <stop offset="55%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#cfdcee"/>
      </radialGradient>
      <radialGradient id="eyeShade" cx="45%" cy="35%" r="70%">
        <stop offset="50%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#c9dcf2"/>
      </radialGradient>
      <radialGradient id="clothShade" cx="42%" cy="28%" r="80%">
        <stop offset="50%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".28"/>
      </radialGradient>
      <linearGradient id="billShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffc24a"/>
        <stop offset="100%" stop-color="#f39a1e"/>
      </linearGradient>
      <linearGradient id="footShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffbf55"/>
        <stop offset="100%" stop-color="#f0921c"/>
      </linearGradient>
    </defs>

    <g id="all"><g id="sway">
      <!-- cola de plumas -->
      <path id="tail" d="M252 392 Q292 380 300 340 Q306 360 318 350 Q314 372 326 372 Q306 402 262 414 Z" fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- patas gruesas y pies grandes, planos y lisos -->
      <g id="legL">
        <path id="legLline" d="M180 428 L170 478" stroke="#e98d1c" stroke-width="19" stroke-linecap="round"/>
        <g id="footL" data-part="footL" class="grab">
          <g class="orig-shoes">
          <path d="M88 500 Q86 480 118 476 L172 472 Q196 472 197 489 Q198 507 176 509 L108 511 Q88 511 88 500 Z" fill="url(#footShade)" stroke="#c46a10" stroke-width="2.5" stroke-linejoin="round"/>
          <ellipse cx="126" cy="484" rx="20" ry="4.5" fill="#fff" opacity=".35"/>
          </g>
        </g>
      </g>
      <g id="legR">
        <path id="legRline" d="M220 428 L230 478" stroke="#e98d1c" stroke-width="19" stroke-linecap="round"/>
        <g id="footR" data-part="footR" class="grab">
          <g class="orig-shoes">
          <path d="M312 500 Q314 480 282 476 L228 472 Q204 472 203 489 Q202 507 224 509 L292 511 Q312 511 312 500 Z" fill="url(#footShade)" stroke="#c46a10" stroke-width="2.5" stroke-linejoin="round"/>
          <ellipse cx="274" cy="484" rx="20" ry="4.5" fill="#fff" opacity=".35"/>
          </g>
        </g>
      </g>

      <!-- cuerpo rellenito en forma de pera -->
      <path data-part="tummy" d="M168 226 C134 252 114 312 116 362 C118 414 156 444 200 444 C244 444 282 414 284 362 C286 312 266 252 232 226 Z" fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2.5"/>
      <!-- camisa de marinero larga con cuello ribeteado en amarillo -->
      <g data-part="tummy" class="orig-top">
        <path d="M168 228 L232 228 C260 256 276 302 278 352 C250 372 150 372 122 352 C124 302 140 256 168 228 Z" class="mfill mstroke" stroke-width="3" stroke-linejoin="round"/>
        <path d="M168 228 L232 228 C260 256 276 302 278 352 C250 372 150 372 122 352 C124 302 140 256 168 228 Z" fill="url(#clothShade)"/>
        <path d="M178 229 L200 270 L222 229 Z" fill="url(#featherShade)"/>
        <path d="M166 232 Q186 262 200 280 Q214 262 234 232" stroke="#f2c230" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M166 232 Q186 262 200 280 Q214 262 234 232" stroke="#b88a10" stroke-width="1.2" fill="none" opacity=".6"/>
        <!-- moño rojo grande -->
        <path d="M200 266 C188 248 164 250 166 268 C166 288 190 288 200 272 Z" fill="#d9262c" stroke="#8f1418" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M200 266 C212 248 236 250 234 268 C234 288 210 288 200 272 Z" fill="#d9262c" stroke="#8f1418" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M186 262 Q180 268 184 276 M214 262 Q220 268 216 276" stroke="#8f1418" stroke-width="1.8" fill="none" opacity=".7"/>
        <ellipse cx="200" cy="269" rx="8" ry="9" fill="#e8363c" stroke="#8f1418" stroke-width="2.5"/>
      </g>

      <g id="head" data-part="head">
        <!-- mechón de plumas atrás -->
        <path d="M128 110 Q110 100 116 84 Q122 98 134 98 Q124 84 132 72 Q136 90 148 92 Z" fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2" stroke-linejoin="round"/>
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

        <!-- ojos grandes y juntos, con tono celeste -->
        <g id="eyes">
          <ellipse cx="183" cy="124" rx="18.5" ry="32" fill="url(#eyeShade)" stroke="#1d2a44" stroke-width="2.5"/>
          <ellipse cx="217" cy="124" rx="18.5" ry="32" fill="url(#eyeShade)" stroke="#1d2a44" stroke-width="2.5"/>
          <g id="pupils">
            <ellipse cx="189" cy="134" rx="8" ry="14" fill="#111"/>
            <ellipse cx="211" cy="134" rx="8" ry="14" fill="#111"/>
            <ellipse cx="191" cy="128" rx="2.8" ry="4" fill="#fff"/>
            <ellipse cx="213" cy="128" rx="2.8" ry="4" fill="#fff"/>
          </g>
        </g>
        <g id="happyEyes" stroke="#111" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M166 130 Q183 110 200 130"/>
          <path d="M200 130 Q217 110 234 130"/>
        </g>

        <!-- pico largo y ancho con las puntas hacia arriba; la parte de abajo (jaw) baja al hablar -->
        <g data-part="nose" class="grab">
          <path id="noseNeck" fill="none" stroke="#f7a21b" stroke-linecap="round"/>
          <g id="nose">
            <g id="billScale" transform="translate(200 184) scale(.8) translate(-200 -228)">
              <path id="mouthOpen" d="M114 246 Z" fill="#5a0a14"/>
              <ellipse id="tongue" cx="200" cy="262" rx="30" ry="11" fill="#ff7f95" clip-path="url(#mouthClip)"/>
              <g id="jaw">
                <path d="M128 250 C150 262 250 262 272 250 C268 280 240 296 200 296 C160 296 132 280 128 250 Z" fill="#f59f22" stroke="#c46a10" stroke-width="3" stroke-linejoin="round"/>
              </g>
              <path d="M184 186 Q200 180 216 186 C236 198 262 212 284 224 Q302 234 292 248 C282 264 244 268 200 268 C156 268 118 264 108 248 Q98 234 116 224 C138 212 164 198 184 186 Z" fill="url(#billShade)" stroke="#c46a10" stroke-width="3" stroke-linejoin="round"/>
              <path d="M190 200 Q192 204 190 208 M210 200 Q208 204 210 208" stroke="#a85a08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path d="M110 246 Q100 236 108 224 M290 246 Q300 236 292 224" stroke="#c46a10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <ellipse cx="164" cy="222" rx="26" ry="6" fill="#fff" opacity=".4" transform="rotate(-12 164 222)"/>
            </g>
          </g>
        </g>

        <!-- boina de marinero blanda, ladeada, con cinta negra enrulada atrás -->
        <g id="bow" data-part="bow" class="orig-hat">
          <g transform="translate(0 -20) rotate(-9 200 80)">
            <path d="M136 100 Q106 104 100 130 Q98 150 112 160 Q106 138 120 124 Q128 114 144 110 Z" fill="#111"/>
            <path d="M126 86 Q124 42 188 34 Q258 30 278 66 Q286 86 266 94 Q200 104 140 98 Q124 96 126 86 Z" class="mfill mstroke" stroke-width="3" stroke-linejoin="round"/>
            <path d="M126 86 Q124 42 188 34 Q258 30 278 66 Q286 86 266 94 Q200 104 140 98 Q124 96 126 86 Z" fill="url(#clothShade)"/>
            <path d="M150 60 Q196 44 246 52" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".18"/>
            <path d="M134 94 Q200 108 268 92 L266 108 Q200 122 136 108 Z" fill="#1b2f5e" stroke="#111a33" stroke-width="2"/>
          </g>
        </g>
      </g>

      <!-- brazos: mangas azules largas con puño amarillo y manos blancas -->
      <g id="armL" data-part="handL">
        <g class="armline">
          <path d="M160 252 Q138 292 128 326" class="mstroke orig-sleeve-outline" stroke-width="27" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <path d="M160 252 Q138 292 128 326" class="orig-sleeve" style="stroke:var(--m,#2f5fb3)" stroke-width="21" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </g>
        <g class="reach"><g transform="translate(124 342) rotate(18)">
          <ellipse class="orig-top" cx="0" cy="-14" rx="14" ry="6.5" fill="#f2c230" stroke="#b88a10" stroke-width="2"/>
          <g fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2">
            <ellipse cx="-17" cy="-2" rx="6" ry="10" transform="rotate(50 -17 -2)"/>
            <ellipse cx="-8" cy="15" rx="6" ry="10" transform="rotate(20 -8 15)"/>
            <ellipse cx="1" cy="18" rx="6" ry="10.5"/>
            <ellipse cx="10" cy="14" rx="6" ry="10" transform="rotate(-20 10 14)"/>
            <circle cx="0" cy="2" r="15"/>
          </g>
        </g></g>
      </g>
      <g id="armR" data-part="handR">
        <g class="armline">
          <path d="M240 252 Q262 292 272 326" class="mstroke orig-sleeve-outline" stroke-width="27" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <path d="M240 252 Q262 292 272 326" class="orig-sleeve" style="stroke:var(--m,#2f5fb3)" stroke-width="21" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </g>
        <g class="reach"><g transform="translate(276 342) rotate(-18)">
          <ellipse class="orig-top" cx="0" cy="-14" rx="14" ry="6.5" fill="#f2c230" stroke="#b88a10" stroke-width="2"/>
          <g fill="url(#featherShade)" stroke="#aebfd6" stroke-width="2">
            <ellipse cx="17" cy="-2" rx="6" ry="10" transform="rotate(-50 17 -2)"/>
            <ellipse cx="8" cy="15" rx="6" ry="10" transform="rotate(-20 8 15)"/>
            <ellipse cx="-1" cy="18" rx="6" ry="10.5"/>
            <ellipse cx="-10" cy="14" rx="6" ry="10" transform="rotate(20 -10 14)"/>
            <circle cx="0" cy="2" r="15"/>
          </g>
        </g></g>
      </g>
    </g></g>
`
});
