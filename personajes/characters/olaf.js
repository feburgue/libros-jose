// Olaf (de Frozen): tres bolas de nieve, ramitas en la cabeza y nariz de zanahoria
CHARACTER({
  id: "olaf", name: "Olaf", emoji: "⛄", female: false,
  // Sin voz de ElevenLabs fija: usa la de la cuenta que tenga "Olaf" en el nombre, o la del navegador
  voiceId: "",
  // Voz del navegador: alegre y un poco aguda
  browser: { pitch: 1.35, rate: 1.05 },
  // Cómo canta: canción, ritmo, timbre, vocal con que tararea, altura y vibrato [velocidad, cuánto]
  sing: { song: "baile", beat: .34, wave: "sine", vowel: "o", pitch: .9, vib: [5, .02] },
  looks: [],
  // Color de la bufanda
  colors: { m: "#3f7fd0", md: "#2a5a9e" },
  // Colores y recorte de la cara para el avatar del selector
  thumbCss: ".mfill{fill:#3f7fd0}.mstroke{stroke:#2a5a9e}",
  thumbBox: "80 20 240 240",
  // Hombros y manos en reposo: brazos de ramita, abiertos hacia abajo
  shoulders: [[142, 300], [258, 300]],
  hands: [[90, 352], [310, 352]],
  raiseScale: 1.15, kissAngle: 160, kissScale: 0.8, peekaboo: [150, 1.3], waveAngle: 115,
  // Altura del almohadón al sentarse
  seatY: 528,
  // Dónde van las prendas del armario (wardrobe.js): cinta del gorro, centro de los lentes,
  // cuello y cintura de la camisa, cintura y ruedo del pantalón, y [x, y, ancho] de cada zapato
  fit: {
    hat: { y: 96, w: 150 }, glasses: { cy: 160, s: 0.5 },
    top: { neck: 268, waist: 372, w: 136 }, sleeve: 0.9,
    bottom: { waist: 372, hem: 478, w: 196 },
    shoes: [[152, 508, 82], [248, 508, 82]]
  },
  // Sonrisa enorme debajo de la zanahoria; el diente queda colgando del labio de arriba
  mouth: {
    path: o => `M146 214 Q200 250 254 214 Q200 ${(250 + o * 40).toFixed(1)} 146 214 Z`,
    tongue: o => 240 + o * 14
  },
  // Partes elásticas: centro (cx, cy), radio, punto de unión (base) y cuánto se estiran (max)
  parts: {
    nose:  { kind: "nose", cx: 226, cy: 192, r: 16, base: [204, 192], max: 120, blob: "nose", neck: "noseNeck", w0: 9 },
    footL: { kind: "foot", cx: 152, cy: 508, hip: [170, 480], ankle: [158, 500], max: 100, blob: "footL", line: "legLline" },
    footR: { kind: "foot", cx: 248, cy: 508, hip: [230, 480], ankle: [242, 500], max: 100, blob: "footR", line: "legRline" }
  },
  // Lo que dice al jugar con cada parte
  reactions: {
    nose:  ["¡Mi nariz de zanahoria!", "¡Jaja, cuidado con mi zanahoria!", "¡Ay, que se me sale la nariz!"],
    foot:  ["¡Mis piecitos de nieve!", "¡Jiji, cosquillas!", "¡A bailar en la nieve!"],
    pet:   ["¡Me encantan los abrazos calentitos, {nombre}!", "¡Gracias, amiga!", "¡Qué lindo mimo!"],
    tummy: ["¡Jajaja! ¡Cosquillas en la panza de nieve!", "¡Jiji, me hacés reír!", "¡Jaja, basta, basta!"],
    bow:   ["¡Mi pelito de ramitas!", "¡Uy, cuidado con mis ramitas!"],
    hand:  ["¡Choca esos cinco, {nombre}!", "¡Bien ahí, campeona!"],
    head:  ["¡Hola, {nombre}! ¡Soy Olaf, y me encantan los abrazos calentitos!", "¡Qué lindo día!", "¿Jugamos en la nieve, {nombre}?", "¡Jiji, qué divertido!", "¡Hola, amiga!"]
  },
  svg: `
    <defs>
      <radialGradient id="nieve" cx="40%" cy="32%" r="75%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="70%" stop-color="#f2f6fb"/>
        <stop offset="100%" stop-color="#d5e1ee"/>
      </radialGradient>
      <linearGradient id="zanahoria" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ff9a3c"/>
        <stop offset="100%" stop-color="#f06c12"/>
      </linearGradient>
      <radialGradient id="carbon" cx="38%" cy="32%" r="70%">
        <stop offset="0%" stop-color="#5a4a42"/>
        <stop offset="100%" stop-color="#231b17"/>
      </radialGradient>
      <radialGradient id="clothShade" cx="42%" cy="28%" r="80%">
        <stop offset="50%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".22"/>
      </radialGradient>
      <clipPath id="mouthClip"><path id="mouthClipPath" d="M146 214 Q200 250 254 214 Q200 250 146 214 Z"/></clipPath>
    </defs>

    <g id="all"><g id="sway">
      <!-- piecitos de nieve -->
      <g id="legL">
        <path id="legLline" d="M170 480 L158 500" stroke="#e4ecf5" stroke-width="22" stroke-linecap="round"/>
        <g id="footL" data-part="footL" class="grab">
          <g class="orig-shoes"><ellipse cx="150" cy="508" rx="32" ry="15" fill="url(#nieve)" stroke="#b9c8d8" stroke-width="2.5"/></g>
        </g>
      </g>
      <g id="legR">
        <path id="legRline" d="M230 480 L242 500" stroke="#e4ecf5" stroke-width="22" stroke-linecap="round"/>
        <g id="footR" data-part="footR" class="grab">
          <g class="orig-shoes"><ellipse cx="250" cy="508" rx="32" ry="15" fill="url(#nieve)" stroke="#b9c8d8" stroke-width="2.5"/></g>
        </g>
      </g>

      <!-- bola grande de abajo y bola del medio, con botones de carbón -->
      <g data-part="tummy" class="orig-bottom">
        <ellipse cx="200" cy="428" rx="104" ry="78" fill="url(#nieve)" stroke="#b9c8d8" stroke-width="3"/>
        <circle cx="200" cy="410" r="10" fill="url(#carbon)"/>
      </g>
      <g data-part="tummy" class="orig-top">
        <ellipse cx="200" cy="318" rx="68" ry="56" fill="url(#nieve)" stroke="#b9c8d8" stroke-width="3"/>
        <circle cx="200" cy="304" r="9" fill="url(#carbon)"/>
        <circle cx="200" cy="342" r="9.5" fill="url(#carbon)"/>
        <!-- bufanda azul con la punta colgando -->
        <path d="M150 262 Q200 284 250 262 L252 282 Q200 304 148 282 Z" class="mfill mstroke" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M150 262 Q200 284 250 262 L252 282 Q200 304 148 282 Z" fill="url(#clothShade)"/>
        <path d="M222 282 L240 282 L248 352 L226 354 Z" class="mfill mstroke" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M226 354 L248 352 M229 354 l-1 9 M235 353 l0 9 M241 353 l1 9 M247 352 l2 9" class="mstroke" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M160 270 Q200 286 240 270" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/>
      </g>

      <g id="head" data-part="head">
        <!-- ramitas en la cabeza (al tocarlas, giran) -->
        <g id="bow" data-part="bow" class="orig-hat">
          <path d="M198 92 L190 50 M190 64 L178 52 M202 90 L206 40 M206 56 L216 46 M206 92 L224 58" stroke="#7a4b2a" stroke-width="5" fill="none" stroke-linecap="round"/>
        </g>
        <!-- cabeza alargada, más ancha abajo -->
        <path d="M200 86 C246 86 270 124 272 166 C274 210 262 252 200 262 C138 252 126 210 128 166 C130 124 154 86 200 86 Z" fill="url(#nieve)" stroke="#b9c8d8" stroke-width="3"/>

        <!-- cejas gruesas -->
        <path d="M160 132 Q176 118 192 128" stroke="#3a2a22" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M208 128 Q224 118 240 132" stroke="#3a2a22" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- ojos -->
        <g id="eyes">
          <ellipse cx="178" cy="160" rx="15" ry="18" fill="#fff" stroke="#3a2a22" stroke-width="2.5"/>
          <ellipse cx="222" cy="160" rx="15" ry="18" fill="#fff" stroke="#3a2a22" stroke-width="2.5"/>
          <g id="pupils">
            <circle cx="181" cy="164" r="8" fill="#2a1d18"/>
            <circle cx="219" cy="164" r="8" fill="#2a1d18"/>
            <circle cx="183.5" cy="160" r="2.6" fill="#fff"/>
            <circle cx="221.5" cy="160" r="2.6" fill="#fff"/>
          </g>
        </g>
        <g id="happyEyes" stroke="#2a1d18" stroke-width="5.5" stroke-linecap="round" fill="none">
          <path d="M163 166 Q178 148 193 166"/>
          <path d="M207 166 Q222 148 237 166"/>
        </g>

        <!-- boca enorme con un dientón -->
        <path id="mouthOpen" d="M146 214 Q200 250 254 214 Q200 250 146 214 Z" fill="#3a1a1a" stroke="#2a1d18" stroke-width="3" stroke-linejoin="round"/>
        <ellipse id="tongue" cx="200" cy="240" rx="24" ry="10" fill="#e8798a" clip-path="url(#mouthClip)"/>
        <path d="M146 214 Q200 250 254 214" stroke="#2a1d18" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M140 207 Q148 212 149 220 M260 207 Q252 212 251 220" stroke="#2a1d18" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M190 231 L190 247 Q197 252 204 247 L204 232.5 Z" fill="#fff" stroke="#2a1d18" stroke-width="2" stroke-linejoin="round"/>

        <!-- nariz de zanahoria, elástica -->
        <g data-part="nose" class="grab">
          <path id="noseNeck" fill="none" stroke="#f58a2c" stroke-linecap="round"/>
          <g id="nose">
            <path d="M200 182 Q232 186 252 193 Q232 199 200 203 Q194 192 200 182 Z" fill="url(#zanahoria)" stroke="#c4560d" stroke-width="2" stroke-linejoin="round"/>
            <path d="M214 187 l3 4 M226 189 l2 4 M238 191 l2 3" stroke="#c4560d" stroke-width="1.5" stroke-linecap="round"/>
          </g>
        </g>
      </g>

      <!-- brazos de ramita, con tres deditos -->
      <g id="armL" data-part="handL">
        <g class="armline"><path d="M142 300 Q116 324 96 344" stroke="#7a4b2a" stroke-width="6" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/></g>
        <g class="reach"><g transform="translate(90 352)">
          <path d="M6 -8 L-8 4 M-2 -2 L-16 -6 M-2 -2 L-10 14 M-2 -2 L-18 6" stroke="#7a4b2a" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle cx="-4" cy="0" r="16" fill="transparent"/>
        </g></g>
      </g>
      <g id="armR" data-part="handR">
        <g class="armline"><path d="M258 300 Q284 324 304 344" stroke="#7a4b2a" stroke-width="6" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/></g>
        <g class="reach"><g transform="translate(310 352)">
          <path d="M-6 -8 L8 4 M2 -2 L16 -6 M2 -2 L10 14 M2 -2 L18 6" stroke="#7a4b2a" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle cx="4" cy="0" r="16" fill="transparent"/>
        </g></g>
      </g>
    </g></g>
`
});
