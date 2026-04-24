export const Characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789' +
  '@#$%&';

  export const getRandomCharacter = (): string => {
    return Characters[Math.floor(Math.random() * Characters.length)];
  }

  export const Phrases = [
    'The Matrix has you...',
    'Follow the white rabbit.',
    'Knock, knock, Neo.',
    'Welcome to the real world.',
    'There is no spoon.',
    'I know kung fu.',
    'What is real? How do you define real?',
    'The Matrix is everywhere.',
    'You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes.',
    'Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.'
  ];

  export const getRandomPhrase = () : string => { return Phrases[Math.floor(Math.random() * Phrases.length)]; };