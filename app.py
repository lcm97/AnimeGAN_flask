import argparse
from utils import *
import os
import time
import numpy as np
from net import generator
import base64

# Flask utils
from flask import Flask, send_from_directory, request, render_template
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

# Define a flask app
app = Flask(__name__)

"""=============================读取模型==================================="""
# 存放模型的文件夹
checkpoint_dir = 'checkpoint/' + 'AnimeGAN_Hayao_lsgan_300_300_1_3_10'
# 输入的真实图片留存区，执行的时候再赋具体size的大小
test_real = tf.compat.v1.placeholder(tf.float32, [1, None, None, 3], name='test')
# 先初始化generator网络
with tf.compat.v1.variable_scope("generator", reuse=False):
    test_generated = generator.G_net(test_real).fake

saver = tf.compat.v1.train.Saver()
sess = tf.compat.v1.Session(config=tf.ConfigProto(allow_soft_placement=True))
# 加载模型
ckpt = tf.train.get_checkpoint_state(checkpoint_dir)  # checkpoint file information
if ckpt and ckpt.model_checkpoint_path:
    ckpt_name = os.path.basename(ckpt.model_checkpoint_path)  # first line
    saver.restore(sess, os.path.join(checkpoint_dir, ckpt_name))
    print(" [*] Success to read {}".format(ckpt_name))
else:
    print(" [*] Failed to find a checkpoint")
"""=============================================================================="""


def parse_args():
    desc = "Tensorflow implementation of AnimeGAN"
    parser = argparse.ArgumentParser(description=desc)

    parser.add_argument('--checkpoint_dir', type=str, default='checkpoint/' + 'AnimeGAN_Hayao_lsgan_300_300_1_3_10',
                        help='Directory name to save the checkpoints')
    parser.add_argument('--upload_dir', type=str, default='uploads',
                        help='Directory name of uploads photos')
    parser.add_argument('--result_dir', type=str, default='results',
                        help='Directory name of finished photos')

    return parser.parse_args()


def model_predict(img_file_path):
    sample_image = np.asarray(load_image(img_file_path))
    anime_img = sess.run(test_generated, feed_dict={test_real: sample_image})
    return anime_img


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # 生成图片
        anime_img = model_predict(file_path)
        os.remove(file_path)
        anime_img_name = str(int(round(time.time() * 1000)))+'.png'
        result_file_path = os.path.join(
            basepath, 'results', anime_img_name)
        save_images(anime_img, result_file_path)
        return anime_img_name

    return None


@app.route('/results/<filename>/', methods=['GET', 'POST'])
def get_image(filename):
    basepath = os.path.dirname(__file__)
    result_file_path = os.path.join(basepath, 'results')
    return send_from_directory(result_file_path, secure_filename(filename))


@app.route('/')
def hello_world():
    return 'Hello World!'


# def predict(upload_dir, result_dir):
#     begin = time.time()
# 读取图片
# image_file_path = os.path.join('uploads', 'car.jpg')
# result_file_path = os.path.join('results', 'car.jpg')
# sample_image = np.asarray(load_image(image_file_path))
# 生成图片
# anime_img = sess.run(test_generated, feed_dict={test_real: sample_image})
# 保存生成的图片
# save_images(anime_img, result_file_path)
# end = time.time()
# print(f'test-time: {end - begin} s')

if __name__ == '__main__':
    arg = parse_args()
    app.run(debug=True, host='0.0.0.0')
