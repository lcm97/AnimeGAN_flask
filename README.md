# AnimeGAN
The Backend server for weapp AnimeGAN. A Tensorflow implementation of AnimeGAN for fast photo animation.
  
-----  
This is the Open source of the paper <AnimeGAN: a novel lightweight GAN for photo animation>, which uses the GAN framwork to transform real-world photos into anime images.  
  
**Some suggestions:** since the real photos in the training set are all landscape photos, if you want to stylize the photos with people as the main body, you may as well add at least 3000 photos of people in the training set and retrain to obtain a new model.  

___  

## Requirements  
- python 3.6.8  
- tensorflow-gpu 1.8  
- opencv  
- tqdm  
- numpy  
- glob  
- argparse  
  