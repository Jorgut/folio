const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(`${__dirname}/wireframes.html`, 'utf8');
const articles = Array.from({length: 6}, () => ({dataset: {}, hidden: false}));
const events = {};
const classes = new Set();
const document = {
  querySelector: () => ({querySelectorAll: () => articles, append: a => articles.push(a)}),
  createElement: () => ({dataset: {}, hidden: false, innerHTML: ''}),
  getElementById: id => ({addEventListener: (_, handler) => events[id] = handler}),
  body: {classList: {toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name)}}
};
vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], {document});
assert.equal(articles.length, 45);
assert.equal(new Set(articles.slice(6).map(a => a.dataset.id)).size, 39);
for (let i = 38; i <= 45; i++) assert(articles.some(a => a.dataset.id === `L${i}`));
assert(articles.find(a => a.dataset.id === 'L45').innerHTML.includes('未观测'));
assert(articles.find(a => a.dataset.id === 'L40').innerHTML.includes('contain'));
assert(html.includes('article>p,article>h2{display:none}'), 'Print must hide only catalogue annotations');
assert(!html.includes('article p,h2{display:none}'), 'Print must preserve slide paragraphs');
assert(html.includes('.screen-frame{flex:1;'), 'Screenshot frame must fill remaining figure height');
assert(html.includes('.screen-chrome{flex-shrink:0;'), 'Screenshot chrome must retain its height');
const l31 = articles.find(a => a.dataset.id === 'L31').innerHTML;
const l35 = articles.find(a => a.dataset.id === 'L35').innerHTML;
assert(l35.includes('body top-bottom'), 'L35 must reserve a content-sized explanation row');
assert(l35.includes('grid-template-columns:1fr 1fr'), 'L35 must retain equal image columns');
assert(l35.includes('grid-column:1 / 3'), 'L35 explanation must span both columns');
assert(html.includes('.top-bottom{grid-template-rows:minmax(0,1fr) auto}'));
assert(articles.find(a => a.dataset.id === 'L32').innerHTML.includes('stack detail-expansion'));
assert(html.includes('.detail-expansion>.fig{flex:1;min-height:0}'));
assert(html.includes('.detail-expansion>.annotation{flex-shrink:0}'));
const l45 = articles.find(a => a.dataset.id === 'L45').innerHTML;
const l38 = articles.find(a => a.dataset.id === 'L38').innerHTML;
assert(l38.includes('辅助图 A'));
assert(!l38.includes('竖图 A'));
const l43 = articles.find(a => a.dataset.id === 'L43').innerHTML;
assert(l43.includes('易用程度：由下至上增高'));
assert(!l43.includes('易用程度：低 → 高'));
assert(l45.includes('同一月份列纵向比较不同起始组'));
assert(l45.includes('同一行横向观察该组随时间的留存变化'));
assert(!l45.includes('按相同生命周期横向比较'));
assert.equal((l31.match(/display:grid/g) || []).length, 2, 'Both L31 wrappers must stretch their figures');
for (const id of ['L25', 'L26']) {
  const markup = articles.find(a => a.dataset.id === id).innerHTML;
  assert(markup.includes('slide full'));
  assert(markup.includes('image full-image'));
}
for (const category of ['image', 'opening', 'text', 'data', 'process', 'portfolio', 'closing']) {
  events.category({target: {value: category}});
  assert(articles.some(a => !a.hidden), `${category} is empty`);
  assert(articles.filter(a => !a.hidden).every(a => a.dataset.category === category));
}
events.category({target: {value: 'all'}});
assert(articles.every(a => !a.hidden));
events.guides({target: {checked: true}});
assert(classes.has('show-guides'));
events.focus({target: {checked: true}});
assert(classes.has('focus'));
events.guides({target: {checked: false}});
assert(!classes.has('show-guides'));
console.log('PASS: 45 entries, 7 categories, new layout IDs, retention states, screenshot containment, filtering, focus and guide controls. DOM stub only; not a rendered visual test.');
