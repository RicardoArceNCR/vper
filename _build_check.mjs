import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import fs from 'fs';

const css = fs.readFileSync('src/app/globals.css', 'utf8');

postcss([tailwindcss({ base: process.cwd() })])
  .process(css, { from: 'src/app/globals.css', to: '/tmp/out.css' })
  .then(result => {
    fs.writeFileSync('/tmp/out.css', result.css);
    console.log('OK, wrote', result.css.length, 'bytes');
  })
  .catch(err => {
    console.error('ERROR:', err.message);
    console.error(err.stack);
    process.exit(1);
  });
