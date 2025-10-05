const LEVELS = [
    { name: 'Bronze', min: 0 },
    { name: 'Silver', min: 5 },
    { name: 'Gold', min: 15 },
    { name: 'Platinum', min: 30 }
  ];
  
  function getLevelName(closes) {
    return LEVELS.slice().reverse().find(l => closes >= l.min)?.name || 'Niveau';
  }
  
  function getNextLevelMin(closes) {
    const next = LEVELS.find(l => l.min > closes);
    return next ? next.min : closes + 10;
  }
  
  function makeProgressBar(closes, nextMin, width = 20) {
    const prevMin = LEVELS.slice().reverse().find(l => l.min <= closes)?.min || 0;
    const span = nextMin - prevMin;
    const progress = Math.max(0, Math.min(closes - prevMin, span));
    const ratio = span === 0 ? 0 : progress / span;
    const filled = Math.round(ratio * width);
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
    return { bar, ratio };
  }
  
  module.exports = { LEVELS, getLevelName, getNextLevelMin, makeProgressBar };
  