import { Jimp } from 'jimp';

async function mergeImages() {
  const images = [
    'C:/Users/hp pavilion/.gemini/antigravity/brain/f468abc4-08fe-4796-b65e-662066116e18/media__1780342436459.jpg',
    'C:/Users/hp pavilion/.gemini/antigravity/brain/f468abc4-08fe-4796-b65e-662066116e18/media__1780342440636.jpg',
    'C:/Users/hp pavilion/.gemini/antigravity/brain/f468abc4-08fe-4796-b65e-662066116e18/media__1780342442321.jpg',
    'C:/Users/hp pavilion/.gemini/antigravity/brain/f468abc4-08fe-4796-b65e-662066116e18/media__1780342445273.jpg'
  ];

  try {
    const loadedImages = await Promise.all(images.map(img => Jimp.read(img)));
    
    for(let i=0; i<4; i++) {
        loadedImages[i].resize({ w: 500, h: 500 });
    }

    const newImage = new Jimp({ width: 1012, height: 1012, color: 0x00000000 });
    
    newImage.composite(loadedImages[0], 0, 0);
    newImage.composite(loadedImages[1], 512, 0);
    newImage.composite(loadedImages[2], 0, 512);
    newImage.composite(loadedImages[3], 512, 512);

    await newImage.write('c:/Users/hp pavilion/Desktop/lim/old-site/tiles_cover.png');
    await newImage.write('c:/Users/hp pavilion/Desktop/lim/public/tiles_cover.png');
    console.log("Merge completed!");
  } catch (err) {
    console.error(err);
  }
}

mergeImages();
