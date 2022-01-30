#!/usr/bin/env python3
# -*- coding: utf8 -*-

import sys, joblib
import numpy as np
from PIL import Image
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.python.keras import backend as K

config = tf.compat.v1.ConfigProto()
config.gpu_options.per_process_gpu_memory_fraction=0.01
K.set_session(tf.compat.v1.Session(config=config))

# Image.open('image/test.png')
# testX = np.array( Image.open('image/test.png').resize((28, 28)) )
testX = np.array( Image.open(sys.argv[3]).resize((32, 32)) )
testX = testX.astype('float32')
testX[:,:,-1] = MinMaxScaler().fit_transform( testX[:,:,-1] )

testX[:,:,0] = testX[:,:,-1]
testX = np.delete(testX, [1, 2, 3], axis=2)
testX = testX.reshape(1, testX.shape[0], testX.shape[1], 1)

# model = pck.load( open('model/digitCnnClassifier.bin', 'rb') )
model = joblib.load(sys.argv[1])
intToStrMap = joblib.load(sys.argv[2])

print(intToStrMap[np.argmax(model.predict(testX))])