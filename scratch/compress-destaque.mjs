import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = './src/assets/destaque';
const outputDir = './src/assets/destaque-compressed';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));

console.log(`Encontradas ${files.length} imagens de destaque. Comprimindo...`);

async function processImages() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    await sharp(inputPath)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
      
    process.stdout.write(`\rProcessando: ${i + 1}/${files.length} (${file})        `);
  }
  console.log('\nCompressão de destaques concluída!');
}

processImages().catch(console.error);
