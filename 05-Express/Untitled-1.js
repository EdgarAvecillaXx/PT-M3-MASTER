var blocks = 'BO XK DQ CP NA GT RE TG QD FS JW HU VI AN OB ER FS LY PC ZM';
var word = ['a', 'bark', 'book', 'TreAt', 'common', 'Squad', 'confuse'];

function CheckWord(blocks, word) {
  let blocksSet = blocks.split(' ');
  const letters = [...word.toUpperCase()];
  let idx = 0;

  while (idx < letters.length) {
    const wordFound = !blocksSet.every((block, i) => {
      if (block.includes(letters[idx])) {
        blocksSet.splice(i, 1);
        idx++;
        return false;
      } else {
        return true;
      }
    });
    if (idx === letters.length || !wordFound) return wordFound;
  }
}
