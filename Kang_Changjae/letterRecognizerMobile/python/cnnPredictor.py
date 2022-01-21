#!/usr/bin/env python3
# -*- coding: utf8 -*-

import sys
import numpy as np
from PIL import Image
from sklearn.preprocessing import MinMaxScaler
import pickle as pck

# Image.open('image/test.png')
# testX = np.array( Image.open('image/test.png').resize((28, 28)) )
testX = np.array( Image.open(sys.argv[2]).resize((28, 28)) )
testX = testX.astype('float32')
testX[:,:,-1] = MinMaxScaler().fit_transform( testX[:,:,-1] )

testX[:,:,0] = testX[:,:,-1]
testX = np.delete(testX, [1, 2, 3], axis=2)
testX = testX.reshape(1, testX.shape[0], testX.shape[1], 1)

# model = pck.load( open('model/digitCnnClassifier.bin', 'rb') )
model = pck.load( open(sys.argv[1], 'rb') )

print( np.argmax(model.predict(testX)) )