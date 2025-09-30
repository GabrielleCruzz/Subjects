export const words = [
  'MATEMATICA',
  'HISTORIA',
  'GEOGRAFIA',
  'CIENCIAS',
  'PORTUGUES',
  'ALGEBRA',
  'GEOMETRIA',
  'LITERATURA',
  'BIOLOGIA',
  'QUIMICA',
  'FISICA',
  'FILOSOFIA',
  'SOCIOLOGIA',
  'EQUACAO',
  'VARIAVEL',
  'SUBSTANTIVO',
  'ADJETIVO',
  'REVOLUCAO',
  'IMPERIO',
  'REPUBLICA',
  'ECOSSISTEMA',
  'CELULA',
  'ATOMO',
  'MOLECULA',
  'GRAVIDADE',
]

export function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)]
}
