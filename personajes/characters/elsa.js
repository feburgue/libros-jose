// Elsa (de Frozen), en versión muñequita: cabeza redonda y el pelo como una "máscara" encima
CHARACTER({
  id: "elsa", name: "Elsa", emoji: "❄️", female: true,
  // Sin voz de ElevenLabs fija: usa la de la cuenta que tenga "Elsa" en el nombre, o la del navegador
  voiceId: "",
  // Voz del navegador: de mujer, tono apenas agudo y tranquila
  browser: { pitch: 1.2, rate: 0.95, female: true },
  looks: [],
  // Color del vestido
  colors: { m: "#5fcfdc", md: "#2b9fb0" },
  // Colores y recorte de la cara para el avatar del selector
  thumbCss: ".mfill{fill:#5fcfdc}.mstroke{stroke:#2b9fb0}",
  thumbBox: "86 36 228 228",
  // Hombros y manos en reposo
  shoulders: [[168, 276], [232, 276]],
  hands: [[130, 366], [270, 366]],
  raiseScale: 1.4, kissAngle: 166, kissScale: 0.72, peekaboo: [162, 1.38], waveAngle: 118,
  // Altura del almohadón al sentarse
  seatY: 470,
  // Dónde van las prendas del armario (wardrobe.js): cinta del gorro, centro de los lentes,
  // cuello y cintura de la camisa, cintura y ruedo del pantalón, y [x, y, ancho] de cada zapato
  fit: {
    hat: { y: 78, w: 176 }, glasses: { cy: 170, s: 0.52 },
    top: { neck: 262, waist: 330, w: 84 }, sleeve: 0.95,
    bottom: { waist: 326, hem: 424, w: 92 },
    shoes: [[176, 500, 70], [224, 500, 70]]
  },
  // Boca chiquita con labios rosados
  mouth: {
    path: o => `M180 214 Q200 228 220 214 Q200 ${(228 + o * 22).toFixed(1)} 180 214 Z`,
    tongue: o => 226 + o * 8
  },
  // Partes elásticas: centro (cx, cy), radio, punto de unión (base) y cuánto se estiran (max)
  parts: {
    braid: { kind: "braid", cx: 298, cy: 368, r: 26, base: [290, 316], max: 130, blob: "braidTip", neck: "braidNeck", w0: 14 },
    footL: { kind: "foot", cx: 176, cy: 504, hip: [186, 420], ankle: [180, 492], max: 100, blob: "footL", line: "legLline" },
    footR: { kind: "foot", cx: 224, cy: 504, hip: [214, 420], ankle: [220, 492], max: 100, blob: "footR", line: "legRline" }
  },
  // Lo que dice al jugar con cada parte
  reactions: {
    braid: ["¡Ay, mi trenza!", "¡Jiji! ¡Qué trenza tan larga!", "¡Cuidado con mi trenza, {nombre}!"],
    foot:  ["¡Mis botitas de hielo!", "¡Jiji, cosquillas en los pies!", "¡A patinar!"],
    pet:   ["¡Qué lindo mimo, {nombre}!", "¡Gracias, amiga!", "¡Te quiero mucho, {nombre}!"],
    tummy: ["¡Jajaja! ¡Cosquillas no!", "¡Jiji, me hacés reír!", "¡Jajaja, basta, basta!"],
    hand:  ["¡Choca esos cinco, {nombre}!", "¡Bien ahí, campeona!"],
    head:  ["¡Hola, {nombre}! ¡Soy Elsa!", "¡Qué alegría verte, {nombre}!", "¿Hacemos un muñeco de nieve?", "¡Qué lindo día para jugar en la nieve!", "¡Brrr, qué frío! ¡Me encanta!"]
  },
  svg: `
    <defs>
      <radialGradient id="skinShade" cx="45%" cy="38%" r="70%">
        <stop offset="60%" stop-color="#fde3d3"/>
        <stop offset="100%" stop-color="#f3c6b0"/>
      </radialGradient>
      <linearGradient id="hairShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f9e7a8"/>
        <stop offset="100%" stop-color="#e3c16c"/>
      </linearGradient>
      <radialGradient id="irisShade" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#9fd2f5"/>
        <stop offset="100%" stop-color="#2f6fb5"/>
      </radialGradient>
      <radialGradient id="clothShade" cx="42%" cy="28%" r="80%">
        <stop offset="50%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".18"/>
      </radialGradient>
      <linearGradient id="bootShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#cdeff4"/>
        <stop offset="100%" stop-color="#7cc9d6"/>
      </linearGradient>
      <!-- copo de nieve para estampar en el vestido y la capa -->
      <g id="flake" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none">
        <path d="M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5"/>
        <path d="M-2 -5 L0 -3 L2 -5 M-2 5 L0 3 L2 5"/>
      </g>
      <clipPath id="mouthClip"><path id="mouthClipPath" d="M180 214 Q200 228 220 214 Q200 228 180 214 Z"/></clipPath>
    </defs>

    <g id="all"><g id="sway">
      <!-- capa transparente por detrás -->
      <path d="M166 262 Q118 380 96 500 Q200 520 304 500 Q282 380 234 262 Z" fill="#e6f8fb" opacity=".55" stroke="#bfe6ee" stroke-width="2"/>

      <!-- piernas (tapadas por el vestido) y botitas celestes -->
      <g id="legL">
        <path id="legLline" d="M186 420 L180 492" stroke="#f6d3c2" stroke-width="12" stroke-linecap="round"/>
        <g id="footL" data-part="footL" class="grab">
          <g class="orig-shoes">
          <ellipse cx="174" cy="504" rx="24" ry="11" fill="url(#bootShade)" stroke="#4fa6b6" stroke-width="2.5"/>
          <ellipse cx="166" cy="500" rx="8" ry="3" fill="#fff" opacity=".6"/>
          </g>
        </g>
      </g>
      <g id="legR">
        <path id="legRline" d="M214 420 L220 492" stroke="#f6d3c2" stroke-width="12" stroke-linecap="round"/>
        <g id="footR" data-part="footR" class="grab">
          <g class="orig-shoes">
          <ellipse cx="226" cy="504" rx="24" ry="11" fill="url(#bootShade)" stroke="#4fa6b6" stroke-width="2.5"/>
          <ellipse cx="234" cy="500" rx="8" ry="3" fill="#fff" opacity=".6"/>
          </g>
        </g>
      </g>

      <!-- falda larga turquesa con copos -->
      <g id="skirt" data-part="tummy" class="orig-bottom">
        <path d="M164 324 L236 324 Q272 410 286 496 Q200 512 114 496 Q128 410 164 324 Z" class="mfill mstroke" stroke-width="3" stroke-linejoin="round"/>
        <path d="M164 324 L236 324 Q272 410 286 496 Q200 512 114 496 Q128 410 164 324 Z" fill="url(#clothShade)"/>
        <use href="#flake" x="210" y="380"/><use href="#flake" x="244" y="420"/><use href="#flake" x="214" y="456"/>
        <use href="#flake" x="258" y="474"/><use href="#flake" x="180" y="482"/><use href="#flake" x="236" y="352"/>
      </g>
      <!-- cuerpo del vestido con escote en V -->
      <g data-part="tummy" class="orig-top">
        <path d="M168 262 L232 262 Q244 296 238 330 Q200 340 162 330 Q156 296 168 262 Z" class="mfill mstroke" stroke-width="3" stroke-linejoin="round"/>
        <path d="M168 262 L232 262 Q244 296 238 330 Q200 340 162 330 Q156 296 168 262 Z" fill="url(#clothShade)"/>
        <path d="M178 262 L200 290 L222 262 Z" fill="url(#skinShade)"/>
        <path d="M178 262 L200 290 L222 262" class="mstroke" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
        <path d="M186 302 L214 302 M184 314 L216 314" stroke="#fff" stroke-width="1.5" opacity=".4"/>
      </g>
      <!-- capa por delante: paneles blancos a los costados, como en la muñeca -->
      <g data-part="tummy">
        <path d="M168 264 Q142 380 120 498 L150 502 Q156 400 176 300 Z" fill="#f4fcfd" opacity=".85" stroke="#bfe6ee" stroke-width="2" stroke-linejoin="round"/>
        <path d="M232 264 Q258 380 280 498 L250 502 Q244 400 224 300 Z" fill="#f4fcfd" opacity=".85" stroke="#bfe6ee" stroke-width="2" stroke-linejoin="round"/>
        <g transform="translate(0 0)"><use href="#flake" x="152" y="360" style="stroke:#7fd3df"/><use href="#flake" x="140" y="440" style="stroke:#7fd3df"/>
        <use href="#flake" x="250" y="380" style="stroke:#7fd3df"/><use href="#flake" x="264" y="460" style="stroke:#7fd3df"/></g>
      </g>

      <g id="head" data-part="head">
        <!-- cuello -->
        <path d="M188 236 L188 266 Q200 272 212 266 L212 236 Z" fill="#f6d3c2"/>
        <!-- pelo de atrás -->
        <ellipse cx="200" cy="146" rx="102" ry="98" fill="url(#hairShade)"/>
        <!-- cara redonda -->
        <circle cx="200" cy="160" r="88" fill="url(#skinShade)"/>
        <!-- pelo de adelante: peinado hacia atrás, con la frente despejada -->
        <path d="M108 178 C98 96 156 46 212 48 C270 50 304 100 292 176 C284 128 258 100 222 94 C190 90 168 100 150 116 C132 132 118 152 108 178 Z" fill="url(#hairShade)" stroke="#c9a24c" stroke-width="2" stroke-linejoin="round"/>
        <path d="M150 116 C170 76 230 62 270 96 M164 104 C190 80 236 76 262 104 M126 140 C134 104 160 80 196 70" stroke="#c9a24c" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>

        <!-- trenza sobre el hombro: la punta es elástica -->
        <g fill="url(#hairShade)" stroke="#c9a24c" stroke-width="2">
          <ellipse cx="262" cy="214" rx="20" ry="16" transform="rotate(30 262 214)"/>
          <ellipse cx="274" cy="242" rx="20" ry="16" transform="rotate(-30 274 242)"/>
          <ellipse cx="282" cy="270" rx="19" ry="16" transform="rotate(30 282 270)"/>
          <ellipse cx="288" cy="298" rx="19" ry="15" transform="rotate(-30 288 298)"/>
        </g>
        <g data-part="braid" class="grab">
          <path id="braidNeck" fill="none" stroke="#efd488" stroke-linecap="round"/>
          <g id="braidTip" fill="url(#hairShade)" stroke="#c9a24c" stroke-width="2">
            <ellipse cx="292" cy="324" rx="18" ry="15" transform="rotate(30 292 324)"/>
            <ellipse cx="295" cy="348" rx="17" ry="14" transform="rotate(-30 295 348)"/>
            <rect x="287" y="362" width="16" height="7" rx="3" fill="#8fd6e2" stroke="#4fa6b6"/>
            <path d="M286 368 Q280 392 290 408 Q296 396 298 410 Q304 396 310 404 Q314 386 304 368 Z"/>
          </g>
        </g>

        <!-- cejas finas -->
        <path d="M144 128 Q162 116 182 124" stroke="#c99a5a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M218 124 Q238 116 256 128" stroke="#c99a5a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- cachetes -->
        <ellipse class="cheek" cx="146" cy="204" rx="14" ry="9" fill="#ff8fab" opacity=".3"/>
        <ellipse class="cheek" cx="254" cy="204" rx="14" ry="9" fill="#ff8fab" opacity=".3"/>

        <!-- ojos grandes celestes, con pestañas -->
        <g id="eyes">
          <ellipse cx="164" cy="166" rx="25" ry="28" fill="#fff" stroke="#3a2a2a" stroke-width="2"/>
          <ellipse cx="236" cy="166" rx="25" ry="28" fill="#fff" stroke="#3a2a2a" stroke-width="2"/>
          <g id="pupils">
            <circle cx="166" cy="170" r="20" fill="url(#irisShade)"/>
            <circle cx="234" cy="170" r="20" fill="url(#irisShade)"/>
            <circle cx="166" cy="171" r="9" fill="#1b2a44"/>
            <circle cx="234" cy="171" r="9" fill="#1b2a44"/>
            <circle cx="172" cy="162" r="5.5" fill="#fff"/>
            <circle cx="240" cy="162" r="5.5" fill="#fff"/>
            <circle cx="160" cy="178" r="2.5" fill="#fff" opacity=".8"/>
            <circle cx="228" cy="178" r="2.5" fill="#fff" opacity=".8"/>
          </g>
          <!-- párpado de arriba con una pestaña hacia afuera -->
          <path d="M139 164 Q150 136 176 140 Q186 142 190 152" stroke="#2a1d1d" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M261 164 Q250 136 224 140 Q214 142 210 152" stroke="#2a1d1d" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M141 156 Q134 150 128 150" stroke="#2a1d1d" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M259 156 Q266 150 272 150" stroke="#2a1d1d" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        </g>
        <g id="happyEyes" stroke="#2a1d1d" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M142 172 Q164 148 186 172"/>
          <path d="M214 172 Q236 148 258 172"/>
        </g>

        <!-- naricita -->
        <path d="M197 196 Q201 201 205 196" stroke="#e0a58c" stroke-width="2.5" fill="none" stroke-linecap="round"/>

        <!-- boca -->
        <path id="mouthOpen" d="M180 214 Q200 228 220 214 Q200 228 180 214 Z" fill="#8a2a3a" stroke="#d9707f" stroke-width="2.5" stroke-linejoin="round"/>
        <ellipse id="tongue" cx="200" cy="226" rx="9" ry="5" fill="#ff8fa3" clip-path="url(#mouthClip)"/>
        <path d="M180 214 Q200 228 220 214" stroke="#d9707f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      </g>

      <!-- brazos: mangas transparentes y manos -->
      <g id="armL" data-part="handL">
        <g class="armline">
          <path d="M168 276 Q146 314 134 352" class="orig-sleeve-outline" style="stroke:#ead0c3" stroke-width="22" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <path d="M168 276 Q146 314 134 352" class="orig-sleeve" style="stroke:#fbe9e1" stroke-width="17" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </g>
        <g class="reach"><g transform="translate(130 366) rotate(18)">
          <ellipse cx="0" cy="-10" rx="10" ry="4" fill="#fff" stroke="#bfe6ee" stroke-width="1.5"/>
          <ellipse cx="-11" cy="2" rx="5" ry="8" fill="url(#skinShade)" stroke="#e8b8a2" stroke-width="1.5" transform="rotate(40 -11 2)"/>
          <ellipse cx="0" cy="4" rx="11" ry="13" fill="url(#skinShade)" stroke="#e8b8a2" stroke-width="1.5"/>
        </g></g>
      </g>
      <g id="armR" data-part="handR">
        <g class="armline">
          <path d="M232 276 Q254 314 266 352" class="orig-sleeve-outline" style="stroke:#ead0c3" stroke-width="22" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <path d="M232 276 Q254 314 266 352" class="orig-sleeve" style="stroke:#fbe9e1" stroke-width="17" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </g>
        <g class="reach"><g transform="translate(270 366) rotate(-18)">
          <ellipse cx="0" cy="-10" rx="10" ry="4" fill="#fff" stroke="#bfe6ee" stroke-width="1.5"/>
          <ellipse cx="11" cy="2" rx="5" ry="8" fill="url(#skinShade)" stroke="#e8b8a2" stroke-width="1.5" transform="rotate(-40 11 2)"/>
          <ellipse cx="0" cy="4" rx="11" ry="13" fill="url(#skinShade)" stroke="#e8b8a2" stroke-width="1.5"/>
        </g></g>
      </g>
    </g></g>
`
});
