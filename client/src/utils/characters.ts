export const Characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789' +
  '@#$%&';

  export const getRandomCharacter = (): string => {
    return Characters[Math.floor(Math.random() * Characters.length)];
  }

  export const matricFace = [
     "/faces/neo.png",
     "/faces/morpheus.png",
     "/faces/trinity.png",
     "/faces/smith.png",
     "/faces/oracolo.png",
  ]

