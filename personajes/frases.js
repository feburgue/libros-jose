// Frases rápidas de Minnie. Una por línea:   Texto del botón | Lo que dice Minnie
// Usa {nombre} donde va el nombre y {o|a} para palabras que cambian si habla Mickey o Minnie (orgullos{o|a}). Las líneas que empiezan con # se ignoran.
// Al final de una frase puedes poner una acción entre corchetes y el personaje la hace:
// [saltar] [sentarse] [bailar] [malabares] [cantar] [dormir] [vuelta] [aplaudir] [saludar] [cucú] [besito] [abrazo]
// No borres la primera línea (FRASES) ni la última.
FRASES(`
🪥 Dientes | ¡Hola {nombre}! Es hora de lavarse los dientes. ¡Vamos a dejarlos brillantes como estrellitas!
😴 A dormir | {nombre}, ya es de noche y hasta los ratoncitos se van a dormir. ¡Que sueñes cosas lindas!
🥦 Verduras | ¿Sabés una cosa, {nombre}? Las verduras te hacen fuerte y feliz. ¡Probá un bocadito por mí!
🧸 Juguetes | ¡{nombre}! ¿Me ayudás a guardar los juguetes? ¡Hagamos una carrera a ver quién guarda más!
🛁 Baño | ¡Llegó la hora del baño, {nombre}! Mucha espuma y muchas burbujas. ¡Qué divertido!
❤️ Te quiero | {nombre}, te quiero muchísimo. ¡Sos una niña maravillosa!
🎉 ¡Bravo! | ¡Bravo {nombre}! ¡Lo hiciste muy, muy bien! Estoy muy orgullos{o|a} de vos.
🎉 Fiesta | ¡Hagamos una fiesta, {nombre}! [bailar]
`);
