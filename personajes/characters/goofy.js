// Goofy
CHARACTER({
  id: "goofy", name: "Goofy", emoji: "🐶", female: false,
  // Sin voz de ElevenLabs fija: usa la de la cuenta que tenga "Goofy" en el nombre, o la del navegador
  voiceId: "",
  looks: [],
  // Color del suéter de cuello alto
  colors: { m: "#f5821f", md: "#b85a0c" },
  // Colores y recorte de la cara para el avatar del selector
  thumbCss: ".mfill{fill:#f5821f}.mstroke{stroke:#b85a0c}",
  thumbBox: "60 0 280 280",
  // Hombros y manos en reposo; mangas que se estiran un poco al levantar los brazos
  shoulders: [[170, 274], [230, 274]],
  hands: [[128, 356], [272, 356]],
  raiseScale: 1.45, kissAngle: 170, kissScale: 0.7, peekaboo: [160, 1.4], waveAngle: 118,
  // Altura del almohadón al sentarse
  seatY: 484,
  // Dónde van las prendas del armario (wardrobe.js): cinta del gorro, centro de los lentes,
  // cuello y cintura de la camisa, cintura y ruedo del pantalón, y [x, y, ancho] de cada zapato
  fit: {
    hat: { y: 74, w: 150 }, glasses: { cy: 132, s: 0.5 },
    top: { neck: 262, waist: 358, w: 102 }, sleeve: 1.1,
    bottom: { waist: 348, hem: 450, w: 116 },
    shoes: [[146, 490, 102], [254, 490, 102]]
  },
  // Sonrisa grande debajo de la nariz; los dientes quedan colgando del labio de arriba
  mouth: {
    path: o => `M148 212 Q200 250 252 212 Q200 ${(250 + o * 44).toFixed(1)} 148 212 Z`,
    tongue: o => 238 + o * 16
  },
  // Partes elásticas: centro (cx, cy), radio, punto de unión (base) y cuánto se estiran (max)
  parts: {
    earL:  { kind: "ear",  cx: 122, cy: 188, r: 30, base: [146, 122], max: 120, blob: "earL", neck: "earLneck" },
    earR:  { kind: "ear",  cx: 278, cy: 188, r: 30, base: [254, 122], max: 120, blob: "earR", neck: "earRneck" },
    nose:  { kind: "nose", cx: 200, cy: 184, r: 22, base: [200, 184], max: 120, blob: "nose", neck: "noseNeck", w0: 13 },
    footL: { kind: "foot", cx: 146, cy: 490, hip: [184, 446], ankle: [178, 476], max: 110, blob: "footL", line: "legLline" },
    footR: { kind: "foot", cx: 254, cy: 490, hip: [216, 446], ankle: [222, 476], max: 110, blob: "footR", line: "legRline" }
  },
  // Lo que dice al jugar con cada parte
  reactions: {
    ear:   ["¡Ay, mis orejas!", "¡Jo, jo! ¡Qué orejas tan largas!", "¡Uy, mis orejitas!"],
    nose:  ["¡Ay, mi naricita!", "¡Ajúa! ¡Cosquillas en la nariz!", "¡Jo, jo, jo!"],
    foot:  ["¡Uy, mis zapatones!", "¡Jo, jo! ¡Cosquillas en los pies!", "¡A bailar!"],
    pet:   ["¡Ajúa! ¡Qué lindo mimo, {nombre}!", "¡Gracias, amiga!", "¡Jo, jo, me encanta!"],
    tummy: ["¡Jo, jo, jo! ¡Cosquillas no!", "¡Ajúa! ¡Me hacés reír!", "¡Jojo, basta, basta!"],
    bow:   ["¡Mi sombrero!", "¡Uy, cuidado con mi sombrero!"],
    hand:  ["¡Choca esos cinco, {nombre}!", "¡Ajúa! ¡Bien ahí, campeona!"],
    head:  ["¡Hola, {nombre}! ¡Soy yo, Goofy!", "¡Ajúa! ¡Qué alegría verte!", "¿Jugamos, {nombre}?", "¡Jo, jo! ¡Qué lindo día!", "¡Uy, qué divertido!"]
  },
  svg: `
    <defs>
      <radialGradient id="blackShade" cx="38%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#3a3a3a"/>
        <stop offset="55%" stop-color="#151515"/>
        <stop offset="100%" stop-color="#050505"/>
      </radialGradient>
      <radialGradient id="faceShade" cx="50%" cy="40%" r="68%">
        <stop offset="58%" stop-color="#f6cfa6"/>
        <stop offset="100%" stop-color="#e2a878"/>
      </radialGradient>
      <radialGradient id="clothShade" cx="42%" cy="28%" r="80%">
        <stop offset="50%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".26"/>
      </radialGradient>
      <linearGradient id="shoeShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#c47c40"/>
        <stop offset="100%" stop-color="#8a4f22"/>
      </linearGradient>
      <linearGradient id="hatShade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#a9d548"/>
        <stop offset="100%" stop-color="#7fae2a"/>
      </linearGradient>
      <radialGradient id="gloveShade" cx="40%" cy="35%" r="70%">
        <stop offset="65%" stop-color="#fff"/>
        <stop offset="100%" stop-color="#dfe3ea"/>
      </radialGradient>
      <clipPath id="mouthClip"><path id="mouthClipPath" d="M148 212 Q200 250 252 212 Q200 250 148 212 Z"/></clipPath>
    </defs>

    <g id="all"><g id="sway">
      <!-- piernas finas casi tapadas por el pantalón, y zapatones marrones -->
      <g id="legL">
        <path id="legLline" d="M184 446 L178 476" stroke="#111" stroke-width="10" stroke-linecap="round"/>
        <g id="footL" data-part="footL" class="grab">
          <g class="orig-shoes">
          <path d="M94 500 Q92 470 144 466 Q194 466 196 488 Q198 508 176 510 L112 510 Q94 510 94 500 Z" fill="url(#shoeShade)" stroke="#5e3412" stroke-width="2.5" stroke-linejoin="round"/>
          <ellipse cx="128" cy="478" rx="18" ry="5" fill="#fff" opacity=".35"/>
          </g>
        </g>
      </g>
      <g id="legR">
        <path id="legRline" d="M216 446 L222 476" stroke="#111" stroke-width="10" stroke-linecap="round"/>
        <g id="footR" data-part="footR" class="grab">
          <g class="orig-shoes">
          <path d="M306 500 Q308 470 256 466 Q206 466 204 488 Q202 508 224 510 L288 510 Q306 510 306 500 Z" fill="url(#shoeShade)" stroke="#5e3412" stroke-width="2.5" stroke-linejoin="round"/>
          <ellipse cx="272" cy="478" rx="18" ry="5" fill="#fff" opacity=".35"/>
          </g>
        </g>
      </g>

      <!-- pantalón celeste largo -->
      <g data-part="tummy" class="orig-bottom">
        <path d="M152 346 L248 346 Q266 396 262 450 L212 452 L200 412 L188 452 L138 450 Q134 396 152 346 Z" fill="#2a9fe0" stroke="#17699c" stroke-width="3" stroke-linejoin="round"/>
        <path d="M152 346 L248 346 Q266 396 262 450 L212 452 L200 412 L188 452 L138 450 Q134 396 152 346 Z" fill="url(#clothShade)"/>
        <path d="M160 432 Q164 410 162 380 M240 432 Q236 410 238 380" stroke="#17699c" stroke-width="2" fill="none" opacity=".5"/>
      </g>
      <!-- suéter naranja de cuello alto con chaleco negro abierto -->
      <g data-part="tummy" class="orig-top">
        <path d="M170 262 L230 262 Q252 300 250 358 L150 358 Q148 300 170 262 Z" class="mfill mstroke" stroke-width="3" stroke-linejoin="round"/>
        <path d="M170 262 L230 262 Q252 300 250 358 L150 358 Q148 300 170 262 Z" fill="url(#clothShade)"/>
        <path d="M150 348 Q200 362 250 348" class="mstroke" stroke-width="2.5" fill="none" opacity=".6"/>
        <path d="M172 266 Q154 300 152 350 L176 352 Q174 312 188 274 Z" fill="url(#blackShade)"/>
        <path d="M228 266 Q246 300 248 350 L224 352 Q226 312 212 274 Z" fill="url(#blackShade)"/>
        <path d="M168 250 Q200 262 232 250 L234 272 Q200 284 166 272 Z" class="mfill mstroke" stroke-width="3" stroke-linejoin="round"/>
        <path d="M172 262 Q200 272 228 262" class="mstroke" stroke-width="2" fill="none" opacity=".6"/>
      </g>

      <g id="head" data-part="head">
        <!-- orejas largas y caídas: "neck" une la oreja estirada con la cabeza -->
        <g data-part="earL" class="grab">
          <path id="earLneck" fill="none" stroke="#111" stroke-linecap="round"/>
          <path id="earL" d="M150 104 C122 108 98 166 98 218 C98 254 128 260 138 236 C148 206 152 152 162 118 Z" fill="url(#blackShade)"/>
        </g>
        <g data-part="earR" class="grab">
          <path id="earRneck" fill="none" stroke="#111" stroke-linecap="round"/>
          <path id="earR" d="M250 104 C278 108 302 166 302 218 C302 254 272 260 262 236 C252 206 248 152 238 118 Z" fill="url(#blackShade)"/>
        </g>
        <!-- cabeza negra, alargada -->
        <ellipse cx="200" cy="126" rx="64" ry="60" fill="url(#blackShade)"/>

        <!-- cara: hocico largo y ancho -->
        <path d="M200 98 C178 94 158 104 152 124 C146 146 138 168 138 196 C138 240 166 266 200 266 C234 266 262 240 262 196 C262 168 254 146 248 124 C242 104 222 94 200 98 Z" fill="url(#faceShade)"/>
        <ellipse cx="200" cy="210" rx="46" ry="30" fill="#fff" opacity=".12"/>
        <ellipse class="cheek" cx="152" cy="214" rx="12" ry="8" fill="#ff8fab" opacity=".15"/>
        <ellipse class="cheek" cx="248" cy="214" rx="12" ry="8" fill="#ff8fab" opacity=".15"/>

        <!-- ojos grandes con párpado negro arriba -->
        <g id="eyes">
          <ellipse cx="182" cy="132" rx="18" ry="30" fill="#fff" stroke="#111" stroke-width="2.5"/>
          <ellipse cx="218" cy="132" rx="18" ry="30" fill="#fff" stroke="#111" stroke-width="2.5"/>
          <path d="M165 120 Q182 92 199 120" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M201 120 Q218 92 235 120" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>
          <g id="pupils">
            <ellipse cx="187" cy="142" rx="8" ry="12" fill="#111"/>
            <ellipse cx="213" cy="142" rx="8" ry="12" fill="#111"/>
            <ellipse cx="189" cy="137" rx="2.6" ry="3.6" fill="#fff"/>
            <ellipse cx="215" cy="137" rx="2.6" ry="3.6" fill="#fff"/>
          </g>
        </g>
        <g id="happyEyes" stroke="#111" stroke-width="5.5" stroke-linecap="round" fill="none">
          <path d="M166 140 Q182 120 198 140"/>
          <path d="M202 140 Q218 120 234 140"/>
        </g>

        <!-- boca -->
        <path id="mouthOpen" d="M148 212 Q200 250 252 212 Q200 250 148 212 Z" fill="#5a0a14" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
        <ellipse id="tongue" cx="200" cy="238" rx="22" ry="10" fill="#ff6f8a" clip-path="url(#mouthClip)"/>
        <path d="M148 212 Q200 250 252 212" stroke="#111" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M142 205 Q150 210 151 218 M258 205 Q250 210 249 218" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- los dos dientes de Goofy -->
        <path d="M186.5 230 L186.5 245 Q192.5 249 198.5 245 L198.5 231.5 Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/>
        <path d="M201.5 231.5 L201.5 245 Q207.5 249 213.5 245 L213.5 230 Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/>

        <!-- nariz elástica, negra, en la punta del hocico -->
        <g data-part="nose" class="grab">
          <path id="noseNeck" fill="none" stroke="#e9b98e" stroke-linecap="round"/>
          <g id="nose">
            <ellipse cx="200" cy="184" rx="26" ry="17" fill="url(#blackShade)"/>
            <ellipse cx="191" cy="178" rx="8" ry="4" fill="#fff" opacity=".6"/>
          </g>
        </g>

        <!-- sombrero verde alto y arrugado, con cinta negra -->
        <g id="bow" data-part="bow" class="orig-hat">
          <g transform="rotate(-6 200 80)">
            <ellipse cx="200" cy="80" rx="68" ry="11" fill="#6f9a22" stroke="#4d6e14" stroke-width="2.5"/>
            <path d="M150 78 Q142 34 164 14 Q182 26 200 12 Q218 26 236 14 Q258 34 250 78 Z" fill="url(#hatShade)" stroke="#4d6e14" stroke-width="3" stroke-linejoin="round"/>
            <path d="M172 26 Q178 46 174 66 M222 26 Q218 46 226 66" stroke="#4d6e14" stroke-width="2" fill="none" opacity=".5"/>
            <path d="M151 64 Q200 76 249 64 L250 78 Q200 90 150 78 Z" fill="#111"/>
            <path d="M162 40 Q170 30 182 30" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".25"/>
          </g>
        </g>
      </g>

      <!-- brazos: mangas naranjas y guantes blancos -->
      <g id="armL" data-part="handL">
        <g class="armline">
          <path d="M170 274 Q146 310 132 344" class="mstroke orig-sleeve-outline" stroke-width="26" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <path d="M170 274 Q146 310 132 344" class="orig-sleeve" style="stroke:var(--m,#f5821f)" stroke-width="20" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </g>
        <g class="reach"><g transform="translate(128 356) rotate(20)">
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
        <g class="armline">
          <path d="M230 274 Q254 310 268 344" class="mstroke orig-sleeve-outline" stroke-width="26" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <path d="M230 274 Q254 310 268 344" class="orig-sleeve" style="stroke:var(--m,#f5821f)" stroke-width="20" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </g>
        <g class="reach"><g transform="translate(272 356) rotate(-20)">
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
