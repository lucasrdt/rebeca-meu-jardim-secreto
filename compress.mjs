import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = './src/assets/festa';
const outputDir = './src/assets/festa-compressed';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));

console.log(`Encontradas ${files.length} imagens. Corrigindo orientação e comprimindo...`);

async function processImages() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    await sharp(inputPath)
      .rotate() // Lê os dados da câmera (EXIF) e rotaciona a foto para a posição correta (vertical)
      .resize({ width: 1920, withoutEnlargement: true }) // Redimensiona
      .jpeg({ quality: 80 }) // Comprime
      .toFile(outputPath);
      
    process.stdout.write(`\rCorrigindo: ${i + 1}/${files.length} (${file})        `);
  }
  console.log('\nCorreção concluída com sucesso!');
}

processImages().catch(console.error);
